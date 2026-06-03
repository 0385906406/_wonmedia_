/**
 * Server-side HTML sanitizer — loại bỏ script/event handlers/javascript: protocol.
 * Chạy server-side (Next.js Server Components) trước khi pass vào dangerouslySetInnerHTML.
 *
 * Để bảo vệ toàn diện hơn, cài thêm: npm install isomorphic-dompurify
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  return html
    // Xoá <script> tags và toàn bộ nội dung bên trong
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Xoá <iframe>, <object>, <embed>, <base>, <link rel=...>
    .replace(/<(iframe|object|embed|applet|base|meta|link)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|applet|base|meta|link)\b[^>]*\/?>/gi, '')
    // Xoá tất cả on* event attributes: onclick, onload, onerror, etc.
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, '')
    // Xoá javascript: và vbscript: protocol trong href/src/action
    .replace(/(href|src|action|formaction)\s*=\s*["']?\s*(?:javascript|vbscript)\s*:/gi, '$1="#"')
    // Xoá data: URI trong src (có thể chứa script)
    .replace(/(src)\s*=\s*["']?\s*data\s*:[^"'\s>]*/gi, '$1=""')
    // Xoá style với expression() — IE legacy XSS
    .replace(/style\s*=\s*["'][^"']*expression\s*\([^)]*\)[^"']*["']/gi, '')
}
