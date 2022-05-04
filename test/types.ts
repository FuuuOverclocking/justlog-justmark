export interface BlogMeta {
    title: string;
    copyright?: string;
    topics?: string[];
    lang?: '简体中文' | 'English';
    bgImage?: string;
}

export interface Blog extends BlogMeta {
    content: any;
}
