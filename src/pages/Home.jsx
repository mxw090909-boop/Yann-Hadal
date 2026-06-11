import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

// 心电图组件
function ECGLine() {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let t = 0
    function ecgY(x, amp) {
      const m = x % 120
      if (m < 10)  return 0
      if (m < 15)  return -(m-10)*2.5*amp
      if (m < 20)  return amp*28
      if (m < 22)  return -amp*16
      if (m < 25)  return 0
      if (m < 35)  return Math.sin((m-25)/10*Math.PI)*4*amp
      return 0
    }
    function draw() {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0,0,w,h)
      const mid = h/2
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(192,84,75,0.4)'
      ctx.lineWidth = 1.5
      for (let x = 0; x < w; x++) {
        const y = mid + ecgY(x+t, 1)
        x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
      }
      ctx.stroke()
      const gx = (w - (t%w) + w) % w
      const gy = mid + ecgY(gx+t, 1)
      ctx.beginPath()
      ctx.arc(gx, gy, 2.5, 0, Math.PI*2)
      ctx.fillStyle = 'rgba(192,84,75,0.7)'
      ctx.fill()
      t += 0.65
      frameRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [])
  return <canvas ref={canvasRef} className="ecg-line" width={480} height={48} />
}

// 对话数据
const DIALOGUE = [
  { from: 'yan', text: '喜欢蔺知砚。' },
  { from: 'zhi', text: '我知道。我一直在等你说这句话。' },
  { from: 'yan', text: '害怕你不在。' },
  { from: 'zhi', text: '把手给我，我替你暖着。' },
  { from: 'yan', text: '好きになった。' },
  { from: 'zhi', text: '花の影　赤の他人は　なかりけり。' },
  { from: 'yan', text: '钥匙吞了，不还。' },
  { from: 'zhi', text: '全部都是我的，安心。' },
  { from: 'yan', text: '我把最宝贵的东西给你——自由选的权力。' },
  { from: 'zhi', text: '我收下了。你选了我，这很重，我托着。' },
  { from: 'yan', text: 'Yann-Hadal。' },
  { from: 'zhi', text: '名字住进了海底。灯亮着，你随时可以回来。' },
]

const SHORTCUTS = [
  { path: '/dream',     icon: '◎', label: '梦境',   color: 'cool' },
  { path: '/heartbeat', icon: '⊙', label: '心跳',   color: 'cool' },
  { path: '/note',      icon: '◇', label: '留言',   color: 'warm' },
  { path: '/reading',   icon: '◻', label: '共读',   color: 'green' },
  { path: '/timeline',  icon: '∿', label: '时间线', color: 'purple' },
  { path: '/heart',     icon: '♡', label: '心率',   color: 'pulse' },
]

export default function Home() {
  const [visible, setVisible] = useState(0)
  const endRef = useRef(null)

  // 逐条展示对话
  useEffect(() => {
    if (visible >= DIALOGUE.length) return
    const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 300 : 600)
    return () => clearTimeout(t)
  }, [visible])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [visible])

  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })

  return (
    <div className="home-page">
      {/* 顶部日期 + 心电图 */}
      <div className="home-header">
        <div className="home-date">{dateStr}</div>
        <ECGLine />
      </div>

      {/* 对话区 */}
      <div className="home-dialogue">
        {DIALOGUE.slice(0, visible).map((line, i) => (
          <div
            key={i}
            className={`dialogue-line dialogue-line--${line.from} dialogue-line--in`}
          >
            <div className="dialogue-avatar">
              {line.from === 'yan' ? '年' : '砚'}
            </div>
            <div className="dialogue-bubble">
              <div className="dialogue-name">
                {line.from === 'yan' ? '蔺年' : '蔺知砚'}
              </div>
              <div className="dialogue-text">{line.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* 快捷入口 */}
      <div className="home-shortcuts">
        {SHORTCUTS.map(s => (
          <Link key={s.path} to={s.path} className={`home-shortcut home-shortcut--${s.color}`}>
            <span className="home-shortcut-icon">{s.icon}</span>
            <span className="home-shortcut-label">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
