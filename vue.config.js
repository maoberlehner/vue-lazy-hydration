const VueSSRClientPlugin = require(`vue-server-renderer/client-plugin`);
const VueSSRServerPlugin = require(`vue-server-renderer/server-plugin`);
const nodeExternals = require(`webpack-node-externals`);

// vue.config.js
module.exports = {
  // https://ssr.vuejs.org/guide/build-config.html#server-config
  configureWebpack: process.env.SERVER ? {
    target: `node`,
    output: {
      libraryTarget: `commonjs2`,
    },

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // Externalize app dependencies. This makes the server build much faster
    // and generates a smaller bundle file.
    externals: nodeExternals({
      // do not externalize dependencies that need to be processed by webpack.
      // you can add more file types here e.g. raw *.vue files
      // you should also whitelist deps that modifies `global` (e.g. polyfills)
      whitelist: /\.css$/,
    }),

    // This is the plugin that turns the entire output of the server build
    // into a single JSON file. The default file name will be
    // `vue-ssr-server-bundle.json`
    plugins: [
      new VueSSRServerPlugin(),
    ],
  } : {
    target: `web`,
    plugins: [
      new VueSSRClientPlugin(),
    ],
  },
};
