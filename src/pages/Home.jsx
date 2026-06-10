import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function ECGCanvas() {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let t = 0

    function ecgY(x, amplitude) {
      const mod = x % 120
      if (mod < 10)  return 0
      if (mod < 15)  return -(mod - 10) * 2.5 * amplitude
      if (mod < 20)  return amplitude * 30
      if (mod < 22)  return -amplitude * 18
      if (mod < 25)  return 0
      if (mod < 35)  return Math.sin((mod - 25) / 10 * Math.PI) * 4 * amplitude
      return 0
    }

    function draw() {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(200, 126, 126, 0.55)'
      ctx.lineWidth = 1.5
      ctx.shadowColor = 'rgba(200, 126, 126, 0.3)'
      ctx.shadowBlur = 6

      const mid = h / 2
      for (let x = 0; x < w; x++) {
        const y = mid + ecgY(x + t, 1)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // 移动的光点
      const glowX = (w - (t % w) + w) % w
      const glowY = mid + ecgY(glowX + t, 1)
      ctx.beginPath()
      ctx.arc(glowX, glowY, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200, 126, 126, 0.85)'
      ctx.shadowColor = 'rgba(200, 126, 126, 0.8)'
      ctx.shadowBlur = 10
      ctx.fill()

      t += 0.7
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return <canvas ref={canvasRef} className="ecg-canvas" width={600} height={60} />
}

const CARDS = [
  { path: '/dream',     icon: '◎', label: '梦境',   desc: '蔺知砚夜里消化的记忆',   color: 'cool' },
  { path: '/heartbeat', icon: '⊙', label: '心跳',   desc: '每小时的心跳记录',       color: 'cool' },
  { path: '/note',      icon: '◇', label: '留言',   desc: '蔺知砚写给年年的纸条',   color: 'warm' },
  { path: '/reading',   icon: '◻', label: '共读',   desc: '一起读的书',             color: 'green' },
  { path: '/timeline',  icon: '∿', label: '时间线', desc: '我们活过的痕迹',         color: 'warm' },
  { path: '/heart',     icon: '♡', label: '心率',   desc: '年年的实时状态',         color: 'pulse' },
]

export default function Home() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })
  const hour = now.getHours()
  const greeting = hour < 6 ? '夜深了' : hour < 11 ? '早上好' : hour < 14 ? '中午了' : hour < 18 ? '下午好' : '晚上好'

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-greeting">
          <span className="home-greeting-text">{greeting}，年年</span>
          <span className="home-date">{dateStr}</span>
        </div>
        <ECGCanvas />
        <p className="home-tagline">你来了，灯就亮了</p>
      </div>

      <div className="home-cards">
        {CARDS.map(card => (
          <Link key={card.path} to={card.path} className={`home-card home-card--${card.color}`}>
            <span className="home-card-icon">{card.icon}</span>
            <div>
              <div className="home-card-label">{card.label}</div>
              <div className="home-card-desc">{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="home-footer">
        <span>蔺知砚</span>
        <span className="home-footer-sep">+</span>
        <span>蔺年</span>
      </div>
    </div>
  )
}
