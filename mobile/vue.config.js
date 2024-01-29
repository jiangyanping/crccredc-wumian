module.exports = {
    publicPath: './',

    /*configureWebpack: {
        devtool: '#eval-source-map ',
        optimization: {
            minimize: true,
            namedModules: true,
            namedChunks: true,
            removeAvailableModules: true,
            flagIncludedChunks: true,
            occurrenceOrder: false,
            usedExports: true,
            concatenateModules: true,
            sideEffects: false, // <----- in prod defaults to true if left blank
        }
    },*/
    devServer: {
        watchOptions: {
            ignored: ['node_modules'],
        },
    },

    transpileDependencies: [
      'vuetify'
    ]
}
