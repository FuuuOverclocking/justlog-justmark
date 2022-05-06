import { ReactNode } from 'react';

export type CompilerOptions = {
    /**
     * 输入的博客文件夹.
     */
    blogDir: string;
    /**
     * 编译目标.
     */
    targets: Array<'article.tsx' | 'bundle.js' | 'zhihu.md'>;
    /**
     * silent = true 时, 禁止在终端打印各种信息.
     */
    silent?: boolean;
} & OutputOptions;

export type OutputOptions =
    | {
          outputTo: 'fs';
          outputDir: string;
      }
    | {
          outputTo: 'receiver';
          receiver: (results: CompilationResult[]) => void;
      };

export interface CompilationResult {
    name: string;
    text: string;
}

export interface BlogMeta {
    title: string;
    copyright?: string;
    topics?: string[];
    lang?: '简体中文' | 'English';
    bgImage?: string;
}

export interface Blog extends BlogMeta {
    content: ReactNode,
}
