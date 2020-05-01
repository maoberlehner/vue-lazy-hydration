/* global page */
export const open = (
  url,
  options = { waitUntil: `networkidle0` },
) => page.goto(`http://localhost:5000${url}`, options);

export const find = async (selector) => {
  await page.waitForSelector(selector);
  return page.$(selector);
};

describe(`integration`, () => {
  describe(`<LazyHydrate when-idle>`, () => {
    test(`It should hydrate the component when the browser is idle.`, async () => {
      await open(`/integration.html`, {});

      let moreText = await page.$(`.DummyIdle .more`);
      expect(moreText).toBe(null);

      moreText = await find(`.DummyIdle .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`<LazyHydrate when-visible>`, () => {
    test(`It should hydrate the component when it becomes visible.`, async () => {
      await open(`/integration.html`);

      let moreText = await page.$(`.DummyVisible .more`);
      expect(moreText).toBe(null);

      await page.evaluate(() => {
        document.querySelector(`.DummyVisible`).scrollIntoView();
      });

      moreText = await find(`.DummyVisible .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`<LazyHydrate on-interaction>`, () => {
    test(`It should hydrate the component when an interaction happens.`, async () => {
      await open(`/integration.html`);

      let moreText = await page.$(`.DummyInteraction .more`);
      expect(moreText).toBe(null);

      let button = await find(`.DummyInteraction button`);
      await button.click();
      button = await find(`.DummyInteraction button`);
      await button.click();

      moreText = await find(`.DummyInteraction .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`<LazyHydrate ssr-only>`, () => {
    test(`It should not hydrate the component.`, async () => {
      await open(`/integration.html`);

      const component = await find(`.DummySsr`);
      expect(component).not.toBe(null);

      const moreText = await page.$(`.DummySsr .more`);
      expect(moreText).toBe(null);
    });
  });

  describe(`LazyHydrate via import wrappers`, () => {
    test(`It should apply valid classes while not hydrated.`, async () => {
      await open(`/integration.html`);

      let classAttribute = await page.$('#DummyInteractionFct');

      expect(classAttribute._remoteObject.description).toMatch(/#DummyInteractionFct/);
      expect(classAttribute._remoteObject.description).toMatch(/\.additional/);
      expect(classAttribute._remoteObject.description).toMatch(/\.DummyInteraction/);
    });

    test(`It should hydrate the component when an interaction happens.`, async () => {
      await open(`/integration.html`);

      let moreText = await page.$(`#DummyInteractionFct .more`);
      expect(moreText).toBe(null);

      let button = await find(`#DummyInteractionFct button`);
      await button.click();
      button = await find(`#DummyInteractionFct button`);
      await button.click();

      moreText = await find(`#DummyInteractionFct .more`);
      expect(moreText).not.toBe(null);
    });
  });
});
