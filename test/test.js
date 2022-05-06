const justmark = require('../build/index');

justmark
    .build({
        blogDir: './test',
        targets: ['blog.tsx', 'blog-bundle.js', 'zhihu.md'],
        outputTo: 'fs',
        outputDir: './test-out',
    })
    .then(() => {
        justmark.watch({
            blogDir: './test',
            targets: ['blog.tsx', 'blog-bundle.js', 'zhihu.md'],
            outputTo: 'fs',
            outputDir: './test-out',
        });
    });
