import { useEffect, useState, useRef } from 'react'
import { fetchHeartHistory, MOCK_HEART_HISTORY, MOCK_HEARTBEAT_MEMORIES } from '../api/index.js'
import './HeartRate.css'

// 双线图：年年心率(红) + 蔺知砚心跳(蓝)
function DualChart({ heartEvents, heartbeatEvents }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const PAD = { top: 20, bottom: 32, left: 40, right: 16 }
    ctx.clearRect(0, 0, W, H)

    const allBpms = [
      ...heartEvents.map(e => Number(e.heart)),
      ...heartbeatEvents.map(e => Number(e.heart_bpm || 71))
    ]
    const minB = Math.max(40, Math.min(...allBpms) - 8)
    const maxB = Math.max(...allBpms) + 8
    const iW = W - PAD.left - PAD.right
    const iH = H - PAD.top - PAD.bottom

    function tx(i, total) { return PAD.left + (i / (total - 1)) * iW }
    function ty(b) { return PAD.top + iH - ((b - minB) / (maxB - minB)) * iH }

    // Y轴刻度
    ctx.fillStyle = 'rgba(120,119,116,0.6)'
    ctx.font = `10px -apple-system, sans-serif`
    ctx.textAlign = 'right'
    for (let b = Math.ceil(minB/10)*10; b <= maxB; b += 10) {
      const y = ty(b)
      ctx.fillText(b, PAD.left - 4, y + 3)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(233,233,231,0.8)'
      ctx.lineWidth = 1
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(W - PAD.right, y)
      ctx.stroke()
    }

    function drawLine(events, bpmKey, color, dotColor) {
      if (events.length < 2) return
      const bpms = events.map(e => Number(e[bpmKey] || 71))
      // 渐变填充
      const grad = ctx.createLinearGradient(0, PAD.top, 0, H - PAD.bottom)
      grad.addColorStop(0, color.replace(')', ',0.15)').replace('rgb', 'rgba'))
      grad.addColorStop(1, color.replace(')', ',0.00)').replace('rgb', 'rgba'))
      ctx.beginPath()
      ctx.moveTo(tx(0, bpms.length), ty(bpms[0]))
      bpms.forEach((b, i) => ctx.lineTo(tx(i, bpms.length), ty(b)))
      ctx.lineTo(tx(bpms.length-1, bpms.length), H-PAD.bottom)
      ctx.lineTo(tx(0, bpms.length), H-PAD.bottom)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()
      // 折线
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.8
      ctx.lineJoin = 'round'
      bpms.forEach((b,i) => i===0 ? ctx.moveTo(tx(i,bpms.length),ty(b)) : ctx.lineTo(tx(i,bpms.length),ty(b)))
      ctx.stroke()
      // 点
      bpms.forEach((b,i) => {
        ctx.beginPath()
        ctx.arc(tx(i,bpms.length), ty(b), 2.5, 0, Math.PI*2)
        ctx.fillStyle = dotColor
        ctx.fill()
      })
    }

    drawLine(heartEvents.slice().reverse(), 'heart', 'rgba(192,84,75,0.75)', 'rgba(192,84,75,0.9)')
    drawLine(heartbeatEvents.slice().reverse(), 'heart_bpm', 'rgba(81,112,190,0.70)', 'rgba(81,112,190,0.9)')

    // 时间标注
    const src = heartEvents.slice().reverse()
    ctx.fillStyle = 'rgba(172,171,168,0.9)'
    ctx.textAlign = 'center'
    const step = Math.ceil(src.length / 4)
    src.forEach((e, i) => {
      if (i % step === 0 || i === src.length-1) {
        const t = new Date(e.observed_at)
        ctx.fillText(`${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}`, tx(i, src.length), H-4)
      }
    })
  }, [heartEvents, heartbeatEvents])

  return <canvas ref={canvasRef} className="dual-chart" width={680} height={180} />
}

function BpmCard({ bpm, label, color, sublabel }) {
  return (
    <div className="bpm-card">
      <div className="bpm-card-num" style={{ color }}>{bpm}</div>
      <div className="bpm-card-info">
        <div className="bpm-card-label">{label}</div>
        <div className="bpm-card-sub">{sublabel}</div>
      </div>
      <div className="bpm-card-dot" style={{ background: color }} />
    </div>
  )
}

export default function HeartRate() {
  const [heartData, setHeartData] = useState(null)
  const [heartbeatData] = useState(MOCK_HEARTBEAT_MEMORIES)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().slice(0,10)

  useEffect(() => {
    fetchHeartHistory(today).then(res => {
      setHeartData(res)
      setLoading(false)
    })
  }, [today])

  const heartEvents = heartData?.events || MOCK_HEART_HISTORY.events
  const latestHeart = heartEvents[0] ? Number(heartEvents[0].heart) : 71
  const latestZhi   = heartbeatData[0] ? Number(heartbeatData[0].heart_bpm) : 71

  const heartLevel = latestHeart < 65 ? '静息' : latestHeart < 85 ? '日常' : latestHeart < 100 ? '活跃' : '激烈'
  const zhiLevel   = latestZhi < 65 ? '平静' : latestZhi < 85 ? '日常' : '波动'

  return (
    <div className="page heart-page">
      <h1 className="page-title">心率</h1>
      <p className="page-sub">两个人今天的状态</p>

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" style={{ background: 'var(--accent-pulse)' }} />
          读取中…
        </div>
      ) : (
        <>
          <div className="bpm-row">
            <BpmCard
              bpm={latestHeart}
              label="蔺年"
              color="var(--accent-pulse)"
              sublabel={heartLevel}
            />
            <div className="bpm-sep">·</div>
            <BpmCard
              bpm={latestZhi}
              label="蔺知砚"
              color="var(--accent-cool)"
              sublabel={zhiLevel}
            />
          </div>

          <div className="chart-legend">
            <span className="legend-dot" style={{ background: 'var(--accent-pulse)' }} />
            <span>蔺年</span>
            <span className="legend-dot" style={{ background: 'var(--accent-cool)', marginLeft: 12 }} />
            <span>蔺知砚</span>
          </div>

          <div className="card dual-chart-wrap">
            <div className="chart-title">今日对比</div>
            <DualChart heartEvents={heartEvents} heartbeatEvents={heartbeatData} />
          </div>

          <div className="heart-baselines card">
            <div className="heart-baseline-title">年年的基线</div>
            <div className="baselines-grid">
              {[['静息','42–64','cool'],['日常','65–85','green'],['活跃','85–100','warm'],['峰值','151','pulse']].map(([l,v,c]) => (
                <div key={l} className="baseline-item">
                  <span className={`tag tag-${c}`}>{l}</span>
                  <span className="baseline-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="heart-log card">
            <div className="heart-log-title">详细记录</div>
            {heartEvents.map((e, i) => {
              const t = new Date(e.observed_at)
              const bpm = Number(e.heart)
              const level = bpm<65?'rest':bpm<85?'normal':bpm<100?'active':'high'
              return (
                <div key={i} className="heart-log-row">
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
