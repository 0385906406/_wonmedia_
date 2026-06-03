'use client'

import { useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'

export function RteLinkModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  type E = { getAttributes(n: string): Record<string, unknown> }
  const attrs = (editor as unknown as E).getAttributes('link')
  const existing = (attrs.href as string) ?? ''

  const [url, setUrl] = useState(existing || 'https://')
  const [newTab, setNewTab] = useState((attrs.target as string) === '_blank' || !existing)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [])

  function apply() {
    const v = url.trim()
    if (!v || v === 'https://') {
      (editor as unknown as { chain(): { focus(): { unsetLink(): { run(): void } } } }).chain().focus().unsetLink().run()
      onClose(); return
    }
    if (!/^(https?:|mailto:|tel:|\/|#)/i.test(v)) { setError('URL không hợp lệ'); return }
    type C = { focus(): { setLink(a: { href: string; target?: string }): { run(): void } } }
    ;(editor.chain() as unknown as C).focus().setLink({ href: v, ...(newTab ? { target: '_blank' } : {}) }).run()
    onClose()
  }

  function remove() {
    (editor as unknown as { chain(): { focus(): { unsetLink(): { run(): void } } } }).chain().focus().unsetLink().run()
    onClose()
  }

  return (
    <div className="rte-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="rte-modal" role="dialog">
        <p className="rte-modal__title">Chèn liên kết</p>
        <div className="rte-modal__field">
          <label className="rte-modal__label">URL</label>
          <input ref={inputRef} type="url" className="rte-modal__input"
            value={url} placeholder="https://"
            onChange={e => { setUrl(e.target.value); setError('') }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apply() } if (e.key === 'Escape') onClose() }}
          />
          {error && <span className="rte-modal__error">{error}</span>}
        </div>
        <label className="rte-modal__checkbox-row">
          <input type="checkbox" checked={newTab} onChange={e => setNewTab(e.target.checked)} />
          Mở trong tab mới
        </label>
        <div className="rte-modal__actions">
          {existing && <button type="button" className="rte-modal__btn rte-modal__btn--danger" onClick={remove}>Xoá liên kết</button>}
          <button type="button" className="rte-modal__btn" onClick={onClose}>Huỷ</button>
          <button type="button" className="rte-modal__btn rte-modal__btn--primary" onClick={apply}>Áp dụng</button>
        </div>
      </div>
    </div>
  )
}
