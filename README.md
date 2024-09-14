<p align="center">
    <a href="https://evomark.co.uk" target="_blank" alt="Link to evoMark's website">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--dark.svg">
          <source media="(prefers-color-scheme: light)" srcset="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--light.svg">
          <img alt="evoMark company logo" src="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--light.svg" width="500">
        </picture>
    </a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/dm/@evomark/vue-forward-slots.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@evomark/vue-forward-slots"><img src="https://img.shields.io/npm/v/@evomark/vue-forward-slots.svg" alt="Version"></a>
  <a href="https://github.com/evo-mark/vue-forward-slots/blob/main/LICENCE"><img src="https://img.shields.io/github/license/evo-mark/vue-forward-slots?style=flat" alt="Licence"></a>
</p>

# Vue Forward Slots

Effortlessly forward slots to child components in Vue 3 applications.

## Fork Features

Forked from https://github.com/jessegall/vue-forward-slots, this version offers a few additional features:

-   Automatically pass-through attributes to the wrapped component
-   New `inherit-attrs` prop for the `ForwardSlots` component, default is **true**
-   Support RegExp for `only` and `except` props or as array items for either
-   Support wildcard matches at the start or end of items, e.g. `:only="['item*']"` or `:except="['*prepend']"`
-   Extensive tests run against the library via Vitest and Vue Test Utils

## Original Features

-   Easily forward all slots or specific slots to child components
-   Simple and declarative syntax

For full information on installing and using this package, please visit the [evoMark Vue Forward Slots page](https://evomark.co.uk/open-source-software/vue-forward-slots/) on our website.
