const path = require('path');
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.config.common.js')


module.exports = merge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        writeToDisk: true,
        stats: 'errors-only',
    },
    module: {
            rules: [
                {
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
                }
            ]
    },
    performance: {
        hints: false,
    },

});
