import fs from 'fs-extra';
import { CompilerOptions } from './types';
import { debug } from './utils/debug';
import {
    BlogFilesPaths,
    checkBlogFiles,
    checkCompilerOptions,
    format,
    getBlogFilesPaths,
    getOutputFilesPaths,
    mixBlogIntoTsx,
} from './build';
import { Compiler } from './compiler/compiler';
import { debounce } from './utils/tools';

export async function watch(options: CompilerOptions): Promise<void> {
    await checkCompilerOptions(options);
    const paths = getBlogFilesPaths(options.blogDir);

    let isBuilding = false;
    let shouldBuildAgain = false;
    const onFilesChange = debounce(() => {
        if (isBuilding) {
            shouldBuildAgain = true;
            return;
        }

        isBuilding = true;
        shouldBuildAgain = false;
        debug.withTime.info(`文件发生变化, 正在编译...`);
        rebuild(options, paths).then(() => {
            isBuilding = false;
            if (shouldBuildAgain) onFilesChange();
        });
    }, 500);

    fs.watch(paths['article.md'], onFilesChange);
    fs.watch(paths['article.tsx'], onFilesChange);

    debug.withTime.info('在 watch 模式下开始编译...');
    isBuilding = true;
    rebuild(options, paths).then(() => {
        isBuilding = false;
        if (shouldBuildAgain) onFilesChange();
    });
}

async function rebuild(options: CompilerOptions, paths: BlogFilesPaths) {
    try {
        await checkBlogFiles(paths);

        const timeBegin = Date.now();

        const targets = new Set(options.targets);
        // TODO: 现在只有 article.tsx, 需要支持其他 target

        const markdown = await fs.readFile(paths['article.md'], 'utf-8').catch((e) => {
            throw `无法读取 ${paths['article.md']}`;
        });
        const tsx = await fs.readFile(paths['article.tsx'], 'utf-8').catch((e) => {
            throw `无法读取 ${paths['article.tsx']}`;
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
                console.error(e);
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
    } catch (reason) {
        debug.error(reason as string);
        return;
    } finally {
        console.log();
    }
}
