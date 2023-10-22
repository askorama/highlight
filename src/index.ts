export interface HighlightOptions {
  caseSensitive?: boolean
  wholeWords?: boolean
  HTMLTag?: string
  CSSClass?: string
}

type Positions = Array<{ start: number, end: number }>

const defaultOptions: HighlightOptions = {
  caseSensitive: false,
  wholeWords: false,
  HTMLTag: 'mark',
  CSSClass: 'orama-highlight'
}

export class Highlight {
  private readonly options: HighlightOptions
  private _positions: Positions = []
  private _HTML: string = ''

  constructor (options: HighlightOptions = defaultOptions) {
    this.options = { ...defaultOptions, ...options }
  }

  public highlight (text: string, searchTerm: string): Highlight {
    const caseSensitive = this.options.caseSensitive ?? defaultOptions.caseSensitive
    const wholeWords = this.options.wholeWords ?? defaultOptions.wholeWords
    const HTMLTag = this.options.HTMLTag ?? defaultOptions.HTMLTag
    const CSSClass = this.options.CSSClass ?? defaultOptions.CSSClass
    const regexFlags = caseSensitive ? 'g' : 'gi'
    const boundary = wholeWords ? '\\b' : ''
    const searchTerms = (caseSensitive ? searchTerm : searchTerm.toLowerCase()).trim().split(/\s+/).join('|')
    const regex = new RegExp(`${boundary}${searchTerms}${boundary}`, regexFlags)
    const positions: Array<{ start: number, end: number }> = []
    const highlightedParts: string[] = []

    let match
    let lastEnd = 0
    let previousLastIndex = -1

    while ((match = regex.exec(text)) !== null) {
      if (regex.lastIndex === previousLastIndex) {
        break
      }
      previousLastIndex = regex.lastIndex

      const start = match.index
      const end = start + match[0].length - 1

      positions.push({ start, end })

      highlightedParts.push(text.slice(lastEnd, start))
      highlightedParts.push(`<${HTMLTag} class="${CSSClass}">${match[0]}</${HTMLTag}>`)

      lastEnd = end + 1
    }

    highlightedParts.push(text.slice(lastEnd))

    this._positions = positions
    this._HTML = highlightedParts.join('')

    return this
  }

  get positions (): Positions {
    return this._positions
  }

  get HTML (): string {
    return this._HTML
  }
}

const highlighter = new Highlight()

const data = highlighter
  .highlight('The quick brown fox jumps over the lazy dog', 'fox')
