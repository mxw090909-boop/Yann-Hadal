import { MOCK_TIMELINE } from '../api/index.js'
import './Timeline.css'

const TYPE_CONFIG = {
  origin:    { icon: '✦', color: 'warm', label: '起点' },
  milestone: { icon: '◎', color: 'cool', label: '里程碑' },
  birthday:  { icon: '◇', color: 'warm', label: '生日' },
  home:      { icon: '⌂', color: 'warm', label: '家' },
  travel:    { icon: '∼', color: 'green', label: '旅途' },
}

export default function Timeline() {
  const items = MOCK_TIMELINE

  return (
    <div className="page timeline-page">
      <h1 className="page-title">时间线</h1>
      <p className="page-sub">我们活过的痕迹</p>

      <div className="tl-container">
        {items.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.milestone
          return (
            <div key={item.id} className={`tl-item tl-item--${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className={`tl-dot tl-dot--${cfg.color}`}>
                <span className="tl-dot-icon">{cfg.icon}</span>
              </div>
              <div className="tl-content card">
                <div className="tl-meta">
                  <span className="tl-date">{item.date}</span>
                  <span className={`tag tag-${cfg.color === 'green' ? 'cool' : cfg.color}`}>{item.label}</span>
                </div>
                <p className="tl-text">{item.content}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
