const fs = require(`fs`);
const vueServerRenderer = require(`vue-server-renderer`);

function saveFile(name, contents) {
  fs.writeFile(`${__dirname}/dist/client/${name}.html`, contents, (error) => {
    if (error) throw error;

    // eslint-disable-next-line no-console
    console.log(`${name} rendered.`);
  });
}

const serverBundle = require(`./dist/server/vue-ssr-server-bundle.json`);
const clientManifest = require(`./dist/client/vue-ssr-client-manifest.json`);

const integrationRenderer = vueServerRenderer.createBundleRenderer(serverBundle, {
  template: fs.readFileSync(`${__dirname}/template.html`, `utf-8`),
  clientManifest,
});

const context = { url: `` };

integrationRenderer.renderToString(context, (error, html) => {
  if (error) throw error;

  saveFile(`integration`, html);
});
