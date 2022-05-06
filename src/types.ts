import { ReactNode } from 'react';

export type Source = 'article.md' | 'article.tsx';
export type Target = 'blog.tsx' | 'blog-bundle.js' | 'zhihu.md';

export type CompilerOptions = {
    /** 输入的博客文件夹. */
    blogDir: string;
    /** 编译目标. */
    targets: Target[];
    /** silent = true 时, 禁止在终端打印各种信息. */
    silent?: boolean;
} & OutputOptions;

export type OutputOptions =
    | {
          outputTo: 'fs';
          outputDir: string;
      }
    | {
          outputTo: 'receiver';
          receiver: (results: CompilationResult) => void;
      };

export type CompilationResult = {
    [target in Target]?: string;
};

export type BuildStep = (
    sources: { 'article.md': string; 'article.tsx': string },
    result: CompilationResult,
    options: CompilerOptions,
) => Promise<void>;

export interface BlogMeta {
    title: string;
    copyright?: string;
    topics?: string[];
    lang?: '简体中文' | 'English';
    bgImage?: string;
}

export interface Blog extends BlogMeta {
    content: ReactNode;
}
