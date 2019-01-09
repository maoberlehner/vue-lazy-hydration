# vue-lazy-hydration

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/vue-lazy-hydration.svg?branch=master)](https://travis-ci.org/maoberlehner/vue-lazy-hydration)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/vue-lazy-hydration.svg?style=social&label=Star)](https://github.com/maoberlehner/vue-lazy-hydration)

> Lazy hydration of server-side rendered Vue.js components.

## Motivation

vue-lazy-hydration is a component to **improve Estimated Input Latency and Time to Interactive** of server-side rendered Vue.js applications. This can be achieved **by using lazy hydration to delay the hydration of pre-rendered HTML**. Additionally, **code splitting is used to delay the loading of the JavaScript code of components** which are marked for lazy hydration.

## Install

```bash
npm install vue-lazy-hydration
```

### Basic example

In the example below you can see the three `load` modi in action.

1. The `ArticleContent` component is only loaded in SSR mode, which means it never gets hydrated in the browser, which also means it will never be interactive (static content only).
2. Next we can see the `AddSlider` beneath the article content, this component will most likely not be visible initially so we can delay hydration until the point it becomes visible.
3. At the very bottom of the page we want to render a `CommentForm` but because most people only read the article and don't leave a comment, we can save resources by only hydrating the component whenever it actually receives focus.

```html
<template>
  <div class="ArticlePage">
    <ArticleContent :content="article.content"/>
    <AddSlider/>
    <CommentForm :article-id="article.id"/>
  </div>
</template>

<script>
import {
  loadOnInteraction,
  loadSsrOnly,
  loadWhenVisible,
} from 'vue-lazy-hydration';

export default {
  components: {
    AddSlider: loadWhenVisible(() => import('./AddSlider.vue')),
    ArticleContent: loadSsrOnly(() => import('./ArticleContent.vue')),
    CommentForm: loadOnInteraction(
      () => import('./CommentForm.vue'),
      { event: 'focus' },
    ),
  },
  // ...
};
</script>
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
