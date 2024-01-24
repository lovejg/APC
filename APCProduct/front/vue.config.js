const { defineConfig } = require("@vue/cli-service");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = defineConfig({
  // configureWebpack: {
  //   plugins: [new BundleAnalyzerPlugin()],
  // },

  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
  },
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3002/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  assetsDir: "product",
  outputDir: "../back/public/",
});
