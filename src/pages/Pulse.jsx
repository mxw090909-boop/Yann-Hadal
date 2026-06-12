import { useEffect, useState, useRef } from 'react'
import { fetchHeartHistory, MOCK_HEART_HISTORY, MOCK_HEARTBEAT_MEMORIES } from '../api/index.js'
import './Pulse.css'

function DualChart({ heartEvents, heartbeatEvents }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const PAD = { top: 18, bottom: 26, left: 34, right: 14 }
    ctx.clearRect(0, 0, W, H)

    const allBpms = [
      ...heartEvents.map(e => Number(e.heart)),
      ...heartbeatEvents.map(e => Number(e.heart_bpm || 71)),
    ]
    const minB = Math.max(40, Math.min(...allBpms) - 8)
    const maxB = Math.max(...allBpms) + 8
    const iW = W - PAD.left - PAD.right
    const iH = H - PAD.top - PAD.bottom
    const tx = (i, n) => PAD.left + (i / Math.max(n-1,1)) * iW
    const ty = b => PAD.top + iH - ((b-minB)/(maxB-minB)) * iH

    for (let b = Math.ceil(minB/10)*10; b <= maxB; b += 10) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(233,233,231,0.9)'
      ctx.lineWidth = 1
      ctx.moveTo(PAD.left, ty(b)); ctx.lineTo(W-PAD.right, ty(b)); ctx.stroke()
      ctx.fillStyle = 'rgba(172,171,168,0.8)'
      ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right'
      ctx.fillText(b, PAD.left-4, ty(b)+3)
    }

    function drawLine(events, key, line, area, dot) {
      if (!events.length) return
      const bpms = events.map(e => Number(e[key] || 71))
      const grad = ctx.createLinearGradient(0, PAD.top, 0, H-PAD.bottom)
      grad.addColorStop(0, area); grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.moveTo(tx(0,bpms.length), ty(bpms[0]))
      bpms.forEach((b,i) => ctx.lineTo(tx(i,bpms.length), ty(b)))
      ctx.lineTo(tx(bpms.length-1,bpms.length), H-PAD.bottom)
      ctx.lineTo(tx(0,bpms.length), H-PAD.bottom)
      ctx.closePath(); ctx.fillStyle = grad; ctx.fill()
      ctx.beginPath()
      ctx.strokeStyle = line; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'
      bpms.forEach((b,i) => i===0 ? ctx.moveTo(tx(i,bpms.length),ty(b)) : ctx.lineTo(tx(i,bpms.length),ty(b)))
      ctx.stroke()
      bpms.forEach((b,i) => {
        ctx.beginPath(); ctx.arc(tx(i,bpms.length),ty(b),2.4,0,Math.PI*2)
        ctx.fillStyle = dot; ctx.fill()
      })
    }

    drawLine(heartEvents.slice().reverse(), 'heart',
      'rgba(192,84,75,0.75)', 'rgba(192,84,75,0.12)', 'rgba(192,84,75,0.9)')
    drawLine(heartbeatEvents.slice().reverse(), 'heart_bpm',
      'rgba(81,112,190,0.70)', 'rgba(81,112,190,0.10)', 'rgba(81,112,190,0.9)')

    const src = heartEvents.slice().reverse()
    ctx.fillStyle = 'rgba(172,171,168,0.85)'; ctx.textAlign = 'center'
    const step = Math.ceil(src.length / 4)
    src.forEach((e,i) => {
      if (i % step === 0 || i === src.length-1) {
        const t = new Date(e.observed_at)
        ctx.fillText(`${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}`, tx(i,src.length), H-4)
      }
    })
  }, [heartEvents, heartbeatEvents])

  return <canvas ref={canvasRef} className="pulse-chart" width={680} height={150} />
}

