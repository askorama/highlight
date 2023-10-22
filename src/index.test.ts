import { describe, it } from "bun:test"
import assert from "node:assert"
import { highlight } from "./index.js"

describe("default configuration", () => {
  it("should correctly highlight a text", () => {
    const text1 = "The quick brown fox jumps over the lazy dog"
    const searchTerm1 = "fox"
    const expectedResult1 = "The quick brown <mark class=\"orama-highlight\">fox</mark> jumps over the lazy dog"

    const text2 = "Yesterday all my troubles seemed so far away, now it looks as though they're here to stay oh, I believe in yesterday"
    const searchTerm2 = "yesterday I was in trouble"
    const expectedResult2 = "<mark class=\"orama-highlight\">Yesterday</mark> all my <mark class=\"orama-highlight\">trouble</mark>s seemed so far away, now <mark class=\"orama-highlight\">i</mark>t looks as though they're here to stay oh, <mark class=\"orama-highlight\">I</mark> bel<mark class=\"orama-highlight\">i</mark>eve <mark class=\"orama-highlight\">i</mark>n <mark class=\"orama-highlight\">yesterday</mark>"

    assert.strictEqual(highlight(text1, searchTerm1).toString(), expectedResult1)
    assert.strictEqual(highlight(text2, searchTerm2).toString(), expectedResult2)
  })

  it("should return the correct positions", () => {
    const text = "The quick brown fox jumps over the lazy dog"
    const searchTerm = "fox"
    const expectedPositions = [{ start: 16, end: 18 }]

    assert.deepStrictEqual(highlight(text, searchTerm).positions, expectedPositions)
  })

  it("should return multiple positions", () => {
    const text = "The quick brown fox jumps over the lazy dog"
    const searchTerm = "the"
    const expectedPositions = [{ start: 0, end: 2 }, { start: 31, end: 33 }]

    assert.deepStrictEqual(highlight(text, searchTerm).positions, expectedPositions)
  })
})

describe("custom configuration", () => {
  it("should correctly highlight a text (case sensitive)", () => {
    const text1 = "The quick brown fox jumps over the lazy dog"
    const searchTerm1 = "Fox"
    const expectedResult1 = "The quick brown fox jumps over the lazy dog"

    const text2 = "Yesterday all my troubles seemed so far away, now it looks as though they're here to stay oh, I believe in yesterday"
    const searchTerm2 = "yesterday I was in trouble"
    const expectedResult2 = "Yesterday all my <mark class=\"orama-highlight\">trouble</mark>s seemed so far away, now it looks as though they're here to stay oh, <mark class=\"orama-highlight\">I</mark> believe <mark class=\"orama-highlight\">in</mark> <mark class=\"orama-highlight\">yesterday</mark>"

    assert.strictEqual(highlight(text1, searchTerm1, { caseSensitive: true }).toString(), expectedResult1)
    assert.strictEqual(highlight(text2, searchTerm2, { caseSensitive: true }).toString(), expectedResult2)
  })

  it("should correctly set a custom CSS class", () => {
    const text = "The quick brown fox jumps over the lazy dog"
    const searchTerm = "fox"
    const expectedResult = "The quick brown <mark class=\"custom-class\">fox</mark> jumps over the lazy dog"

    assert.strictEqual(highlight(text, searchTerm, { CSSClass: "custom-class" }).toString(), expectedResult)
  })

  it("should correctly use a custom HTML tag", () => {
    const text = "The quick brown fox jumps over the lazy dog"
    const searchTerm = "fox"
    const expectedResult = "The quick brown <div class=\"orama-highlight\">fox</div> jumps over the lazy dog"

    assert.strictEqual(highlight(text, searchTerm, { HTMLTag: "div" }).toString(), expectedResult)
  })

  it("should correctly highlight whole words only", () => {
    const text = "The quick brown fox jumps over the lazy dog"
    const searchTerm = "fox jump"
    const expectedResult = "The quick brown <mark class=\"orama-highlight\">fox</mark> jumps over the lazy dog"

    assert.strictEqual(highlight(text, searchTerm, { wholeWords: true }).toString(), expectedResult)
  })

  it("should correctly trim and highlight the words if maxLength option is present", () => {
    const text = "The quick brown fox jumps over the lazy dog"
    const searchTerm = "the"
    const expectedResult = "<mark class=\"orama-highlight\">The</mark> quick brown fox "

    const text2 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id mauris pellentesque, gravida erat et, posuere felis. In hac habitasse platea dictumst. Nullam faucibus augue tortor, nec condimentum est scelerisque fermentum. Vestibulum dui eros, pretium in augue condimentum, viverra gravida leo. Integer id metus placerat, lacinia sapien vel, rutrum ante. Duis consectetur massa sit amet justo efficitur blandit. Fusce sit amet lacinia dolor, quis condimentum diam. Integer ac congue erat. Sed lectus massa, blandit in porta nec, rhoncus id diam."
    const searchTerm2 = "diam"
    const expectedResult2 = "rum ante. Duis consectetur massa sit amet justo efficitur blandit. Fusce sit amet lacinia dolor, quis condimentum <mark class=\"orama-highlight\">diam</mark>. Integer ac congue erat. Sed lectus massa, blandit in porta nec, rhoncus id <mark class=\"orama-highlight\">diam</mark>."

    assert.strictEqual(highlight(text, searchTerm, { maxLength: 20 }).toString(), expectedResult)
    assert.strictEqual(highlight(text2, searchTerm2, { maxLength: 200 }).toString(), expectedResult2)
  })
})
