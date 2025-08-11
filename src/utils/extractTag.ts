export function extractTag(html: string, tagName: string): string | null {
  if (!html.trim() || !tagName.trim()) {
    return null
  }

  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `<${escapedTag}(?:\\s+[^>]*)?>` + '([\\s\\S]*?)' + `<\\/${escapedTag}>`,
    'gi',
  )

  let match
  let depth = 0
  let lastIndex = 0
  const openingTag = new RegExp(`<${escapedTag}(?:\\s+[^>]*?)?>`, 'gi')
  const closingTag = new RegExp(`<\\/${escapedTag}>`, 'gi')

  while ((match = pattern.exec(html)) !== null) {
    const start = match.index
    const end = pattern.lastIndex

    if (depth === 0) {
      lastIndex = end
    }

    const between = html.slice(lastIndex, start)
    const openMatches = between.match(openingTag)
    const closeMatches = between.match(closingTag)

    depth += (openMatches?.length || 0) - (closeMatches?.length || 0)

    if (depth === 0) {
      return match[1]
    }

    lastIndex = end
  }

  return null
}
