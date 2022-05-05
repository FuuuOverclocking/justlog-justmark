declare interface BlogMeta {
    title: string;
    copyright?: string;
    topics?: string[];
    lang?: '简体中文' | 'English';
    bgImage?: string;
}

declare interface Blog extends BlogMeta {
    content: any;
}

declare namespace JSX {
    export interface IntrinsicElements {
        [tagName: string]: any;
    }
}

declare function order(id: string): any;
