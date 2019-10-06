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
  const ssrOnly = await launchChromeAndRunLighthouse(`http://localhost:5000/ssr-only.html`, {}, config);

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
      'SSR Only': [
        ssrOnly.audits[`estimated-input-latency`].displayValue,
        ssrOnly.audits[`first-cpu-idle`].displayValue,
        ssrOnly.audits.interactive.displayValue,
        ssrOnly.audits[`bootup-time`].displayValue,
      ],
    },
  ]);

  // eslint-disable-next-line no-console
  console.log(table.toString());
}

run();
