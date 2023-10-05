interface Highlight {
  positions: Array<{ start: number, end: number }>
  toString: () => string
}

export interface HighlightOptions {
  caseSensitive?: boolean
  wholeWords?: boolean
  HTMLTag?: string
  CSSClass?: string
}

const defaultOptions: HighlightOptions = {
  caseSensitive: false,
  wholeWords: false,
  HTMLTag: 'mark',
  CSSClass: 'orama-highlight'
}

export function highlight (text: string, searchTerm: string, options: HighlightOptions = defaultOptions): Highlight {
  const caseSensitive = options.caseSensitive ?? defaultOptions.caseSensitive
  const wholeWords = options.wholeWords ?? defaultOptions.wholeWords
  const HTMLTag = options.HTMLTag ?? defaultOptions.HTMLTag
  const CSSClass = options.CSSClass ?? defaultOptions.CSSClass
  const regexFlags = caseSensitive ? 'g' : 'gi'
  const boundary = wholeWords ? '\\b' : ''
  const searchTerms = (caseSensitive ? searchTerm : searchTerm.toLowerCase()).split(/\s+/).join('|')
  const regex = new RegExp(`${boundary}${searchTerms}${boundary}`, regexFlags)
  const positions: Array<{ start: number, end: number }> = []
  const highlightedParts: string[] = []

  let match

  const sourceText = caseSensitive ? text : text.toLowerCase()
  let lastEnd = 0

  while ((match = regex.exec(sourceText)) !== null) {
    const start = match.index
    const end = start + match[0].length - 1

    positions.push({ start, end })

    highlightedParts.push(text.slice(lastEnd, start))
    highlightedParts.push(`<${HTMLTag} class="${CSSClass}">${match[0]}</${HTMLTag}>`)

    lastEnd = end + 1
  }

  highlightedParts.push(text.slice(lastEnd))

  return {
    positions,
    toString: () => highlightedParts.join('')
  }
}
