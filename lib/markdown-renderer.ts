/**
 * Custom lightweight Markdown to HTML converter for blog posts
 * Ensures valid HTML string with class="..." attributes for dangerouslySetInnerHTML
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return ""

  // Escape basic HTML entities first to avoid injection
  let content = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // 1. Code blocks (```lang ... ```)
  content = content.replace(
    /```([a-z]*)\n([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre class="bg-neutral-900 p-4 rounded-xl border border-neutral-800 overflow-x-auto text-xs text-emerald-400 my-4"><code>${code.trim()}</code></pre>`
  )

  // 2. Inline code (`code`)
  content = content.replace(
    /`([^`]+)`/g,
    '<code class="bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs px-1.5 py-0.5 rounded font-mono">$1</code>'
  )

  // 3. Headers
  content = content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-white mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4 border-b border-neutral-800 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-10 mb-5">$1</h1>')

  // 4. Horizontal Rules
  content = content.replace(/^---$/gim, '<hr class="border-neutral-800 my-8"/>')

  // 5. Links [text](url)
  content = content.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">$1</a>'
  )

  // 6. Bold & Italic
  content = content
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-neutral-200">$1</em>')

  // 7. Bullet lists (- or *)
  content = content.replace(
    /((?:^[ \t]*[-*] .*\n?)+)/gm,
    (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((line) => `<li class="ml-4 list-disc text-neutral-300">${line.replace(/^[ \t]*[-*] /, "")}</li>`)
        .join("")
      return `<ul class="space-y-2 my-4 pl-4">${items}</ul>`
    }
  )

  // 8. Numbered lists (1. 2. 3.)
  content = content.replace(
    /((?:^[ \t]*\d+\. .*\n?)+)/gm,
    (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((line) => `<li class="ml-4 list-decimal text-neutral-300">${line.replace(/^[ \t]*\d+\. /, "")}</li>`)
        .join("")
      return `<ol class="space-y-2 my-4 pl-4">${items}</ol>`
    }
  )

  // 9. Blockquotes (> text)
  content = content.replace(
    /^&gt;\s?(.*$)/gim,
    '<blockquote class="border-l-4 border-blue-500 pl-4 py-1 my-4 italic text-neutral-300 bg-neutral-900/50 rounded-r">$1</blockquote>'
  )

  // 10. Wrap remaining paragraphs
  const blocks = content.split(/\n\n+/)
  const parsed = blocks
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed
      }
      return `<p class="text-neutral-300 text-base leading-relaxed my-4">${trimmed.replace(/\n/g, "<br/>")}</p>`
    })
    .join("")

  return parsed
}
