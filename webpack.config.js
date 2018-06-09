const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: 'css/[name].css'
});

module.exports = {
    entry: ['./web/src/index.js', './web/css/index.scss'],
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'web', 'dist'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }, {
                    loader: 'sass-loader'
                }]
            })
        }, {
            test: /\.(woff2|ttf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'dist/fonts/'
                }
            }
        }]
    },
    plugins: [
        extractSass
    ]
};
