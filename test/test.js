const justmark = require('../build/index');

justmark
    .build({
        blogDir: './test',
        targets: ['article.tsx'],
        outputTo: 'fs',
        outputDir: './test-out',
    })
    .then(() => {
        console.log('OK');
    });
