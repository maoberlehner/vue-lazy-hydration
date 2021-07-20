const vueServerRenderer = require(`@vue/server-renderer`);
const fs = require(`fs`);

const entryReference = require(`./dist/entry-reference.common.js`);
const entryHydrateNever = require(`./dist/entry-hydrate-never.common.js`);

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

const hydrateNeverRenderer = vueServerRenderer.createRenderer({
  template: fs.readFileSync(`${__dirname}/template-hydrate-never.html`, `utf-8`),
});

hydrateNeverRenderer.renderToString(entryHydrateNever.App, (error, html) => {
  if (error) throw error;

  saveFile(`hydrate-never`, html);
});
