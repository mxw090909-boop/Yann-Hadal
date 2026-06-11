import { useState, useEffect } from 'react'
import './BgPicker.css'

const SKINS = [
  { id: 'default', label: '纸白',  color: '#FFFFFF' },
  { id: 'cream',   label: '奶油',  color: '#FAF8F3' },
  { id: 'ocean',   label: '海色',  color: '#EFF4F8' },
  { id: 'dusk',    label: '黄昏',  color: '#F5F0EA' },
  { id: 'deep',    label: '深海',  color: '#0F1524' },
]

export default function BgPicker() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('default')

  useEffect(() => {
    const saved = localStorage.getItem('yann-hadal-skin') || 'default'
    setCurrent(saved)
    document.body.className = `skin-${saved}`
  }, [])

  function pick(id) {
    setCurrent(id)
    document.body.className = `skin-${id}`
    localStorage.setItem('yann-hadal-skin', id)
    setOpen(false)
  }

  return (
    <div className="bg-picker">
      <button
        className="bg-picker-btn"
        onClick={() => setOpen(o => !o)}
        title="更换背景"
      >
        ◈
      </button>
      {open && (
        <div className="bg-picker-panel">
          <div className="bg-picker-title">背景</div>
          <div className="bg-picker-swatches">
            {SKINS.map(s => (
              <button
                key={s.id}
                className={`bg-picker-swatch ${current === s.id ? 'bg-picker-swatch--active' : ''}`}
                style={{ background: s.color }}
                onClick={() => pick(s.id)}
                title={s.label}
              >
                {current === s.id && <span className="bg-picker-check">✓</span>}
              </button>
            ))}
          </div>
          <div className="bg-picker-labels">
            {SKINS.map(s => (
              <span key={s.id} className="bg-picker-label">{s.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
