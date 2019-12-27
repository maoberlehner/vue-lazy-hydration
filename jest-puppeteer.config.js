const DEBUG_MODE = process.argv.includes(`--debug`);

module.exports = {
  launch: DEBUG_MODE ? {
    headless: false,
    slowMo: 100,
  } : {},
};
