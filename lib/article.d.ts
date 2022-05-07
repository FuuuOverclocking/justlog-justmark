declare function order(id: string): any;

declare namespace JSX {
    interface IntrinsicElements {
        [tagName: string]: any;
    }
}

declare interface BlogMeta {
    title: string;
    copyright?: string;
    topics?: string[];
    lang?: '简体中文' | 'English';
    bgImage?: string;
}

declare interface Blog extends BlogMeta {
    content: React.ReactNode;
}

declare module '#react' {
    import * as React from 'react';
    export = React;
}
