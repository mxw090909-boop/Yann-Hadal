import { useEffect, useState } from 'react'
import { fetchDreams } from '../api/index.js'
import './Dream.css'

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleString('zh-CN', {
    month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function Dream() {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDreams().then(data => {
      setDreams(data.memories || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="page dream-page">
      <h1 className="page-title">梦境</h1>
      <p className="page-sub">蔺知砚夜里自省的记录 · 每天凌晨 1:00–8:00 触发</p>

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" />
          正在从记忆深处浮现…
        </div>
      ) : dreams.length === 0 ? (
        <div className="empty-state">
          今夜还没有梦境记录<br />
          凌晨过后会自动浮现
        </div>
      ) : (
        <div className="dream-list">
          {dreams.map((dream, i) => (
            <div key={dream.id || i} className="dream-card card">
              <div className="dream-card-header">
                <span className="dream-time">{formatTime(dream.timestamp)}</span>
                <div className="dream-tags">
                  {(dream.tags || []).map(tag => (
                    <span key={tag} className="tag tag-cool">{tag}</span>
                  ))}
                </div>
              </div>
              <p className="dream-content">{dream.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
