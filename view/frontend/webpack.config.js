const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')

var SRC = path.resolve(__dirname, 'src/assets');
const PUBLIC_PATH = '/';

module.exports = (env, argv) => {
    const modeEnv = argv.mode || 'development'
    const isProd = modeEnv === 'production'
    const optimizations = {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [],
    }

    if (isProd) {
        optimizations.minimizer.push(new UglifyJsPlugin())
    }

    return {
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
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true },
                        },
                        // {
                        //     loader: 'postcss-loader',
                        //     options: {
                        //       sourceMap: true,
                        //       plugins: [
                        //         require('autoprefixer'),
                        //       ],
                        //     },
                        //   },
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                sourceMap: true,
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
            new WebpackNotifierPlugin({ alwaysNotify: false }),
            new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                filename: "index.html",
                title: "Learning Webpack"
            }),
        ],
        performance: {
            hints: false,
        },
        optimization: optimizations,
    }
}