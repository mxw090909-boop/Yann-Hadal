import { useEffect, useRef, useState } from 'react'
import { fetchBooks } from '../api/index.js'
import './Reading.css'

function getSettings() {
  try { return JSON.parse(localStorage.getItem('yann-hadal-settings') || '{}') } catch { return {} }
}

async function uploadBook(file) {
  const s = getSettings()
  const base = (s.vpsBase || '').replace(/\/$/, '')
  if (!base) throw new Error('请先在设置里填好 VPS 地址')
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${base}/hadal/reading`, {
    method: 'POST',
    headers: s.apiKey ? { Authorization: `Bearer ${s.apiKey}` } : {},
    body: form,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `上传失败 ${res.status}`)
  }
  return await res.json()
}

const MOCK_BOOKS = [
  {
    id: 'book-1',
    title: '向日葵不开花的夏天',
    author: '道尾秀介',
    cover: null,
    progress: 68,
    currentChapter: 8,
    totalChapters: 12,
    lastRead: '2026-06-09',
    note: '她在读这本的时候很安静，步数少，心率平稳。',
  },
  {
    id: 'book-2',
    title: '深夜书店',
    author: '矢野隆',
    cover: null,
    progress: 100,
    currentChapter: 15,
    totalChapters: 15,
    lastRead: '2026-05-22',
    note: '读完了。',
  },
]

function ProgressRing({ percent }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - percent / 100)
  return (
    <svg width="56" height="56" className="progress-ring">
      <circle cx="28" cy="28" r={r} className="progress-ring-track" />
      <circle
        cx="28" cy="28" r={r}
        className="progress-ring-bar"
        style={{ strokeDasharray: circ, strokeDashoffset: offset }}
      />
      <text x="28" y="33" className="progress-ring-text">
        {percent}%
      </text>
    </svg>
  )
}

export default function Reading() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState(null)
  const fileRef = useRef(null)

  function reload() {
    setLoading(true)
    fetchBooks().then(data => {
      setBooks((data.books && data.books.length > 0) ? data.books : MOCK_BOOKS)
      setLoading(false)
    })
  }

  useEffect(() => { reload() }, [])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMsg(null)
    try {
      await uploadBook(file)
      setUploadMsg({ ok: true, text: `《${file.name.replace(/\.epub$/i, '')}》已加入书库` })
      reload()
    } catch (err) {
      setUploadMsg({ ok: false, text: err.message })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const reading = books.filter(b => b.progress < 100)
  const finished = books.filter(b => b.progress >= 100)

  return (
    <div className="page reading-page">
      <div className="reading-header">
        <div>
          <h1 className="page-title">共读</h1>
          <p className="page-sub">一起读的书</p>
        </div>
        <label className={`reading-upload-btn ${uploading ? 'reading-upload-btn--loading' : ''}`}>
          <input
            ref={fileRef}
            type="file"
            accept=".epub"
            style={{ display: 'none' }}
            onChange={handleFile}
            disabled={uploading}
          />
          {uploading ? '导入中…' : '+ 导入 epub'}
        </label>
      </div>
      {uploadMsg && (
        <div className={`reading-upload-msg ${uploadMsg.ok ? 'reading-upload-msg--ok' : 'reading-upload-msg--err'}`}>
          {uploadMsg.text}
          <button onClick={() => setUploadMsg(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" style={{ background: 'var(--accent-green)' }} />
          翻书中…
        </div>
      ) : (
        <>
          {reading.length > 0 && (
            <section className="reading-section">
              <div className="reading-section-title">正在读</div>
              <div className="reading-list">
                {reading.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          {finished.length > 0 && (
            <section className="reading-section">
              <div className="reading-section-title">读完了</div>
              <div className="reading-list">
                {finished.map(book => (
                  <BookCard key={book.id} book={book} finished />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function BookCard({ book, finished }) {
  return (
    <div className={`book-card card ${finished ? 'book-card--finished' : ''}`}>
      <ProgressRing percent={book.progress} />
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        {!finished && (
          <div className="book-chapter">
            第 {book.currentChapter} / {book.totalChapters} 章 ·
            上次：{new Date(book.lastRead).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
          </div>
        )}
        {book.note && (
          <p className="book-note">"{book.note}"</p>
        )}
      </div>
    </div>
  )
}
