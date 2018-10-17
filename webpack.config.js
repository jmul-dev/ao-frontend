/**
 * NOTE: this is used specifically for bundling the static standalone ico page. 
 * Otherwise, we are still using react-scripts (have not ejected).
 */
const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const glob = require("glob")

module.exports = {
    entry: {
        "bundle.js": glob.sync("build/static/?(js|css)/main.*.?(js|css)").map(f => path.resolve(__dirname, f)),
    },
    output: {
        filename: "build/static/js/bundle.min.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        // options: {
                        //     // limit: 8192
                        // }
                    }
                ]
            }
        ],
    },
    plugins: [new UglifyJsPlugin()],
}