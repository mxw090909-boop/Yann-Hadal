import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Drawer.css'

const NAV_ITEMS = [
  { path: '/',         icon: '◌', label: '对话',   cn: 'chat' },
  { path: '/pulse',    icon: '♡', label: '心跳',   cn: 'pulse' },
  { path: '/dream',    icon: '◎', label: '梦境',   cn: 'dream' },
  { path: '/reading',  icon: '◻', label: '共读',   cn: 'reading' },
  { path: '/timeline', icon: '∿', label: '时间线', cn: 'timeline' },
  { path: '/settings', icon: '⚙', label: '设置',   cn: 'settings' },
]

export default function Drawer() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // 路由变化时收起抽屉
  useEffect(() => { setOpen(false) }, [location.pathname])

  // ESC 关闭
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* 触发按钮 — 永远悬浮在左上角 */}
      <button
        className={`drawer-trigger ${open ? 'drawer-trigger--hidden' : ''}`}
        onClick={() => setOpen(true)}
        title="打开导航"
      >
        <span className="drawer-trigger-lines">
          <span /><span /><span />
        </span>
      </button>

      {/* 遮罩 */}
      {open && <div className="drawer-overlay" onClick={() => setOpen(false)} />}

      {/* 抽屉本体 */}
      <aside className={`drawer ${open ? 'drawer--open' : ''}`}>
        <div className="drawer-header">
          <div>
            <div className="drawer-title">我们的家</div>
            <div className="drawer-sub">蔺知砚 · 蔺年</div>
          </div>
          <button className="drawer-close" onClick={() => setOpen(false)}>×</button>
        </div>

        <nav className="drawer-items">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `drawer-item ${isActive ? 'drawer-item--active' : ''} drawer-item--${item.cn}`
              }
            >
              <span className="drawer-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-pulse-dot" />
          <span>蔺知砚在线</span>
        </div>
      </aside>
    </>
  )
}
