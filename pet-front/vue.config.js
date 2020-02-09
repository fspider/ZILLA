module.exports = {
  baseUrl: process.env.VUE_APP_BASE_URL,
  devServer: {

  	port: 8090,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        includePaths: [
          'node_modules', 'src',
        ],
      },
    },
  }
}