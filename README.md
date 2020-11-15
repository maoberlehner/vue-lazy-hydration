# vue-lazy-hydration

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/vue-lazy-hydration.svg?branch=master)](https://travis-ci.org/maoberlehner/vue-lazy-hydration)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/vue-lazy-hydration.svg?style=social&label=Star)](https://github.com/maoberlehner/vue-lazy-hydration)

> Lazy Hydration of Server-Side Rendered Vue.js Components

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/O4O7U55Y)

`vue-lazy-hydration` is a renderless Vue.js component to **improve Estimated Input Latency and Time to Interactive** of server-side rendered Vue.js applications. This can be achieved **by using lazy hydration to delay the hydration of pre-rendered HTML**.

## Install

```bash
npm install vue-lazy-hydration
```

```js
import LazyHydrate from 'vue-lazy-hydration';
// ...

export default {
  // ...
  components: {
    LazyHydrate,
    // ...
  },
  // ...
};
```

## Basic example

In the example below you can see the four hydration modes in action.

```html
<template>
  <div class="ArticlePage">
    <LazyHydrate when-idle>
      <ImageSlider/>
    </LazyHydrate>

    <LazyHydrate never>
      <ArticleContent :content="article.content"/>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <AdSlider/>
    </LazyHydrate>

    <!-- `on-interaction` listens for a `focus` event by default ... -->
    <LazyHydrate on-interaction>
      <CommentForm :article-id="article.id"/>
    </LazyHydrate>
    <!-- ... but you can listen for any event you want ... -->
    <LazyHydrate on-interaction="click">
      <CommentForm :article-id="article.id"/>
    </LazyHydrate>
    <!-- ... or even multiple events. -->
    <LazyHydrate :on-interaction="['click', 'touchstart']">
      <CommentForm :article-id="article.id"/>
    </LazyHydrate>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';

export default {
  components: {
    LazyHydrate,
    AdSlider: () => import('./AdSlider.vue'),
    ArticleContent: () => import('./ArticleContent.vue'),
    CommentForm: () => import('./CommentForm.vue'),
    ImageSlider: () => import('./ImageSlider.vue'),
  },
  // ...
};
</script>
```

1. Because it is at the very top of the page, the `ImageSlider` should be hydrated eventually, but we can wait until the browser is idle.
2. The `ArticleContent` component is never hydrated on the client, which also means it will never be interactive (static content only).
3. Next we can see the `AdSlider` beneath the article content, this component will most likely not be visible initially so we can delay hydration until the point it becomes visible.
4. At the very bottom of the page we want to render a `CommentForm` but because most people only read the article and don't leave a comment, we can save resources by only hydrating the component whenever it actually receives focus.

## Advanced

### Manually trigger hydration

Sometimes you might want to prevent a component from loading initially but you want to activate it on demand if a certain action is triggered. You can do this by manually triggering the component to hydrate like you can see in the following example.

```html
<template>
  <div class="MyComponent">
    <button @click="editModeActive = true">
      Activate edit mode
    </button>
    <LazyHydrate never :trigger-hydration="editModeActive">
      <UserSettingsForm/>
    </LazyHydrate>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';

export default {
  components: {
    LazyHydrate,
    UserSettingsForm: () => import('./UserSettingsForm.vue'),
  },
  data() {
    return {
      editModeActive: false,
    };
  },
  // ...
};
</script>
```

### Multiple root nodes

Because of how this package works, it is not possible to nest multiple root nodes inside of a single `<LazyHydrate>`. But you can wrap multiple components with a `<div>`.

```html
<template>
  <div class="MyComponent">
    <LazyHydrate never>
      <div>
        <ArticleHeader/>
        <ArticleContent/>
        <ArticleMetaInfo/>
        <ArticleFooter/>
      </div>
    </LazyHydrate>
  </div>
</template>
```

### Intersection Observer options

Internally the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) is used to determine if a component is visible or not. You can provide Intersection Observer options to the `when-visible` property to configure the Intersection Observer.

```html
<template>
  <div class="MyComponent">
    <LazyHydrate :when-visible="{ rootMargin: '100px' }">
      <ArticleFooter/>
    </LazyHydrate>
  </div>
</template>
```

