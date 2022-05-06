import { CompilerOptions } from './types';
import { debug, DebugLevel, setDebugLevel } from './utils/debug';
import { checkCompilerOptions, getBlogFilesPaths, rebuild } from './build-steps';

/**
 * 给定博客文件夹, 编译到给定目标, 输出到文件系统, 或调用用户提供的 receiver.
 *  
 * @param options 编译选项
 * @returns 编译完成时, Promise resolve(void); 发生错误时, reject(err).
 */
export async function build(options: CompilerOptions): Promise<void> {
    if (options.silent) setDebugLevel(DebugLevel.None);
    
    await checkCompilerOptions(options);
    const paths = getBlogFilesPaths(options.blogDir);

    try {
        await rebuild(options, paths);
    } catch (e) {
        if (e instanceof Error) {
            debug.error((e as Error).message);
        } else {
            debug.error(String(e));
        }
        throw e;
    }
}
