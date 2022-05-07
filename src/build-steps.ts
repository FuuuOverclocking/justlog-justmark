import fs from 'fs-extra';
import path from 'path';
import ts from 'typescript';
import { MdCompiler } from './compiler/md-compiler';
import { format } from './utils/formatter';
import { debug, panic, panicIfNot } from './utils/debug';
import { BuildStep, CompilationResult, CompilerOptions, Source, Target } from './types';

type BlogFilesPaths = Record<Source, string>;

export async function rebuild(options: CompilerOptions) {
    const timeBegin = Date.now();

    const paths = getBlogFilesPaths(options.blogDir);
    await checkBlogFiles(paths);

    const sources = {
        'article.md': await fs.readFile(paths['article.md'], 'utf-8').catch((e) => {
            throw new Error(`无法读取 ${paths['article.md']}`);
        }),
        'article.tsx': await fs.readFile(paths['article.tsx'], 'utf-8').catch((e) => {
            throw new Error(`无法读取 ${paths['article.tsx']}`);
        }),
    };

    const buildSteps = resolveTargets(options.targets);
    const result: CompilationResult = {};
    for (const step of buildSteps) {
        // 向 step() 传入了 result 对象的引用, 令其修改, 从而获得结果.
        await step(sources, result, options);
    }

    const buildTime = ((Date.now() - timeBegin) / 1000).toFixed(3);
    debug.withTime.info(`编译完成, 用时 ${buildTime} 秒.`);

    await output(options, result);
}

export async function checkCompilerOptions(options: CompilerOptions): Promise<void> {
    panicIfNot(options.targets.length !== 0, '未指定 target.');

    if (options.outputTo === 'fs') {
        panicIfNot(
            typeof options.outputDir === 'string',
            'outputTo 设置为了 "fs", 但 outputDir 不是 string.',
        );
        try {
            await fs.ensureDir(options.outputDir);
        } catch (e) {
            panic(`outputDir: ${options.outputDir} 不存在, 或无法访问.`);
        }
    } else if (options.outputTo === 'receiver') {
        panicIfNot(
            typeof options.receiver === 'function',
            'outputTo 设置为了 "receiver", 但 receiver 不是 (results: CompilationResult) => void.',
        );
    } else {
        panic('未设置 outputTo.');
    }
}

export function getBlogFilesPaths(blogDir: string): BlogFilesPaths {
    return {
        'article.md': path.resolve(blogDir, './article.md'),
        'article.tsx': path.resolve(blogDir, './article.tsx'),
    };
}

async function checkBlogFiles(paths: BlogFilesPaths): Promise<void> {
    const files = ['article.md', 'article.tsx'] as const;

    await Promise.all(
        files.map((f) =>
            fs.stat(paths[f]).then(
                (stat) => {
                    if (!stat.isFile()) throw new Error(`<BlogDir>/${f} 不是文件.`);
                },
                (e) => {
                    debug.withTime.error(`<BlogDir>/${f} 不存在, 或其他错误.`);
                    throw e;
                },
            ),
        ),
    );
}

function resolveTargets(targets: Target[]): BuildStep[] {
    const buildStepMap = {
        'blog.tsx': CompileMarkdownAndMix.step,
        'blog-bundle.js': CompileTsxAndPack.step,
        'zhihu.md': ConvertToZhihu.step,
    };

    const targetsSet = new Set(targets);
    const buildOrder: Target[] = [];

    if (targetsSet.has('blog-bundle.js')) {
        buildOrder.push('blog.tsx', 'blog-bundle.js');
    } else if (targetsSet.has('blog.tsx')) {
        buildOrder.push('blog.tsx');
    }

    if (targetsSet.has('zhihu.md')) {
        buildOrder.push('zhihu.md');
    }

    return buildOrder.map((target) => buildStepMap[target]);
}

async function output(options: CompilerOptions, result: CompilationResult) {
    if (options.outputTo === 'receiver') {
        options.receiver(result);
        return;
    }

    if (options.outputTo === 'fs') {
        const outputPaths = getOutputFilesPaths(options.outputDir);
        await fs.ensureDir(options.outputDir);

        for (const filename of options.targets) {
            try {
                await fs.writeFile(outputPaths[filename], result[filename], {
                    encoding: 'utf-8',
                });
            } catch (e) {
                debug.withTime.error(`写入 ${outputPaths[filename]} 失败.`);
                throw e;
            }
        }
        return;
    }

    function getOutputFilesPaths(outputDir: string): Record<Target, string> {
        return {
            'blog.tsx': path.resolve(outputDir, './blog.tsx'),
            'blog-bundle.js': path.resolve(outputDir, './blog-bundle.js'),
            'zhihu.md': path.resolve(outputDir, './zhihu.md'),
        };
    }
}

