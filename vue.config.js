const { defineConfig } = require('@vue/cli-service')
const UniWebpackPlugin = require('@dcloudio/vue-cli-plugin-uni/lib/webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new UniWebpackPlugin()]
  }
})
