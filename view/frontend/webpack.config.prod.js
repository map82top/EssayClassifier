const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ASSETS_PATH = path.resolve(__dirname, 'src/assets');


module.exports = merge(commonConfig, {
    mode: 'production',
    devtool: 'source-map',
    module: {
            rules: [
                {
                    test: /\.(s*)css$/,
                    include: /src/,
                    use: [
                        MiniCssExtractPlugin.loader,
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
                }
            ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'style/[name].[contenthash].css',
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                chunks: 'all',
                vendors: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    },
                }
            }),
            new TerserPlugin({
                parallel: true,
              }),
        ]
    }
})