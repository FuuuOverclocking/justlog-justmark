import fs from 'fs-extra';
import { CompilerOptions } from './types';
import { debug, DebugLevel, setDebugLevel } from './utils/debug';
import { checkCompilerOptions, getBlogFilesPaths, rebuild } from './build-steps';

/**
 * 监视给定博客文件夹, 持续编译到给定目标, 输出到文件系统, 或调用用户提供的 receiver.
 *
 * 容忍输入的博客文件的错误. 当输入文件恢复正确时, 能再次编译.
 *
 * @param options 编译选项
 * @returns 检查编译器选项后, Promise resolve; 编译器选项错误时, 终止程序.
 *          调用 stopWatch 可停止监视.
 */
export async function watch(
    options: CompilerOptions,
): Promise<{ stopWatch: () => void }> {
    if (options.silent) setDebugLevel(DebugLevel.None);

    await checkCompilerOptions(options);
    const paths = getBlogFilesPaths(options.blogDir);

    // rebuild 执行的规则:
    // 1. 完成了一次 rebuild 后, 才能进行下次 rebuild
    // 2. 每秒最多只能调用一次 rebuild, 多余的 rebuild 被忽略
    // 3. 最后可能要补一次 rebuild, 使最终一致
    // 4. 应该尽快调用 rebuild, 但不能违反上面 3 条
    let isBuilding = false;
    let isLatest = false;
    let lastBuildAt = -1;
    const onFilesChange = () => {
        if (isBuilding || Date.now() < lastBuildAt + 1000) {
            isLatest = false;
            return;
        }

        debug.withTime.info(`文件发生变化, 正在编译...`);
        wrapper();
    };
    const wrapper = async () => {
        isBuilding = true;
        isLatest = true;
        lastBuildAt = Date.now();

        try {
            await rebuild(options, paths);
        } catch (e) {
            if (e instanceof Error) {
                debug.error((e as Error).message);
            } else {
                debug.error(String(e));
            }
        } finally {
            debug.raw.info(); // 打印换行符, 分隔前后行
        }

        isBuilding = false;
        if (!isLatest) {
            const willRebuildAt = lastBuildAt + 1200;
            const timeLeft = Math.max(0, willRebuildAt - Date.now());
            setTimeout(onFilesChange, timeLeft);
        }
    };

    const watchers = [
        fs.watch(paths['article.md'], onFilesChange),
        fs.watch(paths['article.tsx'], onFilesChange),
    ];

    debug.withTime.info('在监视模式下开始编译...');
    wrapper();

    return {
        stopWatch(): void {
            watchers.forEach((w) => w.close());
        },
    };
}
