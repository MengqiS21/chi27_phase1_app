/** Normalize model output to plain text (no markdown formatting). */
export function toPlainText(text: string): string {
  let out = text.trim();

  // **bold** / __bold__ (allow spaces inside markers)
  out = out.replace(/\*\*\s*([\s\S]*?)\s*\*\*/g, "$1");
  out = out.replace(/__\s*([\s\S]*?)\s__/g, "$1");

  // *italic* / _italic_ (single markers, single line)
  out = out.replace(/(?<![*_])\*([^*\n]+?)\*(?![*_])/g, "$1");
  out = out.replace(/(?<![*_])_([^_\n]+?)_(?![*_])/g, "$1");

  // `inline code`
  out = out.replace(/`([^`]+?)`/g, "$1");

  // # headings at line start
  out = out.replace(/^#{1,6}\s+/gm, "");

  // Markdown bullet prefixes at line start
  out = out.replace(/^[\t ]*[-*+]\s+/gm, "");

  return out.trim();
}
