const fs = require(`fs`);
const { renderToString } = require(`@vue/server-renderer`);

const entryIntegration = require(`./dist/entry-integration.common.js`);

function saveFile(name, contents) {
  const entry = fs.readFileSync(`${__dirname}/template.html`, `utf-8`);

  fs.writeFile(`${__dirname}/dist/${name}.html`, entry.replace(`<!--vue-ssr-outlet-->`, contents), (error) => {
    if (error) throw error;

    // eslint-disable-next-line no-console
    console.log(`${name} rendered.`);
  });
}

renderToString(entryIntegration.AppAsync).then((result) => {
  saveFile(`integration-async`, result);
});

renderToString(entryIntegration.AppSync).then((result) => {
  saveFile(`integration-sync`, result);
});
