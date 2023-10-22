interface Position {
  start: number
  end: number
}

interface Highlight {
  positions: Position[]
  toString: () => string
}

export interface HighlightOptions {
  caseSensitive?: boolean
  wholeWords?: boolean
  HTMLTag?: string
  CSSClass?: string
  maxLength?: number
}

const defaultOptions: HighlightOptions = {
  caseSensitive: false,
  wholeWords: false,
  HTMLTag: 'mark',
  CSSClass: 'orama-highlight',
  maxLength: 0
}

const getOptionsValue = (options): HighlightOptions => ({
  caseSensitive: options.caseSensitive ?? defaultOptions.caseSensitive,
  CSSClass: options.CSSClass ?? defaultOptions.CSSClass,
  HTMLTag: options.HTMLTag ?? defaultOptions.HTMLTag,
  maxLength: options.maxLength ?? defaultOptions.maxLength,
  wholeWords: options.wholeWords ?? defaultOptions.wholeWords
})

const getMostPopularSubstring = (positions: Position[], text: string, regex: RegExp, options: HighlightOptions = defaultOptions): Highlight => {
  let maxOccurrences = 0;
  const {CSSClass, HTMLTag, maxLength} = getOptionsValue(options)

  return positions.reduce((acc: Highlight, curr: Position) => {
    let highlightedParts: string[] = [];
    let min = Math.max(0, curr.start - Math.floor(maxLength / 2));
    let max = Math.min(text.length, curr.start + Math.ceil(maxLength / 2));
    let diff = options.maxLength - (max - min);

    if (max === text.length) {
      min = min - diff;
    } else if (min === 0) {
      max = max + diff;
    }

    const textToAnalyze = text.slice(min, max);
    const allMatchesRaw = Array.from(textToAnalyze.matchAll(regex)); // Ensure it's an array for clarity
    const count = allMatchesRaw.length;

    if (count > maxOccurrences) {
      maxOccurrences = count;
      let lastEnd = 0;
      acc.positions = allMatchesRaw.map((match) => {
        const end = match.index! + match[0]!.length - 1;
        highlightedParts.push(textToAnalyze.slice(lastEnd, match.index!));
        highlightedParts.push(`<${HTMLTag} class="${CSSClass}">${match[0]}</${HTMLTag}>`);
        lastEnd = end + 1;
        return {
          start: match.index!,
          end,
        };
      });
      highlightedParts.push(textToAnalyze.slice(lastEnd));
      acc.toString = () => highlightedParts.join("");
    }

    return acc;
  }, {
    toString: () => "",
    positions: [],
  });
};

export function highlight (text: string, searchTerm: string, options: HighlightOptions = defaultOptions): Highlight {
  const {caseSensitive, CSSClass, HTMLTag, maxLength, wholeWords} = getOptionsValue(options)
  const regexFlags = caseSensitive ? 'g' : 'gi'
  const boundary = wholeWords ? '\\b' : ''
  const searchTerms = (caseSensitive ? searchTerm : searchTerm.toLowerCase()).trim().split(/\s+/).join('|')
  const regex = new RegExp(`${boundary}${searchTerms}${boundary}`, regexFlags)
  const positions: Array<{ start: number, end: number }> = []
  const highlightedParts: string[] = []

  let match
  let lastEnd = 0

  while (match = regex.exec(text)) {
    const start = match.index
    const end = start + match[0].length - 1

    positions.push({ start, end })

    highlightedParts.push(text.slice(lastEnd, start))
    highlightedParts.push(`<${HTMLTag} class="${CSSClass}">${match[0]}</${HTMLTag}>`)

    lastEnd = end + 1
  }

  highlightedParts.push(text.slice(lastEnd))

  if (options.maxLength) {
    return getMostPopularSubstring(positions, text, regex, options)
  } else {
    return {
      positions,
      toString: () => highlightedParts.join("")
    }
  }
}
