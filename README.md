# Highlight

Orama Highlight allows you to easily highlight substrings in a given input.

# Installation

```bash
npm i @orama/highlight
bun i @orama/highlight
```

# Usage

```js
import { highlight } from '@orama/highlight'

const inputString = 'The quick brown fox jumps over the lazy dog'
const toHighlight = 'brown fox jump'

const highlighted = highlight(inputString, toHighlight)

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

console.log(highlighted.toString())

// "The quick <mark class="orama-highlight">brown</mark> <mark class="orama-highlight">fox</mark> <mark class="orama-highlight">jump</mark>s over the lazy dog"
```

By default, `@orama/highlight` returns an object containing two properties:

- `toString`, a function that returns valid HTML code with highlighted substrings wrapped into a `<mark>` tag and a `orama-highlight` CSS class
- `positions`an array of positions for all the highlighted substrings in the original input

You can always customize the library behavior by passing a third parameter with the following parameters:

```js
const inputString = 'The quick brown fox jumps over the lazy dog'
const toHighlight = 'brown fox jump'

const highlighted = highlight(inputString, toHighlight, {
  caseSensitive: true,        // Only highlight words that respect the second parameter's casing. Default is false
  wholeWords: true,           // Only highlight entire words, no prefixes
  HTMLTag: 'div',             // Default is "mark"
  CSSClass: 'my-custom-class' // default is 'orama-highlight'
})
```

# License
[Apache 2.0](/LICENSE.md)