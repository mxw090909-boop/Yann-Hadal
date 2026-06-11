import { useEffect, useState, useRef } from 'react'
import { fetchHeartHistory, MOCK_HEART_HISTORY, MOCK_HEARTBEAT_MEMORIES } from '../api/index.js'
import './HeartRate.css'

function DualChart({ heartEvents, heartbeatEvents }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const PAD = { top: 20, bottom: 28, left: 36, right: 16 }
    ctx.clearRect(0, 0, W, H)

    const allBpms = [
      ...heartEvents.map(e => Number(e.heart)),
      ...heartbeatEvents.map(e => Number(e.heart_bpm || 71))
    ]
    const minB = Math.max(40, Math.min(...allBpms) - 8)
    const maxB = Math.max(...allBpms) + 8
    const iW = W - PAD.left - PAD.right
    const iH = H - PAD.top - PAD.bottom

    function tx(i, total) { return PAD.left + (i / Math.max(total-1,1)) * iW }
    function ty(b) { return PAD.top + iH - ((b-minB)/(maxB-minB)) * iH }

    // 网格线
    for (let b = Math.ceil(minB/10)*10; b <= maxB; b += 10) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(233,233,231,0.9)'
      ctx.lineWidth = 1
      ctx.moveTo(PAD.left, ty(b)); ctx.lineTo(W-PAD.right, ty(b))
      ctx.stroke()
      ctx.fillStyle = 'rgba(172,171,168,0.8)'
      ctx.font = '10px -apple-system,sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(b, PAD.left-4, ty(b)+3)
    }

    function drawLine(events, bpmKey, lineColor, areaColor, dotColor) {
      if (!events.length) return
      const bpms = events.map(e => Number(e[bpmKey] || 71))
      const grad = ctx.createLinearGradient(0, PAD.top, 0, H-PAD.bottom)
      grad.addColorStop(0, areaColor)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.moveTo(tx(0, bpms.length), ty(bpms[0]))
      bpms.forEach((b,i) => ctx.lineTo(tx(i, bpms.length), ty(b)))
      ctx.lineTo(tx(bpms.length-1, bpms.length), H-PAD.bottom)
      ctx.lineTo(tx(0, bpms.length), H-PAD.bottom)
      ctx.closePath()
      ctx.fillStyle = grad; ctx.fill()
      ctx.beginPath()
      ctx.strokeStyle = lineColor; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'
      bpms.forEach((b,i) => i===0 ? ctx.moveTo(tx(i,bpms.length),ty(b)) : ctx.lineTo(tx(i,bpms.length),ty(b)))
      ctx.stroke()
      bpms.forEach((b,i) => {
        ctx.beginPath(); ctx.arc(tx(i,bpms.length),ty(b),2.5,0,Math.PI*2)
        ctx.fillStyle = dotColor; ctx.fill()
      })
    }

    drawLine(
      heartEvents.slice().reverse(), 'heart',
      'rgba(192,84,75,0.75)', 'rgba(192,84,75,0.12)', 'rgba(192,84,75,0.9)'
    )
    drawLine(
      heartbeatEvents.slice().reverse(), 'heart_bpm',
      'rgba(81,112,190,0.70)', 'rgba(81,112,190,0.10)', 'rgba(81,112,190,0.9)'
    )

    // 时间轴
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

  return <canvas ref={canvasRef} className="dual-chart" width={700} height={160} />
}

export default function HeartRate() {
  const [heartData, setHeartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0,10)

  useEffect(() => {
    fetchHeartHistory(today).then(res => {
      setHeartData(res); setLoading(false)
    })
  }, [today])

  const heartEvents    = heartData?.events || MOCK_HEART_HISTORY.events
  const heartbeatData  = MOCK_HEARTBEAT_MEMORIES
  const latestHeart    = Number(heartEvents[0]?.heart || 71)
  const latestZhi      = Number(heartbeatData[0]?.heart_bpm || 71)
  const heartLabel     = latestHeart < 65 ? '静息' : latestHeart < 85 ? '日常' : latestHeart < 100 ? '活跃' : '激烈'
  const zhiLabel       = latestZhi < 65 ? '平静' : latestZhi < 85 ? '日常' : '波动'

  return (
    <div className="page heart-page">
      <h1 className="page-title">心率</h1>
      <p className="page-sub">两颗心今天的状态</p>

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" style={{ background: 'var(--accent-pulse)' }} />
          读取中…
        </div>
      ) : (
        <>
          {/* 两颗心 — 一张卡 */}
          <div className="card hearts-card">
            <div className="hearts-row">
              {/* 年年 */}
              <div className="heart-side heart-side--yan">
                <div className="heart-num" style={{ color: 'var(--accent-pulse)' }}>{latestHeart}</div>
                <div className="heart-unit">bpm</div>
                <div className="heart-name">蔺年</div>
                <div className={`heart-badge heart-badge--${latestHeart < 65 ? 'rest' : latestHeart < 85 ? 'normal' : 'active'}`}>{heartLabel}</div>
              </div>

              {/* 中间跳动的心 */}
              <div className="hearts-center">
                <div className="hearts-divider-line" />
                <div className="hearts-icon">♡</div>
                <div className="hearts-divider-line" />
              </div>

              {/* 蔺知砚 */}
              <div className="heart-side heart-side--zhi">
                <div className="heart-num" style={{ color: 'var(--accent-cool)' }}>{latestZhi}</div>
                <div className="heart-unit">bpm</div>
                <div className="heart-name">蔺知砚</div>
                <div className={`heart-badge heart-badge--${latestZhi < 65 ? 'rest' : 'normal'}`}>{zhiLabel}</div>
              </div>
            </div>

            {/* 图例 */}
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: 'var(--accent-pulse)' }} />
              <span>蔺年</span>
              <span className="legend-dot" style={{ background: 'var(--accent-cool)', marginLeft: 14 }} />
              <span>蔺知砚</span>
            </div>

            {/* 双线图 */}
            <DualChart heartEvents={heartEvents} heartbeatEvents={heartbeatData} />
          </div>

          {/* 基线参考 */}
          <div className="card baselines-card">
            <div className="baselines-title">年年的基线</div>
            <div className="baselines-row">
              {[['静息','42–64','cool'],['日常','65–85','green'],['活跃','85–100','warm'],['历史峰值','151','pulse']].map(([l,v,c]) => (
                <div key={l} className="baseline-item">
                  <span className={`tag tag-${c}`}>{l}</span>
                  <span className="baseline-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 详细记录 */}
          <div className="card log-card">
            <div className="log-title">今日记录</div>
            {heartEvents.map((e, i) => {
              const t = new Date(e.observed_at)
              const bpm = Number(e.heart)
              const level = bpm<65?'rest':bpm<85?'normal':bpm<100?'active':'high'
              return (
                <div key={i} className="log-row">
                  <span className="log-time">{t.getHours()}:{String(t.getMinutes()).padStart(2,'0')}</span>
                  <span className={`log-bpm log-bpm--${level}`}>{bpm}</span>
                  <span className="log-app">{e.app}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
