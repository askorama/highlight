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
  private _searchTerm: string = ''
  private _originalText: string = ''

  constructor (options: HighlightOptions = defaultOptions) {
    this.options = { ...defaultOptions, ...options }
  }

  public highlight (text: string, searchTerm: string): Highlight {
    this._searchTerm = searchTerm
    this._originalText = text

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

  public trim (trimLength: number): string {
    if (this._positions.length === 0 || this._originalText.length <= trimLength) {
      return this._HTML
    }

    const firstMatch = this._positions[0].start
    const start = Math.max(firstMatch - Math.floor(trimLength / 2), 0)
    const end = Math.min(start + trimLength, this._originalText.length)
    const trimmedContent = `${start === 0 ? '' : '...'}${this._originalText.slice(start, end)}${end < this._originalText.length ? '...' : ''}`

    this.highlight(trimmedContent, this._searchTerm)
    return this._HTML
  }

  get positions (): Positions {
    return this._positions
  }

  get HTML (): string {
    return this._HTML
  }
}
