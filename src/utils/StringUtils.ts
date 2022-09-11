export function renderHtml(value: string) {
  return value.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<p>/g, '<p class="mb-1">')
}
