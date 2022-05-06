import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import { Compiler } from './compiler/compiler';
import { CompilerOptions } from './types';
import { debug, panic, panicIfNot } from './utils/debug';

export async function rebuild(options: CompilerOptions, paths: BlogFilesPaths) {
    await checkBlogFiles(paths);

    const timeBegin = Date.now();

    const targets = new Set(options.targets);
    // TODO: 现在只有 article.tsx, 需要支持其他 target
    const markdown = await fs.readFile(paths['article.md'], 'utf-8').catch((e) => {
        throw new Error(`无法读取 ${paths['article.md']}`);
    });
    const tsx = await fs.readFile(paths['article.tsx'], 'utf-8').catch((e) => {
        throw new Error(`无法读取 ${paths['article.tsx']}`);
    });

    const compiler = Compiler.getInstance(options);
    const blogObjectString = compiler.compileMarkdown(markdown);
    const result = await format(mixBlogIntoTsx(tsx, blogObjectString));

    const buildTime = ((Date.now() - timeBegin) / 1000).toFixed(3);
    debug.withTime.info(`编译完成, 用时 ${buildTime} 秒.`);

    if (options.outputTo === 'fs') {
        const outputPaths = getOutputFilesPaths(options.outputDir);
        try {
            await fs.writeFile(outputPaths['article.tsx'], result, {
                encoding: 'utf-8',
            });
        } catch (e) {
            debug.error(`写入 ${outputPaths['article.tsx']} 失败.`);
            throw e;
        }
        return;
    }
    if (options.outputTo === 'receiver') {
        options.receiver([
            {
                name: 'article.tsx',
                text: result,
            },
        ]);
        return;
    }
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
            'outputTo 设置为了 "receiver", 但 receiver 不是 (results: CompilationResult[]) => void.',
        );
    } else {
        panic('未设置 outputTo.');
    }
}

export interface BlogFilesPaths {
    'article.md': string;
    'article.tsx': string;
}

export function getBlogFilesPaths(blogDir: string): BlogFilesPaths {
    return {
        'article.md': path.resolve(blogDir, './article.md'),
        'article.tsx': path.resolve(blogDir, './article.tsx'),
    };
}

export function getOutputFilesPaths(outputDir: string) {
    return {
        'article.tsx': path.resolve(outputDir, './article.tsx'),
    };
}

export async function checkBlogFiles(paths: BlogFilesPaths): Promise<void> {
    const files = ['article.md', 'article.tsx'] as const;

    await Promise.all(
        files.map((f) =>
            fs.stat(paths[f]).then(
                (stat) => {
                    if (!stat.isFile()) throw new Error(`<BlogDir>/${f} 不是文件.`);
                },
                (e) => {
                    throw new Error(`<BlogDir>/${f} 不存在, 或其他错误.`);
                },
            ),
        ),
    );
}

export function mixBlogIntoTsx(tsx: string, blogObjectString: string): string {
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
const prettierrcPromise = prettier.resolveConfig(
    path.resolve(__dirname, '../.prettierrc.toml'),
);

export async function format(source: string): Promise<string> {
    const prettierrc = await prettierrcPromise;
    if (!prettierrc) {
        debug.error('无法读取 justmark/.prettierrc.toml, 未执行输出文件的格式化.');
        return source;
    }

    try {
        return prettier.format(source, {
            ...prettierrc,
            parser: 'typescript',
        });
    } catch (e) {
        debug.error('prettier 格式化文件时发生了错误, 输出未格式化文件.');
        return source;
    }
}
