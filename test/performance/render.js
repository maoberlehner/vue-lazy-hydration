const vueServerRenderer = require(`vue-server-renderer`);
const fs = require(`fs`);

const entryReference = require(`./dist/entry-reference.common.js`);
const entrySsrOnly = require(`./dist/entry-ssr-only.common.js`);

function saveFile(name, contents) {
  fs.writeFile(`${__dirname}/dist/${name}.html`, contents, (error) => {
    if (error) throw error;

    // eslint-disable-next-line no-console
    console.log(`${name} rendered.`);
  });
}

const referenceRenderer = vueServerRenderer.createRenderer({
  template: fs.readFileSync(`${__dirname}/template-reference.html`, `utf-8`),
});

referenceRenderer.renderToString(entryReference.App, (error, html) => {
  if (error) throw error;

  saveFile(`reference`, html);
});

const ssrOnlyRenderer = vueServerRenderer.createRenderer({
  template: fs.readFileSync(`${__dirname}/template-ssr-only.html`, `utf-8`),
});

ssrOnlyRenderer.renderToString(entrySsrOnly.App, (error, html) => {
  if (error) throw error;

  saveFile(`ssr-only`, html);
});
