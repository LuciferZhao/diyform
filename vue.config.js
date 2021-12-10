module.exports = {
  pages: {
    index: {
      // 入口
      entry: "src/main.js",
      // 标题
      title: "用户首页",
    },
  },

  // devServer: {
  //   host: "localhost", //指定使用一个 host。默认是 localhost，这里默认值即可
  //   port: 10002, //指定端口
  //   hot: true, // 开启热更新
  //   https: false, // 是否开启https模式
  //   // proxy: {
  //   //   // 请求代理服务器
  //   //   "/api": {
  //   //     //带上api前缀的
  //   //     target: "http://172.20.174.19:80", //代理目标地址
  //   //     changeOrigin: true, //是否跨域
  //   //     secure: false,
  //   //     pathRewrite: {
  //   //       // 在发出请求后将/api替换为''空值，这样不影响接口请求
  //   //       "^/api": "",
  //   //     },
  //   //   },
  //   // },
  // },

  //关闭语法检查
  lintOnSave: false,
};
