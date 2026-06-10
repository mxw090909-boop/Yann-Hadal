import { useEffect, useState, useRef } from 'react'
import { fetchHeartHistory, MOCK_HEART_HISTORY } from '../api/index.js'
import './HeartRate.css'

function HeartChart({ events }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !events.length) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const PAD = { top: 16, bottom: 28, left: 32, right: 16 }

    ctx.clearRect(0, 0, W, H)

    const bpms = events.map(e => Number(e.heart))
    const minBpm = Math.max(40, Math.min(...bpms) - 8)
    const maxBpm = Math.max(...bpms) + 8

    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    function tx(i) { return PAD.left + (i / (events.length - 1)) * innerW }
    function ty(bpm) { return PAD.top + innerH - ((bpm - minBpm) / (maxBpm - minBpm)) * innerH }

    // 渐变区域
    const grad = ctx.createLinearGradient(0, PAD.top, 0, H - PAD.bottom)
    grad.addColorStop(0, 'rgba(200,126,126,0.20)')
    grad.addColorStop(1, 'rgba(200,126,126,0.00)')
    ctx.beginPath()
    ctx.moveTo(tx(0), ty(bpms[0]))
    bpms.forEach((b, i) => ctx.lineTo(tx(i), ty(b)))
    ctx.lineTo(tx(bpms.length - 1), H - PAD.bottom)
    ctx.lineTo(tx(0), H - PAD.bottom)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // 折线
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(200,126,126,0.75)'
    ctx.lineWidth = 1.8
    ctx.lineJoin = 'round'
    bpms.forEach((b, i) => {
      if (i === 0) ctx.moveTo(tx(i), ty(b))
      else ctx.lineTo(tx(i), ty(b))
    })
    ctx.stroke()

    // 时间标注
    ctx.fillStyle = 'rgba(90,86,104,0.9)'
    ctx.font = `10px -apple-system, sans-serif`
    ctx.textAlign = 'center'
    const step = Math.ceil(events.length / 4)
    events.forEach((e, i) => {
      if (i % step === 0 || i === events.length - 1) {
        const t = new Date(e.observed_at)
        const label = `${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}`
        ctx.fillText(label, tx(i), H - 4)
      }
    })

    // BPM点
    bpms.forEach((b, i) => {
      ctx.beginPath()
      ctx.arc(tx(i), ty(b), 2.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,126,126,0.85)'
      ctx.fill()
    })
  }, [events])

  return (
    <canvas
      ref={canvasRef}
      className="heart-chart"
      width={680}
      height={150}
    />
  )
}

function BpmNow({ bpm }) {
  const level = bpm < 65 ? '静息' : bpm < 85 ? '日常' : bpm < 100 ? '活跃' : '激烈'
  return (
    <div className="bpm-now">
      <span className="bpm-now-num">{bpm}</span>
      <div>
        <div className="bpm-now-unit">bpm</div>
        <div className="bpm-now-level">{level}</div>
      </div>
      <div className="bpm-now-pulse" />
    </div>
  )
}

export default function HeartRate() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    fetchHeartHistory(today).then(res => {
      setData(res)
      setLoading(false)
    })
  }, [today])

  const events = (data?.events || []).slice().reverse() // 时间升序给图表
  const latest = data?.events?.[0]
  const latestBpm = latest ? Number(latest.heart) : null

  return (
    <div className="page heart-page">
      <h1 className="page-title">心率</h1>
      <p className="page-sub">年年今天的状态</p>

      {loading ? (
        <div className="loading-state">
          <div className="dot-pulse" style={{ background: 'var(--accent-pulse)' }} />
          正在读取心率数据…
        </div>
      ) : (
        <>
          {latestBpm && (
            <div className="heart-header">
              <BpmNow bpm={latestBpm} />
              <div className="heart-header-detail">
                <div className="heart-baseline-row">
                  <span className="heart-baseline-label">静息基线</span>
                  <span className="heart-baseline-val">42 – 64</span>
                </div>
                <div className="heart-baseline-row">
                  <span className="heart-baseline-label">日常范围</span>
                  <span className="heart-baseline-val">65 – 85</span>
                </div>
                <div className="heart-baseline-row">
                  <span className="heart-baseline-label">历史峰值</span>
                  <span className="heart-baseline-val" style={{ color: 'var(--accent-pulse)' }}>151</span>
                </div>
              </div>
            </div>
          )}

          {events.length > 1 && (
            <div className="heart-chart-wrap card">
              <div className="heart-chart-title">今日心率趋势</div>
              <HeartChart events={events} />
            </div>
          )}

          <div className="heart-log">
            <div className="heart-log-title">记录详情</div>
            {data?.events?.map((e, i) => {
              const t = new Date(e.observed_at)
              const timeStr = t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
              const bpm = Number(e.heart)
              const level = bpm < 65 ? 'rest' : bpm < 85 ? 'normal' : bpm < 100 ? 'active' : 'high'
              return (
                <div key={i} className="heart-log-row">
                  <span className="heart-log-time">{timeStr}</span>
                  <span className={`heart-log-bpm heart-log-bpm--${level}`}>{bpm}</span>
                  <span className="heart-log-app">{e.app}</span>
                  <span className="heart-log-loc">{e.location?.split('\n')[2] || e.location}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
