import { Component, AsyncComponent } from 'vue'

declare const LazyHydrate: Component<
  { hydrated: boolean },
  {
    cleanup(): void
    hydrate(): void
  },
  {
    interactionEvents: []
  },
  {
    idleTimeout: number
    onInteraction: boolean | string | []
    ssrOnly: boolean
    triggerHydration: boolean
    whenIdle: boolean
  }
> & { functional: false }

export function hydrateSsrOnly(component: AsyncComponent | Component): AsyncComponent | Component
export function hydrateWhenIdle(component: AsyncComponent | Component, options: {  ignoredProps?: string[]}): AsyncComponent | Component
export function hydrateWhenVisible(component: AsyncComponent | Component, options: {  ignoredProps?: string[], observerOptions?: string[]}): AsyncComponent | Component
export function hydrateOnInteraction(component: AsyncComponent | Component, options: { event?: string, ignoredProps?: string[] }): AsyncComponent | Component

export default LazyHydrate
