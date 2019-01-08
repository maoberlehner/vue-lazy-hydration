import path from 'path';

export default function nuxtLazyHydration(moduleOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, `plugin.js`),
    moduleOptions,
  });
}
