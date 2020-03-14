module.exports = {
    entry: './js/client.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        rules:  [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            }
        ]
    }
};