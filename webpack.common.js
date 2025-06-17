/*global require, module, __dirname */

const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.config.some(item => item === 'webpack.prod.js');

    return {
        output: {
            path: path.resolve(__dirname, 'deploy'),
            publicPath: '/',
            library: 'Entry',
        },

        entry: {
            'standup': path.resolve(__dirname, 'src/index.js'),
            'demoplan': path.resolve(__dirname, 'src/demoplan.js'),
        },

        plugins: [
            new webpack.ProgressPlugin(),
            new HtmlWebpackPlugin({
                filename: 'standup.html',
                chunks: ['standup'],
                template: path.resolve(__dirname, 'src/index.html'),
                // use a different script tag to load rally script depending on if we're running
                // locally (dev) or within the rally website
                custom: isProduction
                    ? '<script type="text/javascript" src="/apps/2.1/sdk.js"></script>'
                    : '<script type="text/javascript" src="https://rally1.rallydev.com/apps/2.1/sdk.js"></script>',
                inlineSource: '.(js|css)$',
                // needed to npm run watch reloads properly
                cache: false,
            }),
            new HtmlWebpackPlugin({
                filename: 'demoplan.html',
                chunks: ['demoplan'],
                template: path.resolve(__dirname, 'src/index.html'),
                // use a different script tag to load rally script depending on if we're running
                // locally (dev) or within the rally website
                custom: isProduction
                    ? '<script type="text/javascript" src="/apps/2.1/sdk.js"></script>'
                    : '<script type="text/javascript" src="https://rally1.rallydev.com/apps/2.1/sdk.js"></script>',
                inlineSource: '.(js|css)$',
                // needed to npm run watch reloads properly
                cache: false,
            }),
            // this plugin provides the inlineSource option to HtmlWebpackPlugin which inlines all
            // css and js into a single html file
            new HtmlInlineScriptPlugin(),
            new ESLintPlugin({
                configType: 'flat',
                threads: true,
                // fix: true,
                exclude: [
                    'node_modules',
                ],
            }),
            new webpack.DefinePlugin({
                'isProduction': isProduction,
            }),
        ],

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: [path.resolve(__dirname, 'src')],
                    loader: 'babel-loader'
                },
                {
                    test: /.(sa|sc|c)ss$/,

                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',

                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',

                            options: {
                                sourceMap: true
                            }
                        },
                    ]
                }
            ]
        }
    };
};
