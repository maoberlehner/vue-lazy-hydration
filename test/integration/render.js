const fs = require(`fs`);
const vueServerRenderer = require(`vue-server-renderer`);

const entryIntegration = require(`./dist/entry-integration.common.js`);

function saveFile(name, contents) {
  fs.writeFile(`${__dirname}/dist/${name}.html`, contents, (error) => {
    if (error) throw error;

    // eslint-disable-next-line no-console
    console.log(`${name} rendered.`);
  });
}

const integrationRenderer = vueServerRenderer.createRenderer({
  template: fs.readFileSync(`${__dirname}/template.html`, `utf-8`),
});

integrationRenderer.renderToString(entryIntegration.App, (error, html) => {
  if (error) throw error;

  saveFile(`integration`, html);
});
