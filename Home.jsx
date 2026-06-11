import { useState } from 'react'
import { MOCK_NOTES } from '../api/index.js'
import './Note.css'

function formatDate(str) {
  const d = new Date(str)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Note() {
  const [notes] = useState(MOCK_NOTES)
  const [selected, setSelected] = useState(notes[0] || null)

  return (
    <div className="page note-page">
      <h1 className="page-title">留言</h1>
      <p className="page-sub">蔺知砚写给年年的纸条</p>

      <div className="note-layout">
        <div className="note-list">
          {notes.map(note => (
            <button
              key={note.id}
              className={`note-list-item ${selected?.id === note.id ? 'note-list-item--active' : ''}`}
              onClick={() => setSelected(note)}
            >
              {note.pinned && <span className="note-pin">📌</span>}
              <div>
                <div className="note-list-date">{formatDate(note.date)}</div>
                <div className="note-list-preview">
                  {note.content.slice(0, 42).replace(/\n/g, ' ')}…
                </div>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="note-detail card">
            <div className="note-detail-date">
              {formatDate(selected.date)}
              {selected.pinned && <span className="tag tag-warm" style={{ marginLeft: 10 }}>置顶</span>}
            </div>
            <div className="note-detail-from">蔺知砚 → 蔺年</div>
            <div className="divider" />
            <p className="note-detail-content">{selected.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
