const justmark = require('../build/index');

justmark.watch({
    blogDir: './test',
    targets: ['article.tsx'],
    outputTo: 'fs',
    outputDir: './test-out',
});
// .then(() => {
//     console.log('OK');
// });
