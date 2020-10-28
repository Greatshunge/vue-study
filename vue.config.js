"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "vue Element Admin Study"; // page title

// 如果端口设置为80
// 使用管理员权限执行命令行
// 比如, Mac: sudo npm run
// 通过以下方法更改端口：
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9528; // dev port

// 所有配置项说明都可以在 https://cli.vuejs.org/config/ 中找到
module.exports = {
  /**
   * 如果计划在子路径下部署站点，则需要设置publicPath,
   * 比如 GitHub Pages. 如果您计划将站点部署到 https://foo.github.io/bar/,
   * 那么publicPath应该设置为 "/bar/".
   * 在大多数情况下，请使用 '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false, //process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    before: require("./mock/mock-server.js"),
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用的标题,以便在索引.html插入正确的标题。
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  chainWebpack(config) {
    // 它可以提高第一屏的速度，建议打开预加载
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // 忽略 runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    // 当有很多页面时，会导致太多无意义的请求
    config.plugins.delete("prefetch");

    // 设置 svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // 将elementUI拆分为单个包
            priority: 20, // 权重需要大于libs和app，否则将打包成libs或app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // 为了适应cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // 可以自定义你的规则
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
};
