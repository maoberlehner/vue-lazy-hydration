/* global page */
export const open = (
  url,
  options = { waitUntil: `networkidle0` },
) => page.goto(`http://localhost:5000${url}`, options);

export const find = async (selector) => {
  await page.waitForSelector(selector);
  return page.$(selector);
};

describe.each([`async`, `sync`])(`%s`, (variant) => {
  describe(`<LazyHydrate when-idle>`, () => {
    test(`It should hydrate the component when the browser is idle.`, async () => {
      await open(`/integration-${variant}`, {});

      let moreText = await page.$(`.DummyIdle .more`);
      expect(moreText).toBe(null);

      moreText = await find(`.DummyIdle .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`hydrateWhenIdle()`, () => {
    test(`It should hydrate the component when the browser is idle.`, async () => {
      await open(`/integration-${variant}`, {});

      let moreText = await page.$(`.DummyIdle.wrapper .more`);
      expect(moreText).toBe(null);

      moreText = await find(`.DummyIdle.wrapper .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`<LazyHydrate when-visible>`, () => {
    test(`It should hydrate the component when it becomes visible.`, async () => {
      await open(`/integration-${variant}`);

      let moreText = await page.$(`.DummyVisible .more`);
      expect(moreText).toBe(null);

      await page.evaluate(() => {
        document.querySelector(`.DummyVisible`).scrollIntoView();
      });

      moreText = await find(`.DummyVisible .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`hydrateWhenVisible()`, () => {
    test(`It should hydrate the component when it becomes visible.`, async () => {
      await open(`/integration-${variant}`);

      let moreText = await page.$(`.DummyVisible.wrapper .more`);
      expect(moreText).toBe(null);

      await page.evaluate(() => {
        document.querySelector(`.DummyVisible.wrapper`).scrollIntoView();
      });

      moreText = await find(`.DummyVisible.wrapper .more`);
      expect(moreText).not.toBe(null);
    });
  });

  describe(`<LazyHydrate on-interaction>`, () => {
    test(`It should hydrate the component when an interaction happens.`, async () => {
      await open(`/integration-${variant}`);

      let moreText = await page.$(`.DummyInteraction .more`);
      expect(moreText).toBe(null);

      let button = await find(`.DummyInteraction button`);
      await button.click();
      button = await find(`.DummyInteraction button`);
      await button.click();

      moreText = await find(`.DummyInteraction .more`);
      expect(moreText).not.toBe(null);
    });

    test(`It should render show slot content.`, async () => {
      await open(`/integration-${variant}`);

      let defaultSlot = await find(`.DummyInteraction .default-slot`);
      expect(defaultSlot).not.toBe(null);
      let namedSlot = await find(`.DummyInteraction .named-slot`);
      expect(namedSlot).not.toBe(null);

      let button = await find(`.DummyInteraction button`);
      await button.click();
      button = await find(`.DummyInteraction button`);
      await button.click();

      defaultSlot = await find(`.DummyInteraction .default-slot`);
      expect(defaultSlot).not.toBe(null);
      namedSlot = await find(`.DummyInteraction .named-slot`);
      expect(namedSlot).not.toBe(null);
    });
  });

  describe(`hydrateOnInteraction()`, () => {
    test(`It should hydrate the component when an interaction happens.`, async () => {
      await open(`/integration-${variant}`);

      let moreText = await page.$(`.DummyInteraction.wrapper .more`);
      expect(moreText).toBe(null);

      let button = await find(`.DummyInteraction.wrapper button`);
      await button.click();
      button = await find(`.DummyInteraction.wrapper button`);
      await button.click();

      moreText = await find(`.DummyInteraction.wrapper .more`);
      expect(moreText).not.toBe(null);
    });

    test(`It should render show slot content.`, async () => {
      await open(`/integration-${variant}`);

      let defaultSlot = await find(`.DummyInteraction.wrapper .default-slot`);
      expect(defaultSlot).not.toBe(null);
      let namedSlot = await find(`.DummyInteraction.wrapper .named-slot`);
      expect(namedSlot).not.toBe(null);

      let button = await find(`.DummyInteraction.wrapper button`);
      await button.click();
      button = await find(`.DummyInteraction.wrapper button`);
      await button.click();

      defaultSlot = await find(`.DummyInteraction.wrapper .default-slot`);
      expect(defaultSlot).not.toBe(null);
      namedSlot = await find(`.DummyInteraction.wrapper .named-slot`);
      expect(namedSlot).not.toBe(null);
    });
  });

  describe(`<LazyHydrate never>`, () => {
    test(`It should not hydrate the component.`, async () => {
      await open(`/integration-${variant}`);

      const component = await find(`.DummySsr`);
      expect(component).not.toBe(null);

      const moreText = await page.$(`.DummySsr .more`);
      expect(moreText).toBe(null);
    });
  });

  describe(`hydrateNever()`, () => {
    test(`It should not hydrate the component.`, async () => {
      await open(`/integration-${variant}`);

      const component = await find(`.DummySsr.wrapper`);
      expect(component).not.toBe(null);

      const moreText = await page.$(`.DummySsr.wrapper .more`);
      expect(moreText).toBe(null);
    });
  });
});
