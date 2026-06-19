'use client'

import './rich-text-editor.css'
import { useCallback, useEffect, useRef, useState, startTransition } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import YoutubeExtension from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

import { useToast } from '@/components/admin/toast-provider'
import { RteLinkModal } from './rte-link-modal'
import { RteVideoModal } from './rte-video-modal'
import { RteColorPicker } from './rte-color-picker'

interface RteChain {
  run(): boolean
  focus(): RteChain
  setParagraph(): RteChain
  toggleHeading(a: { level: 1|2|3|4 }): RteChain
  toggleBold(): RteChain; toggleItalic(): RteChain
  toggleUnderline(): RteChain; toggleStrike(): RteChain; toggleCode(): RteChain
  setTextAlign(a: 'left'|'center'|'right'|'justify'): RteChain
  toggleSuperscript(): RteChain; toggleSubscript(): RteChain
  toggleBulletList(): RteChain; toggleOrderedList(): RteChain
  toggleBlockquote(): RteChain; toggleCodeBlock(): RteChain
  setLink(a: { href: string; target?: string }): RteChain; unsetLink(): RteChain
  setImage(a: { src: string; alt: string }): RteChain
  setHorizontalRule(): RteChain; undo(): RteChain; redo(): RteChain
  insertTable(o: { rows: number; cols: number; withHeaderRow: boolean }): RteChain
  addRowBefore(): RteChain; addRowAfter(): RteChain
  addColumnBefore(): RteChain; addColumnAfter(): RteChain
  deleteRow(): RteChain; deleteColumn(): RteChain; deleteTable(): RteChain
  mergeOrSplit(): RteChain
  setYoutubeVideo(o: { src: string; width: number; height: number }): RteChain
  toggleTaskList(): RteChain
}
interface RteEditor {
  getAttributes(n: string): Record<string, unknown>
  isActive(n: string, a?: Record<string, unknown>): boolean
  getHTML(): string
  chain(): { focus(): RteChain }
  commands: { setContent(h: string): void; insertContent(c: string): void }
  on(e: 'update', h: () => void): void
  off(e: 'update', h: () => void): void
}
function rte(e: Editor): RteEditor { return e as unknown as RteEditor }

const I = {
  Bold:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  Italic:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  Underline:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  Strike:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.3 12H6.7"/><path d="M12 3a4 4 0 0 0-4 4c0 1.5.83 2.7 2 3.3"/><path d="M12 21a4 4 0 0 0 4-4c0-1.5-.83-2.7-2-3.3"/></svg>,
  Code:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  AlignLeft:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
  AlignCenter:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  AlignRight:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>,
  AlignJustify:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Link:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Image:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Video:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Hr:            () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>,
  BulletList:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>,
  OrderedList:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" strokeWidth="2"/><path d="M4 10h2" strokeWidth="2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeWidth="2"/></svg>,
  Blockquote:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  CodeBlock:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="m8 9-3 3 3 3"/><path d="m16 9 3 3-3 3"/><line x1="11" y1="9" x2="13" y2="15"/></svg>,
  Table:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  Undo:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
  Redo:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>,
  Fullscreen:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
  ExitFullscreen:() => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>,
  TextColor:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/></svg>,
  Highlight:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>,
  Superscript:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.44-2 1.5-2.5S20 8.33 20 7.25c0-.47-.17-.93-.46-1.29a2 2 0 0 0-1.62-.71c-.69 0-1.58.32-1.92 1.16"/></svg>,
  Subscript:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14.25c0-.47-.17-.93-.46-1.29a2 2 0 0 0-1.62-.71c-.69 0-1.58.32-1.92 1.16"/></svg>,
  ChevronDown:   () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  TaskList:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="4" height="4" rx="1"/><polyline points="3.8 7 4.8 8 6.5 5.5"/><line x1="11" y1="7" x2="21" y2="7"/><rect x="3" y="13" width="4" height="4" rx="1"/><line x1="11" y1="15" x2="21" y2="15"/></svg>,
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="rich-text-editor__group">{children}</div>
}
function Btn({ children, label, active, onClick }: { children: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`rich-text-editor__btn${active ? ' is-active' : ''}`}
      title={label} aria-label={label} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}

