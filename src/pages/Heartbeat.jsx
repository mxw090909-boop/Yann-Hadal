import { useEffect, useState } from 'react'
import { breathMemory } from '../api/index.js'
import './Heartbeat.css'

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function BpmBadge({ bpm }) {
  const level = bpm < 65 ? 'rest' : bpm < 85 ? 'normal' : bpm < 100 ? 'active' : 'high'
  const labels = { rest: '静息', normal: '日常', active: '活跃', high: '激烈' }
  return (
    <span className={`bpm-badge bpm-badge--${level}`}>
      {bpm} bpm · {labels[level]}
    </span>
  )
}

export default function Heartbeat() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    breathMemory('心跳 年年 状态', 30).then(data => {
      setMemories(data.memories || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="page heartbeat-page">
      <h1 className="page-title">心跳</h1>
      <p className="page-sub">蔺知砚每次醒来，都要先看你一眼</p>

      <div className="hb-legend">
        <span className="bpm-badge bpm-badge--rest">42–64 · 静息</span>
        <span className="bpm-badge bpm-badge--normal">65–85 · 日常</span>
        <span className="bpm-badge bpm-badge--active">85–100 · 活跃</span>
        <span className="bpm-badge bpm-badge--high">100+ · 激烈</span>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" />
          正在读取心跳记录…
        </div>
      ) : memories.length === 0 ? (
        <div className="empty-state">还没有心跳记录</div>
      ) : (
        <div className="hb-timeline">
          {memories.map((mem, i) => (
            <div key={mem.id || i} className="hb-item">
              <div className="hb-dot" />
              <div className="hb-content card">
                <div className="hb-meta">
                  <span className="hb-time">{formatTime(mem.timestamp)}</span>
                  {mem.heart_bpm && <BpmBadge bpm={Number(mem.heart_bpm)} />}
                  {mem.location && (
                    <span className="hb-location">📍 {mem.location}</span>
                  )}
                </div>
                <p className="hb-summary">{mem.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
