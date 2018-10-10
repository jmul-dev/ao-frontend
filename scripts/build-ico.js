const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths.js');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

console.log(paths);

fs.emptyDirSync( path.resolve(__dirname, '../build-ico') );
fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });

process.env.NODE_ENV = 'production'
webpack(webpackConfig, function(err, stats) {
    if ( err ) {
        console.error(err)
    }
})