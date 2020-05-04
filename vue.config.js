const VueSSRClientPlugin = require(`vue-server-renderer/client-plugin`);
const VueSSRServerPlugin = require(`vue-server-renderer/server-plugin`);

const nodeExternals = require(`webpack-node-externals`);

const isJSRegExp = /\.js(\?[^.]+)?$/;

const isJS = file => isJSRegExp.test(file);
const extractQueryPartJS = file => isJSRegExp.exec(file)[1];

class VueSSRServerPluginNuxt {
  constructor (options = {}) {
    this.options = Object.assign({
      filename: null
    }, options);
  }

  apply (compiler) {
    // validate(compiler);

    compiler.hooks.emit.tapAsync('vue-server-plugin', (compilation, cb) => {
      const stats = compilation.getStats().toJson();
      const [entryName] = Object.keys(stats.entrypoints);
      const entryInfo = stats.entrypoints[entryName];

      if (!entryInfo) {
        // #5553
        return cb()
      }

      const entryAssets = entryInfo.assets.filter(isJS);

      if (entryAssets.length > 1) {
        throw new Error(
          'Server-side bundle should have one single entry file. ' +
          'Avoid using CommonsChunkPlugin in the server config.'
        )
      }

      const [entry] = entryAssets;
      if (!entry || typeof entry !== 'string') {
        throw new Error(
          `Entry "${entryName}" not found. Did you specify the correct entry option?`
        )
      }

      const bundle = {
        entry,
        files: {},
        maps: {}
      };

      stats.assets.forEach((asset) => {
        if (isJS(asset.name)) {
          const queryPart = extractQueryPartJS(asset.name);
          if (queryPart !== undefined) {
            bundle.files[asset.name] = asset.name.replace(queryPart, '');
          } else {
            bundle.files[asset.name] = asset.name;
          }
        } else if (asset.name.match(/\.js\.map$/)) {
          bundle.maps[asset.name.replace(/\.map$/, '')] = asset.name;
        } else {
          // Do not emit non-js assets for server
          delete compilation.assets[asset.name];
        }
      });

      const src = JSON.stringify(bundle, null, 2);

      compilation.assets[this.options.filename] = {
        source: () => src,
        size: () => src.length
      };

      cb();
    });
  }
}

// vue.config.js
module.exports = {
  // https://ssr.vuejs.org/guide/build-config.html#server-config
  configureWebpack: process.env.SERVER ? {
    target: `node`,
    output: {
      libraryTarget: `commonjs2`,
    },
    devtool: 'source-map',
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
      new VueSSRServerPlugin({ filename: `vue-ssr-server-bundle.json` })
    ]
  } : {
    target: `web`,
    plugins: [
      new VueSSRClientPlugin(),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
};