function syncCount(editor: Editor, setW: (n: number) => void, setC: (n: number) => void) {
  const text = (editor as unknown as { state: { doc: { textContent: string } } }).state.doc.textContent
  const t = text.trim()
  setW(t.length > 0 ? t.split(/\s+/).length : 0)
  setC(text.length)
}

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  imageUploadEndpoint?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết...',
  imageUploadEndpoint = '/api/admin/media/upload',
}: Props) {
  const toast = useToast()

  const [showLink,     setShowLink]     = useState(false)
  const [showVideo,    setShowVideo]    = useState(false)
  const [showHeading,  setShowHeading]  = useState(false)
  const [colorMode,    setColorMode]    = useState<'text'|'highlight'|null>(null)
  const [fullscreen,   setFullscreen]   = useState(false)
  const [dragOver,     setDragOver]     = useState(false)
  const [uploading,    setUploading]    = useState(false)
  const [showTable,    setShowTable]    = useState(false)
  const [tableRows,    setTableRows]    = useState(3)
  const [tableCols,    setTableCols]    = useState(3)
  const [wordCount,    setWordCount]    = useState(0)
  const [charCount,    setCharCount]    = useState(0)

  const headingRef  = useRef<HTMLDivElement>(null)
  const tableRef    = useRef<HTMLDivElement>(null)
  const editorRef   = useRef<Editor | null>(null)
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastEditorOutputRef = useRef<string>(value ?? '')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1,2,3,4] }, codeBlock: { HTMLAttributes: { class: 'language-text' } } }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto'],
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      ImageExtension.configure({ allowBase64: false, HTMLAttributes: { loading: 'lazy', class: 'rte-image' } }),
      YoutubeExtension.configure({ controls: true, nocookie: true }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: false }),
      TableRow, TableHeader, TableCell,
      Superscript, Subscript, Typography,
      TaskList, TaskItem.configure({ nested: true }),
    ],
    content: value,
    editorProps: { attributes: { class: 'rich-text-editor__content' } },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML()
      lastEditorOutputRef.current = html
      if (debounce.current) clearTimeout(debounce.current)
      debounce.current = setTimeout(() => { startTransition(() => onChangeRef.current(html)) }, 300)
    },
    immediatelyRender: false,
  })

  useEffect(() => { editorRef.current = editor }, [editor])
  useEffect(() => () => { if (debounce.current) clearTimeout(debounce.current) }, [])

  useEffect(() => {
    if (!editor) return
    const newValue = value ?? ''
    const curr = editor.getHTML()
    const empty = (h: string) => !h || h === '<p></p>'

    const isExternalChange = newValue !== lastEditorOutputRef.current
    if (isExternalChange && newValue !== curr && !(empty(newValue) && empty(curr))) {
      lastEditorOutputRef.current = newValue
      rte(editor).commands.setContent(newValue)
    }
    syncCount(editor, setWordCount, setCharCount)
  }, [editor, value])

  useEffect(() => {
    if (!editor) return
    const h = () => syncCount(editor, setWordCount, setCharCount)
    rte(editor).on('update', h)
    return () => rte(editor).off('update', h)
  }, [editor])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) setShowHeading(false)
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) setShowTable(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && fullscreen) setFullscreen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen])

  const uploadFile = useCallback(async (file: File) => {
    if (!editor) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch(imageUploadEndpoint, { method: 'POST', body: fd })
      if (!res.ok) { toast.error('Upload thất bại'); return }
      const { data } = await res.json()
      rte(editor).chain().focus().setImage({ src: data.url, alt: file.name }).run()
    } catch { toast.error('Lỗi upload ảnh') }
    finally { setUploading(false) }
  }, [editor, imageUploadEndpoint, toast.error])

  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleImage = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const insertTable = useCallback(() => {
    if (!editor) return
    rte(editor).chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run()
    setShowTable(false)
  }, [editor, tableRows, tableCols])

  if (!editor) {
    return <div className="rich-text-editor rich-text-editor--loading"><div className="dh-skeleton" style={{ height: 200 }} /></div>
  }

  const r = rte(editor)
  const act = (n: string, a?: Record<string, unknown>) => editor.isActive(n, a)
  const inTable = act('table')
  const headingLabel = () => {
    if (act('heading', { level: 1 })) return 'H1'
    if (act('heading', { level: 2 })) return 'H2'
    if (act('heading', { level: 3 })) return 'H3'
    if (act('heading', { level: 4 })) return 'H4'
    return 'Đoạn văn'
  }
  const txtColor = (r.getAttributes('textStyle').color as string) ?? ''
  const hlColor  = (r.getAttributes('highlight').color as string) ?? ''

  return (
    <>
      <div className={['rich-text-editor', fullscreen ? 'rich-text-editor--fullscreen' : '', dragOver ? 'rich-text-editor--drag-over' : ''].filter(Boolean).join(' ')}
        onDragOver={e => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragOver(true) } }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) await uploadFile(f) }}>

        <div className="rich-text-editor__toolbar">
          <Group>
            <div ref={headingRef} className="rte-heading-wrap">
              <Btn label={headingLabel()} active={act('heading')} onClick={() => setShowHeading(v => !v)}>
                <span style={{ fontSize: 11, minWidth: 22 }}>{headingLabel()}</span>
                <I.ChevronDown />
              </Btn>
              {showHeading && (
                <div className="rte-heading-dropdown">
                  {[
                    { label: 'Đoạn văn', action: () => r.chain().focus().setParagraph().run(), isActive: !act('heading') },
                    { label: 'H1', action: () => r.chain().focus().toggleHeading({ level: 1 }).run(), isActive: act('heading', { level: 1 }) },
                    { label: 'H2', action: () => r.chain().focus().toggleHeading({ level: 2 }).run(), isActive: act('heading', { level: 2 }) },
                    { label: 'H3', action: () => r.chain().focus().toggleHeading({ level: 3 }).run(), isActive: act('heading', { level: 3 }) },
                    { label: 'H4', action: () => r.chain().focus().toggleHeading({ level: 4 }).run(), isActive: act('heading', { level: 4 }) },
                  ].map(item => (
                    <button key={item.label} type="button"
                      className={`rte-heading-dropdown__item${item.isActive ? ' is-active' : ''}`}
                      onClick={() => { item.action(); setShowHeading(false) }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Group>

          <Group>
            <Btn label="In đậm (Ctrl+B)"   active={act('bold')}      onClick={() => r.chain().focus().toggleBold().run()}><I.Bold /></Btn>
            <Btn label="In nghiêng (Ctrl+I)" active={act('italic')}   onClick={() => r.chain().focus().toggleItalic().run()}><I.Italic /></Btn>
            <Btn label="Gạch chân (Ctrl+U)" active={act('underline')} onClick={() => r.chain().focus().toggleUnderline().run()}><I.Underline /></Btn>
            <Btn label="Gạch ngang" active={act('strike')}            onClick={() => r.chain().focus().toggleStrike().run()}><I.Strike /></Btn>
            <Btn label="Code inline" active={act('code')}             onClick={() => r.chain().focus().toggleCode().run()}><I.Code /></Btn>
          </Group>

          <Group>
            <div className="rte-color-picker-wrap">
              <Btn label="Màu chữ" active={!!txtColor || colorMode === 'text'} onClick={() => setColorMode(v => v === 'text' ? null : 'text')}>
                <I.TextColor /><span className="rte-color-dot" style={{ backgroundColor: txtColor || 'transparent' }} />
              </Btn>
              {colorMode === 'text' && <RteColorPicker editor={editor} mode="text" onClose={() => setColorMode(null)} />}
            </div>
            <div className="rte-color-picker-wrap">
              <Btn label="Highlight" active={act('highlight') || colorMode === 'highlight'} onClick={() => setColorMode(v => v === 'highlight' ? null : 'highlight')}>
                <I.Highlight /><span className="rte-color-dot" style={{ backgroundColor: hlColor || 'transparent' }} />
              </Btn>
              {colorMode === 'highlight' && <RteColorPicker editor={editor} mode="highlight" onClose={() => setColorMode(null)} />}
            </div>
          </Group>

          <Group>
            <Btn label="Căn trái"    active={act('paragraph', { textAlign: 'left' })}    onClick={() => r.chain().focus().setTextAlign('left').run()}><I.AlignLeft /></Btn>
            <Btn label="Căn giữa"    active={act('paragraph', { textAlign: 'center' })}  onClick={() => r.chain().focus().setTextAlign('center').run()}><I.AlignCenter /></Btn>
            <Btn label="Căn phải"    active={act('paragraph', { textAlign: 'right' })}   onClick={() => r.chain().focus().setTextAlign('right').run()}><I.AlignRight /></Btn>
            <Btn label="Căn đều"     active={act('paragraph', { textAlign: 'justify' })} onClick={() => r.chain().focus().setTextAlign('justify').run()}><I.AlignJustify /></Btn>
          </Group>

          <Group>
            <div ref={tableRef} className="rte-heading-wrap">
              <Btn label="Bảng" active={inTable || showTable} onClick={() => setShowTable(v => !v)}><I.Table /></Btn>
              {showTable && (
                <div className="rte-heading-dropdown" style={{ width: 180, padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#6b7280' }}>Chèn bảng</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Hàng</label>
                      <input type="number" min={1} max={20} value={tableRows}
                        onChange={e => setTableRows(Math.max(1, Math.min(20, +e.target.value)))}
                        style={{ width: '100%', padding: '4px 6px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Cột</label>
                      <input type="number" min={1} max={10} value={tableCols}
                        onChange={e => setTableCols(Math.max(1, Math.min(10, +e.target.value)))}
                        style={{ width: '100%', padding: '4px 6px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, outline: 'none' }}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={insertTable} style={{ width: '100%', padding: '6px 0', background: 'var(--color-indigo)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Chèn bảng
                  </button>
                </div>
              )}
            </div>
            <Btn label="Liên kết (Ctrl+K)" active={act('link')} onClick={() => setShowLink(true)}><I.Link /></Btn>
            <Btn label="Chèn ảnh"          onClick={handleImage}><I.Image /></Btn>
            <Btn label="Video YouTube"      onClick={() => setShowVideo(true)}><I.Video /></Btn>
            <Btn label="Đường kẻ ngang"     onClick={() => r.chain().focus().setHorizontalRule().run()}><I.Hr /></Btn>
          </Group>

          <Group>
            <Btn label="Danh sách chấm"   active={act('bulletList')}  onClick={() => r.chain().focus().toggleBulletList().run()}><I.BulletList /></Btn>
            <Btn label="Danh sách số"     active={act('orderedList')} onClick={() => r.chain().focus().toggleOrderedList().run()}><I.OrderedList /></Btn>
            <Btn label="Danh sách việc"   active={act('taskList')}    onClick={() => r.chain().focus().toggleTaskList().run()}><I.TaskList /></Btn>
            <Btn label="Trích dẫn"        active={act('blockquote')}  onClick={() => r.chain().focus().toggleBlockquote().run()}><I.Blockquote /></Btn>
            <Btn label="Khối code"        active={act('codeBlock')}   onClick={() => r.chain().focus().toggleCodeBlock().run()}><I.CodeBlock /></Btn>
          </Group>

          <Group>
            <Btn label="Hoàn tác (Ctrl+Z)"     onClick={() => r.chain().focus().undo().run()}><I.Undo /></Btn>
            <Btn label="Làm lại (Ctrl+Y)"      onClick={() => r.chain().focus().redo().run()}><I.Redo /></Btn>
            <Btn label={fullscreen ? 'Thu nhỏ' : 'Toàn màn hình'} active={fullscreen} onClick={() => setFullscreen(v => !v)}>
              {fullscreen ? <I.ExitFullscreen /> : <I.Fullscreen />}
            </Btn>
          </Group>
        </div>

        {inTable && (
          <div className="rich-text-editor__table-bar">
            <Group>
              <Btn label="Thêm hàng trên" onClick={() => r.chain().focus().addRowBefore().run()}>↑ Hàng trên</Btn>
              <Btn label="Thêm hàng dưới" onClick={() => r.chain().focus().addRowAfter().run()}>↓ Hàng dưới</Btn>
              <Btn label="Thêm cột trái"  onClick={() => r.chain().focus().addColumnBefore().run()}>← Cột trái</Btn>
              <Btn label="Thêm cột phải"  onClick={() => r.chain().focus().addColumnAfter().run()}>→ Cột phải</Btn>
            </Group>
            <Group>
              <Btn label="Gộp ô" onClick={() => r.chain().focus().mergeOrSplit().run()}>Gộp ô</Btn>
            </Group>
            <Group>
              <Btn label="Xoá hàng" onClick={() => r.chain().focus().deleteRow().run()}><span style={{ color: '#dc2626' }}>Xoá hàng</span></Btn>
              <Btn label="Xoá cột"  onClick={() => r.chain().focus().deleteColumn().run()}><span style={{ color: '#dc2626' }}>Xoá cột</span></Btn>
              <Btn label="Xoá bảng" onClick={() => r.chain().focus().deleteTable().run()}><span style={{ color: '#dc2626' }}>Xoá bảng</span></Btn>
            </Group>
          </div>
        )}

        <EditorContent editor={editor} />

        {uploading && <div className="rte-uploading-row">Đang tải ảnh lên...</div>}

        <div className="rich-text-editor__footer">
          <div className="rich-text-editor__footer-left">
            <Btn label="Chỉ số trên" active={act('superscript')} onClick={() => r.chain().focus().toggleSuperscript().run()}><I.Superscript /></Btn>
            <Btn label="Chỉ số dưới" active={act('subscript')}   onClick={() => r.chain().focus().toggleSubscript().run()}><I.Subscript /></Btn>
          </div>
          <span className="rich-text-editor__word-count">{wordCount} từ · {charCount} ký tự</span>
        </div>

        <p className="rich-text-editor__hint">💡 Dán nội dung từ Word/Google Docs sẽ tự làm sạch định dạng. Kéo thả ảnh vào đây để upload.</p>
      </div>

      {showLink  && <RteLinkModal  editor={editor} onClose={() => setShowLink(false)} />}
      {showVideo && <RteVideoModal editor={editor} onClose={() => setShowVideo(false)} />}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={async e => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) await uploadFile(file)
        }}
      />
    </>
  )
}
