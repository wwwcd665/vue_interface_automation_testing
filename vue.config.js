const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {

        port: 8082, // 此处修改你想要的端口号
        host: '0.0.0.0',

    }
})
