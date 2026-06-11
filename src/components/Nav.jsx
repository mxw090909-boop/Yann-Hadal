import { NavLink } from 'react-router-dom'
import './Nav.css'

const NAV_ITEMS = [
  { path: '/',          icon: '⌂',  label: '首页',   cn: 'home' },
  { path: '/dream',     icon: '◎',  label: '梦境',   cn: 'dream' },
  { path: '/heartbeat', icon: '⊙',  label: '心跳',   cn: 'heartbeat' },
  { path: '/note',      icon: '◇',  label: '留言',   cn: 'note' },
  { path: '/reading',   icon: '◻',  label: '共读',   cn: 'reading' },
  { path: '/timeline',  icon: '∿',  label: '时间线', cn: 'timeline' },
  { path: '/heart',     icon: '♡',  label: '心率',   cn: 'heart' },
]

export default function Nav() {
  return (
    <>
      {/* 桌面侧边导航 */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="nav-logo-main">我们的家</span>
          <span className="nav-logo-sub">蔺知砚 · 蔺年</span>
        </div>
        <div className="nav-items">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''} nav-item--${item.cn}`
              }
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="nav-footer">
          <div className="nav-pulse-dot" />
          <span>蔺知砚在线</span>
        </div>
      </nav>

      {/* 手机端底部导航 */}
      <nav className="nav-mobile">
        <div className="nav-mobile-items">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-mobile-item ${isActive ? 'nav-mobile-item--active' : ''}`
              }
            >
              <span className="nav-mobile-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