For a list of possible options please [take a look at the Intersection Observer API documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver).

## Import Wrappers

Additionally to the `<LazyHydrate>` wrapper component you can also use Import Wrappers to lazy load and hydrate certain components.

```html
<template>
  <div class="ArticlePage">
    <ImageSlider/>
    <ArticleContent :content="article.content"/>
    <AdSlider/>
    <CommentForm :article-id="article.id"/>
  </div>
</template>

<script>
import {
  hydrateOnInteraction,
  hydrateNever,
  hydrateWhenIdle,
  hydrateWhenVisible,
} from 'vue-lazy-hydration';

export default {
  components: {
    AdSlider: hydrateWhenVisible(
      () => import('./AdSlider.vue'),
      // Optional.
      { observerOptions: { rootMargin: '100px' } },
    ),
    ArticleContent: hydrateNever(() => import('./ArticleContent.vue')),
    CommentForm: hydrateOnInteraction(
      () => import('./CommentForm.vue'),
      // `focus` is the default event.
      { event: 'focus' },
    ),
    ImageSlider: hydrateWhenIdle(() => import('./ImageSlider.vue')),
  },
  // ...
};
</script>
```

## Benchmarks

### Without lazy hydration

![Without lazy hydration.](https://res.cloudinary.com/maoberlehner/image/upload/c_scale,f_auto,q_auto,w_600/v1532158513/github/vue-lazy-hydration/no-lazy-hydration-demo-benchmark)

### With lazy hydration

![With lazy hydration.](https://res.cloudinary.com/maoberlehner/image/upload/c_scale,f_auto,q_auto,w_600/v1532158513/github/vue-lazy-hydration/lazy-hydration-demo-benchmark)

## Caveats

**This plugin will not work as advertised if you're not using it in combination with SSR.** Although it should work with every pre-rendering approach (like [Prerender SPA Plugin](https://github.com/chrisvfritz/prerender-spa-plugin), [Gridsome](https://gridsome.org/), ...) I've only tested it with [Nuxt.js](https://nuxtjs.org) so far.

## Upgrade v1.x to v2.x

Breaking changes:

- `ssr-only` was renamed to `never` (as in "Hydrate this? Never!").

```diff
-<LazyHydrate ssr-only>
+<LazyHydrate never>
   <ArticleContent/>
 </LazyHydrate>
```

- Specyfing `ignored-props` on Import Wrappers is not necessary anymore.

```diff
 components: {
-  ArticleContent: hydrateNever(() => import('./ArticleContent.vue'), { ignoredProps: ['content'] }),
+  ArticleContent: hydrateNever(() => import('./ArticleContent.vue')),
 }
```

## Articles

- [Partial Hydration Concepts: Lazy and Active](https://markus.oberlehner.net/blog/partial-hydration-concepts-lazy-and-active/)
- [abomination: a Concept for a Static HTML / Dynamic JavaScript Hybrid Application](https://markus.oberlehner.net/blog/abomination-a-concept-for-a-static-html-dynamic-javascript-hybrid-application/)
- [How to Drastically Reduce Estimated Input Latency and Time to Interactive of SSR Vue.js Applications](https://markus.oberlehner.net/blog/how-to-drastically-reduce-estimated-input-latency-and-time-to-interactive-of-ssr-vue-applications/)

## Credits

The code of the v1 version of this package was based on a [similar package created by **Rahul Kadyan**](https://github.com/znck/lazy-hydration).

## Testing

Because the core functionality of `vue-lazy-hydration` heavily relies on browser APIs like `IntersectionObserver` and `requestIdleCallback()`, it is tough to write meaningful unit tests without having to write numerous mocks. Because of that, we mostly use integration tests and some performance benchmarks to test the functionality of this package.

### Integration tests

Execute the following commands to run the integration tests:

```bash
npm run test:integration:build
npm run test:integration
```

### Performance tests

Execute the following commands to run the performance benchmark:

```bash
npm run test:perf:build
npm run test:perf
```

## About

### Author

Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner  
Patreon: https://www.patreon.com/maoberlehner

### License

MIT
