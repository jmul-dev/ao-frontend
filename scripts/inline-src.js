const { inlineSource } = require('inline-source');
const fs = require('fs');
const path = require('path');
const htmlpath = path.resolve('./build/index.html');

console.log(`Inlining source for ${htmlpath}`)

inlineSource(htmlpath, {
    compress: false,
    rootpath: path.resolve('./build'),
    attribute: false,
    // Skip all css types and png formats
    // ignore: ['css', 'png']
}).then(html => {
    // Do something with html
    console.log(`Writing inlined source back to disk...`)
    fs.writeFile(htmlpath, html, (error) => {
        if (error) {
            console.error(error)
        }
    })
}).catch(err => {
    // Handle error
    console.error(err)
});
