const chromeLauncher = require(`chrome-launcher`);
const lighthouse = require(`lighthouse`);
const Table = require(`cli-table3`);

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then((chrome) => {
    // eslint-disable-next-line no-param-reassign
    opts.port = chrome.port;
    return lighthouse(url, opts, config)
      .then(results => chrome.kill().then(() => results.lhr));
  });
}

const config = {
  extends: `lighthouse:default`,
  settings: {
    onlyAudits: [
      `estimated-input-latency`,
      `first-cpu-idle`,
      `interactive`,
      `bootup-time`,
    ],
  },
};

async function run() {
  const table = new Table({
    head: [``, `Estimated Input Latency`, `First CPU Idle`, `Time to Interactive`, `Bootup Time`],
  });

  const reference = await launchChromeAndRunLighthouse(`http://localhost:5000/reference.html`, {}, config);
  const hydrateNever = await launchChromeAndRunLighthouse(`http://localhost:5000/hydrate-never.html`, {}, config);

  table.push(...[
    {
      Reference: [
        reference.audits[`estimated-input-latency`].displayValue,
        reference.audits[`first-cpu-idle`].displayValue,
        reference.audits.interactive.displayValue,
        reference.audits[`bootup-time`].displayValue,
      ],
    },
    {
      'hydrate never': [
        hydrateNever.audits[`estimated-input-latency`].displayValue,
        hydrateNever.audits[`first-cpu-idle`].displayValue,
        hydrateNever.audits.interactive.displayValue,
        hydrateNever.audits[`bootup-time`].displayValue,
      ],
    },
  ]);

  // eslint-disable-next-line no-console
  console.log(table.toString());
}

run();