export default function Pulse() {
  const [heartData, setHeartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0,10)

  useEffect(() => {
    fetchHeartHistory(today).then(res => { setHeartData(res); setLoading(false) })
  }, [today])

  const heartEvents   = heartData?.events || MOCK_HEART_HISTORY.events
  const heartbeatMems = MOCK_HEARTBEAT_MEMORIES
  const latestYan = Number(heartEvents[0]?.heart || 71)
  const latestZhi = Number(heartbeatMems[0]?.heart_bpm || 71)
  const yanLabel  = latestYan < 65 ? '静息' : latestYan < 85 ? '日常' : latestYan < 100 ? '活跃' : '激烈'
  const zhiLabel  = latestZhi < 65 ? '平静' : latestZhi < 85 ? '日常' : '波动'

  // ─── 织时间线：两种事件混排 ───
  const merged = [
    ...heartEvents.map(e => ({
      kind: 'yan',
      ts: e.observed_at,
      bpm: Number(e.heart),
      app: e.app,
      location: (e.location || '').split('\n')[1] || e.location,
    })),
    ...heartbeatMems.map(m => ({
      kind: 'zhi',
      ts: m.timestamp,
      bpm: m.heart_bpm ? Number(m.heart_bpm) : null,
      text: m.summary,
      location: m.location,
    })),
  ].sort((a, b) => new Date(b.ts) - new Date(a.ts))

  return (
    <div className="page pulse-page">
      <h1 className="page-title">心跳</h1>
      <p className="page-sub">两颗心，一条时间线</p>

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" style={{ background: 'var(--accent-pulse)' }} />
          读取中…
        </div>
      ) : (
        <>
          {/* 两颗心 */}
          <div className="card hearts-card">
            <div className="hearts-row">
              <div className="heart-side">
                <div className="heart-num" style={{ color: 'var(--accent-pulse)' }}>{latestYan}</div>
                <div className="heart-unit">bpm</div>
                <div className="heart-name">蔺年</div>
                <span className="tag tag-pulse">{yanLabel}</span>
              </div>
              <div className="hearts-center">
                <div className="hearts-divider-line" />
                <div className="hearts-icon">♡</div>
                <div className="hearts-divider-line" />
              </div>
              <div className="heart-side">
                <div className="heart-num" style={{ color: 'var(--accent-cool)' }}>{latestZhi}</div>
                <div className="heart-unit">bpm</div>
                <div className="heart-name">蔺知砚</div>
                <span className="tag tag-cool">{zhiLabel}</span>
              </div>
            </div>
            <div className="pulse-legend">
              <span className="legend-dot" style={{ background: 'var(--accent-pulse)' }} />
              <span>蔺年</span>
              <span className="legend-dot" style={{ background: 'var(--accent-cool)', marginLeft: 14 }} />
              <span>蔺知砚</span>
            </div>
            <DualChart heartEvents={heartEvents} heartbeatEvents={heartbeatMems} />
          </div>

          {/* 共用时间线 */}
          <div className="pulse-timeline">
            <div className="pulse-timeline-title">今天，交错的痕迹</div>
            {merged.map((item, i) => {
              const t = new Date(item.ts)
              const timeStr = `${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}`
              return (
                <div key={i} className={`pt-item pt-item--${item.kind}`}>
                  <div className="pt-spine">
                    <div className={`pt-dot pt-dot--${item.kind}`} />
                    {i < merged.length - 1 && <div className="pt-line" />}
                  </div>
                  <div className="pt-body">
                    <div className="pt-meta">
                      <span className="pt-time">{timeStr}</span>
                      <span className={`pt-who pt-who--${item.kind}`}>
                        {item.kind === 'yan' ? '蔺年' : '蔺知砚'}
                      </span>
                      {item.bpm && (
                        <span className={`pt-bpm pt-bpm--${item.kind}`}>{item.bpm} bpm</span>
                      )}
                    </div>
                    {item.kind === 'yan' ? (
                      <div className="pt-text pt-text--data">
                        {item.app && <span>在用 {item.app}</span>}
                        {item.location && <span className="pt-loc"> · {item.location}</span>}
                      </div>
                    ) : (
                      <div className="pt-text">{item.text}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
