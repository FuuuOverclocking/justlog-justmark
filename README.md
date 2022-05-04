# JustMark

## 使用方法

```ts
import { build, watch } from 'justmark';

build({
    blogDir: '../blogs/it-s-a-good-day',
    targets: ['article.tsx'],
    outputTo: 'file',
    outputFile: '/path/to/result',
}).then(() => {
    // ...
});
```

## JustMark 约定

1. 编码, 行结束符, 缩进
    - Encoding: UTF-8
    - Indent: 4 spaces
    - Line ending: LF
2. 文件头可放置博客的元数据

    例如
    ````toml
    ```blog
    copyright = 'CC BY-ND 4.0'
    topics = ['rust', 'net']    # 博客的主题, 或关键词
    lang = '简体中文'           # 还可以为 English
    bgImage = './res/bg.png'    # 封面图片
    ```
    ````
3. 第一个一级标题将成为博客的标题
4. 可以嵌入 React 组件

    ````ts
    ```tsx embed
    <Button />
    ```
    ````

    在嵌入的组件中使用的标识符, 应已在 `article.tsx` 中声明.

## 博客的元数据

均为可选项.

````toml
```blog
copyright = 'CC BY-ND 4.0'  # 版权信息
topics = ['rust', 'net']    # 博客的主题, 或关键词
lang = '简体中文'           # 还可以为 English
bgImage = './res/bg.png'    # 封面图片
title = '标题'              # 若指定了该项, markdown 中的第一个一级标题不会成为标题
```
````

## TODO

- Admonitions
- Code block: title, line numbers, Highlighting specific lines
- Content tabs
- flow chart