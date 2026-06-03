/**
 * Verify ảnh bằng magic bytes — không tin `file.type` từ client.
 * Returns true nếu bytes đầu tiên match một trong các format ảnh được phép.
 */
export function verifyImageMagicBytes(buffer: Uint8Array): { ok: boolean; ext: string } {
  if (buffer.length < 12) return { ok: false, ext: '' }

  const b = buffer

  // JPEG: FF D8 FF
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return { ok: true, ext: 'jpg' }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return { ok: true, ext: 'png' }

  // GIF: 47 49 46 38 (GIF8)
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return { ok: true, ext: 'gif' }

  // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF....WEBP)
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { ok: true, ext: 'webp' }

  return { ok: false, ext: '' }
}
