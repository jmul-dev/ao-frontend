const { inlineSource } = require('inline-source');
const fs = require('fs');
const path = require('path');
const htmlpath = path.resolve('./build/index.html');
const htmlpathInlined = path.resolve('./build/index.inlined.html');

console.log(`Inlining source for:\n${htmlpath}\n`)

inlineSource(htmlpath, {
    compress: false,
    rootpath: path.resolve('./build'),
    attribute: false,
    // Skip all css types and png formats
    // ignore: ['png']
}).then(html => {
    // Do something with html
    console.log(`Writing inlined source back to disk...\n`)
    fs.writeFile(htmlpathInlined, html, (error) => {
        if (error) {
            console.error(error)
        }
    })
}).catch(err => {
    // Handle error
    console.error(err)
});
