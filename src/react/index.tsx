import type { FC } from 'react'
import type { HighlightOptions } from '../index.js'
import { highlight } from '../index.js'

interface HighlightProps {
  text: string
  searchTerm: string
  options?: HighlightOptions
}

export const Highlight: FC<HighlightProps> = ({ text, searchTerm, options }) => {
  const { toString } = highlight(text, searchTerm, options)
  return toString()
}