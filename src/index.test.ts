import { describe, it } from 'bun:test'
import assert from 'node:assert'
import { highlight } from './index.js'

describe('default configuration', () => {
  it('should correctly highlight a text', () => {
    const text1 = 'The quick brown fox jumps over the lazy dog'
    const searchTerm1 = 'fox'
    const expectedResult1 = 'The quick brown <mark class="orama-highlight">fox</mark> jumps over the lazy dog'

    const text2 = 'Yesterday all my troubles seemed so far away, now it looks as though they\'re here to stay oh, I believe in yesterday'
    const searchTerm2 = 'yesterday I was in trouble'
    const expectedResult2 = '<mark class="orama-highlight">yesterday</mark> all my <mark class="orama-highlight">trouble</mark>s seemed so far away, now <mark class="orama-highlight">i</mark>t looks as though they\'re here to stay oh, <mark class="orama-highlight">i</mark> bel<mark class="orama-highlight">i</mark>eve <mark class="orama-highlight">i</mark>n <mark class="orama-highlight">yesterday</mark>'

    assert.strictEqual(highlight(text1, searchTerm1).toString(), expectedResult1)
    assert.strictEqual(highlight(text2, searchTerm2).toString(), expectedResult2)
  })
})

describe('custom configuration', () => {
  it('should correctly set a custom CSS class', () => {
    const text = 'The quick brown fox jumps over the lazy dog'
    const searchTerm = 'fox'
    const expectedResult = 'The quick brown <mark class="custom-class">fox</mark> jumps over the lazy dog'

    assert.strictEqual(highlight(text, searchTerm, { CSSClass: 'custom-class' }).toString(), expectedResult)
  })

  it('should correctly use a custom HTML tag', () => {
    const text = 'The quick brown fox jumps over the lazy dog'
    const searchTerm = 'fox'
    const expectedResult = 'The quick brown <div class="orama-highlight">fox</div> jumps over the lazy dog'

    assert.strictEqual(highlight(text, searchTerm, { HTMLTag: 'div' }).toString(), expectedResult)
  })

  it('should correctly highlight whole words only', () => {
    const text = 'The quick brown fox jumps over the lazy dog'
    const searchTerm = 'fox jump'
    const expectedResult = 'The quick brown <mark class="orama-highlight">fox</mark> jumps over the lazy dog'

    assert.strictEqual(highlight(text, searchTerm, { wholeWords: true }).toString(), expectedResult)
  })
})
