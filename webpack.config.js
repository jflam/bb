module.exports = {
    entry: ['./public/scripts/scoreboard.js'],
    output: {
        path: './public/build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader' }
        ]
    }
};
