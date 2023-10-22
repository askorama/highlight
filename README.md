# Highlight

[![Test CI](https://github.com/oramasearch/highlight/actions/workflows/test.yml/badge.svg)](https://github.com/oramasearch/highlight/actions/workflows/test.yml)

Orama Highlight allows you to easily highlight substrings in a given input.

# Installation

```bash
npm i @orama/highlight
bun i @orama/highlight
```

# Usage

```js
import { Highlight } from '@orama/highlight'

const inputString = 'The quick brown fox jumps over the lazy dog'
const toHighlight = 'brown fox jump'

const highlighter = new Highlight()
const highlighted = highlighter.highlight(inputString, toHighlight)

console.log(highlighted.positions)
// [
//    {
//      start: 10,
//      end: 14
//    }, {
//      start: 16,
//      end: 18
//    }, {
//      start: 20,
//      end: 23
//    }
//  ]

console.log(highlighted.HTML)
// "The quick <mark class="orama-highlight">brown</mark> <mark class="orama-highlight">fox</mark> <mark class="orama-highlight">jump</mark>s over the lazy dog"

console.log(highlighted.trim(10))
// "...uick <mark class="orama-highlight">brown</mark>..."
```

You can always customize the library behavior by passing some options to the class constructor:

```js
const highlighted = new Highlight({
  caseSensitive: true,        // Only highlight words that respect the second parameter's casing. Default is false
  wholeWords: true,           // Only highlight entire words, no prefixes
  HTMLTag: 'div',             // Default is "mark"
  CSSClass: 'my-custom-class' // default is 'orama-highlight'
})
```

# License
[Apache 2.0](/LICENSE.md)