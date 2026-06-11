import { useEffect, useState } from 'react'
import './Reading.css'

// 对接 nenei-yomiai API
async function fetchBooks() {
  try {
    // 需要通过后端代理调用 Nenei VPS 的 yomiai_list_books
    const res = await fetch('/api/yomiai/books')
    if (!res.ok) throw new Error('books fetch failed')
    return await res.json()
  } catch {
    return MOCK_BOOKS
  }
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

  useEffect(() => {
    fetchBooks().then(data => {
      setBooks(Array.isArray(data) ? data : MOCK_BOOKS)
      setLoading(false)
    })
  }, [])

  const reading = books.filter(b => b.progress < 100)
  const finished = books.filter(b => b.progress >= 100)

  return (
    <div className="page reading-page">
      <h1 className="page-title">共读</h1>
      <p className="page-sub">一起读的书</p>

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
