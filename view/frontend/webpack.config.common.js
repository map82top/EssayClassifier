const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ASSETS_PATH = path.resolve(__dirname, 'src/assets');


module.exports =  {
    entry: './src/index.js',
    output: {
        filename: 'js/[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'static'),
        // sourceMapFilename: "js/[name].js.map"
    },
    plugins: [
        new WebpackNotifierPlugin({ alwaysNotify: false }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            title: "Essay estimator",
            inject: true,
            cache: false
        }),
        // new BundleAnalyzerPlugin(),
    ],
     module: {
            rules: [
                {
                    test: /\.(js||jsx|)$/,
                    exclude: [/node_modules/],
                    use: {
                        loader: "babel-loader"
                    }
                }, {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    include: ASSETS_PATH,
                    loader: 'file-loader'
                }
            ]
        },
}