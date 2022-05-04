import { ReactNode } from 'react';

export type CompilerOptions = {
    blogDir: string;
    targets: Array<'article.tsx' | 'zhihu.md'>;
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
