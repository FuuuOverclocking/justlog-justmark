/// <reference path="../lib/article.d.ts" />
import React from '#react';

declare function blog(): Blog;

function extendBlog(): Partial<Blog> {
    return {};
}

const Button: React.FC<{
    children: React.ReactNode;
}> = (props) => {
    return <button>{props.children}</button>;
};
