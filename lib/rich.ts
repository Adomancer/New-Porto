export type RichToken = { text: string; bold?: boolean; italic?: boolean };

/** Parses the tiny markup used in data/content.ts: **bold** and *serif italic*. */
export function parseRich(input: string): RichToken[] {
  const tokens: RichToken[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input))) {
    if (match.index > last) tokens.push({ text: input.slice(last, match.index) });
    if (match[1] !== undefined) tokens.push({ text: match[1], bold: true });
    else tokens.push({ text: match[2], italic: true });
    last = re.lastIndex;
  }
  if (last < input.length) tokens.push({ text: input.slice(last) });
  return tokens;
}

export type RichWord = RichToken & { spaceAfter: boolean };

/** Splits rich tokens into words, keeping each word's formatting and whether a space follows it. */
export function richWords(input: string): RichWord[] {
  const words: RichWord[] = [];
  for (const token of parseRich(input)) {
    for (const piece of token.text.match(/\S+|\s+/g) ?? []) {
      if (/^\s/.test(piece)) {
        if (words.length) words[words.length - 1].spaceAfter = true;
      } else {
        words.push({ ...token, text: piece, spaceAfter: false });
      }
    }
  }
  return words;
}
