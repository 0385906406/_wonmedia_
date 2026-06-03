'use client'

import { useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'

function extractYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export function RteVideoModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=')
  const [error, setError] = useState('')
  const [thumbId, setThumbId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleChange(val: string) { setUrl(val); setError(''); setThumbId(extractYouTubeId(val)) }

  function insert() {
    if (!/youtube\.com|youtu\.be/i.test(url.trim())) { setError('Chỉ hỗ trợ YouTube URL'); return }
    type C = { focus(): { setYoutubeVideo(o: { src: string; width: number; height: number }): { run(): void } } }
    ;(editor.chain() as unknown as C).focus().setYoutubeVideo({ src: url.trim(), width: 640, height: 360 }).run()
    onClose()
  }

  return (
    <div className="rte-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="rte-modal" role="dialog">
        <p className="rte-modal__title">Chèn video YouTube</p>
        <div className="rte-modal__field">
          <label className="rte-modal__label">URL YouTube</label>
          <input ref={inputRef} type="url" className="rte-modal__input"
            value={url} placeholder="https://www.youtube.com/watch?v=..."
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); insert() } if (e.key === 'Escape') onClose() }}
          />
          <span className="rte-modal__hint">Hỗ trợ: youtube.com/watch, youtu.be, shorts, live</span>
          {error && <span className="rte-modal__error">{error}</span>}
        </div>
        <div className="rte-modal__preview">
          {thumbId
            ? <img src={`https://img.youtube.com/vi/${thumbId}/hqdefault.jpg`} alt="YouTube thumbnail" />
            : <span className="rte-modal__preview-placeholder">▶ Preview</span>}
        </div>
        <div className="rte-modal__actions">
          <button type="button" className="rte-modal__btn" onClick={onClose}>Huỷ</button>
          <button type="button" className="rte-modal__btn rte-modal__btn--primary" onClick={insert}>Chèn video</button>
        </div>
      </div>
    </div>
  )
}
