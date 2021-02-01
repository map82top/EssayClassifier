const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var SRC = path.resolve(__dirname, 'src/assets');
const PUBLIC_PATH = '/';

module.exports = {
    entry: {
        dev: './src/index.js'
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'static'),
        sourceMapFilename: "js/[name].js.map"
    },
    devtool: "source-map",
    devServer: {
        writeToDisk: true,
        stats: 'errors-only',
        // hot: true,
        // open: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: [/node_modules/],
                use: {
                    loader: "babel-loader"
                }
            }, {
                test: /\.(s*)css$/,
                include: /src/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                path.resolve(__dirname, 'src/styles/index.scss')
                            ]
                        }
                    }
                ]
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                include: SRC,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            title: "Learning Webpack"
        }),
    ],
}