/// <reference path="../lib/article.d.ts" />

declare function blog(): Blog;

function blogExtended(): Blog {
    return Object.assign(blog(), {
        // ...
    });
}

function Button() {
    return <button></button>;
}