namespace CompileMarkdownAndMix {
    export const step: BuildStep = async (sources, result, options) => {
        const mdCompiler = MdCompiler.getInstance(options);
        const blogObjectString = mdCompiler.compileMarkdown(sources['article.md']);
        const { err, result: code } = await format(
            mixBlogIntoTsx(sources['article.tsx'], blogObjectString),
        );
        if (err) {
            debug.withTime.error(err);
        }
        result['blog.tsx'] = code;
    };

    function mixBlogIntoTsx(tsx: string, blogObjectString: string): string {
        const blogDeclaration = 'declare function blog(): Blog;';
        if (tsx.indexOf(blogDeclaration) === -1) {
            throw new Error(`在 article.tsx 未找到 \`${blogDeclaration}\` 声明.`);
        }

        tsx = tsx.replace(
            blogDeclaration,
            `function blog(): Blog { return ${blogObjectString}; }`,
        );

        return tsx;
    }
}

namespace CompileTsxAndPack {
    const typescriptCompilerOptions = {
        allowJs: true,
        target: ts.ScriptTarget.ES2018,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        newLine: ts.NewLineKind.LineFeed,
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        jsx: ts.JsxEmit.React,
    };

    export const step: BuildStep = async (sources, result, options) => {
        const codeInput = result['blog.tsx']!;
        const sourceFile = ts.createSourceFile(
            'blog.tsx',
            codeInput,
            ts.ScriptTarget.ES2018,
            true,
            ts.ScriptKind.TSX,
        );
        const importDeclToTranspile = findImportDeclToTranspile(sourceFile);
        const codeImportTranspiled = transpileImportDecl(
            codeInput,
            importDeclToTranspile,
        );

        const codeOutput = ts.transpileModule(codeImportTranspiled, {
            compilerOptions: typescriptCompilerOptions,
        });

        result['blog-bundle.js'] = codeOutput.outputText;
        // TODO: 用 webpack 打包
    };

    function findImportDeclToTranspile(sourceFile: ts.SourceFile): Array<{
        name: string;
        moduleName: string;
        pos: number;
        end: number;
    }> {
        const importDeclToTranspile: Array<{
            name: string;
            moduleName: string;
            pos: number;
            end: number;
        }> = [];

        ts.forEachChild(sourceFile, (node) => {
            const _node = node as ts.ImportDeclaration;
            if (_node.kind !== ts.SyntaxKind.ImportDeclaration) return;

            const moduleSpecifier = _node.moduleSpecifier as ts.StringLiteral;
            if (moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
                throw new Error('import 语句不符合 TypeScript 语法.');
            }

            const moduleName = moduleSpecifier.text;
            if (
                !moduleName.startsWith('./') &&
                !moduleName.startsWith('../') &&
                !moduleName.startsWith('/') &&
                !moduleName.startsWith('#')
            ) {
                throw new Error('不能在 JustMark 中直接使用非相对导入.');
            }
            if (!moduleName.startsWith('#')) return;

            const importClause = _node.importClause as ts.ImportClause;
            if (importClause.isTypeOnly) {
                throw new Error('不能在 JustMark 中使用 import type ...');
            }
            if (importClause.namedBindings) {
                throw new Error('不能在 JustMark 中使用导入命名绑定.');
            }
            if (!importClause.name) {
                throw new Error('非相对导入的 importClause 的标识符不存在.');
            }

            importDeclToTranspile.push({
                name: importClause.name.escapedText as string,
                moduleName,
                pos: _node.pos + _node.getLeadingTriviaWidth(),
                end: _node.end,
            });
        });

        return importDeclToTranspile;
    }

    function transpileImportDecl(
        codeInput: string,
        importDeclToTranspile: Array<{
            name: string;
            moduleName: string;
            pos: number;
            end: number;
        }>,
    ): string {
        const originalParts: string[] = [];
        let pos = 0;
        for (const decl of importDeclToTranspile) {
            originalParts.push(codeInput.substring(pos, decl.pos));
            pos = decl.end;
        }
        originalParts.push(codeInput.substring(pos));

        let codeImportTranspiled = '';
        for (const [i, decl] of importDeclToTranspile.entries()) {
            codeImportTranspiled += originalParts[i];
            codeImportTranspiled += `const ${decl.name} = order('${decl.moduleName}');`;
        }
        codeImportTranspiled += originalParts[originalParts.length - 1];

        return codeImportTranspiled;
    }
}

namespace ConvertToZhihu {
    export const step: BuildStep = async (sources, result, options) => {
        result['zhihu.md'] = '';
    };
}
