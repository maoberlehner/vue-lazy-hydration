# vue-lazy-hydration

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/vue-lazy-hydration.svg?branch=master)](https://travis-ci.org/maoberlehner/vue-lazy-hydration)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/vue-lazy-hydration.svg?style=social&label=Star)](https://github.com/maoberlehner/vue-lazy-hydration)

> Lazy hydration of server-side rendered Vue.js components.

## Motivation

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

    <LazyHydrate ssr-only>
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
2. The `ArticleContent` component is only loaded in SSR mode, which means it never gets hydrated in the browser, which also means it will never be interactive (static content only).
3. Next we can see the `AdSlider` beneath the article content, this component will most likely not be visible initially so we can delay hydration until the point it becomes visible.
4. At the very bottom of the page we want to render a `CommentForm` but because most people only read the article and don't leave a comment, we can save resources by only hydrating the component whenever it actually receives focus.

## Advanced

### Prevent JavaScript bundle loading

```html
<template>
  <div class="ArticlePage">
    <LazyHydrate on-interaction>
      <CommentForm
        slot-scope="{ hydrated }"
        v-if="hydrated"
        :article-id="article.id"
      />
    </LazyHydrate>
    <!-- Or using new Vue.js 2.6.x v-slot syntax -->
    <LazyHydrate
      v-slot="{ hydrated }"
      on-interaction
    >
      <CommentForm
        v-if="hydrated"
        :article-id="article.id"
      />
    </LazyHydrate>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';

export default {
  components: {
    LazyHydrate,
    // The `CommentForm` is only imported if `hydrated` is true.
    CommentForm: () => import('./CommentForm.vue'),
  },
  // ...
};
</script>
```

### Manually trigger hydration

Sometimes you might want to prevent a component from loading initially but you want to activate it on demand if a certain action is triggered. You can do this by manually triggering the component to hydrate like you can see in the following example.

```html
<template>
  <div class="MyComponent">
    <button @click="editModeActive = true">
      Activate edit mode
    </button>
    <LazyHydrate ssr-only :trigger-hydration="editModeActive">
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
    <LazyHydrate ssr-only>
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

### Intersection Obersver options

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

## Benchmarks

### Without lazy hydration

![Without lazy hydration.](https://res.cloudinary.com/maoberlehner/image/upload/c_scale,f_auto,q_auto,w_600/v1532158513/github/vue-lazy-hydration/no-lazy-hydration-demo-benchmark)

### With lazy hydration

![With lazy hydration.](https://res.cloudinary.com/maoberlehner/image/upload/c_scale,f_auto,q_auto,w_600/v1532158513/github/vue-lazy-hydration/lazy-hydration-demo-benchmark)

## Caveats

**This plugin will not work as advertised if you're not using it in combination with SSR.** Although it should work with every pre-rendering approach (like [Prerender SPA Plugin](https://github.com/chrisvfritz/prerender-spa-plugin), [Gridsome](https://gridsome.org/), ...) I've only tested it with [Nuxt.js](https://nuxtjs.org) so far.

## Articles

- [abomination: a Concept for a Static HTML / Dynamic JavaScript Hybrid Application](https://markus.oberlehner.net/blog/abomination-a-concept-for-a-static-html-dynamic-javascript-hybrid-application/)
- [How to Drastically Reduce Estimated Input Latency and Time to Interactive of SSR Vue.js Applications](https://markus.oberlehner.net/blog/how-to-drastically-reduce-estimated-input-latency-and-time-to-interactive-of-ssr-vue-applications/)

## Credits

The code of the current implementation of this package is based on a [similar package created by **Rahul Kadyan**](https://github.com/znck/lazy-hydration). Thanks to his code I'm finally able to build a clean solution for what I dreamed of when I created the [abomination](https://markus.oberlehner.net/blog/abomination-a-concept-for-a-static-html-dynamic-javascript-hybrid-application/).

## About

### Author

Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner  
Patreon: https://www.patreon.com/maoberlehner

### License

MIT
