import { useState } from 'react'
import { useSettings } from '../components/SettingsContext.jsx'
import './Settings.css'

const SKINS = [
  { id: 'default', label: '纸白', color: '#FFFFFF' },
  { id: 'cream',   label: '奶油', color: '#FAF8F3' },
  { id: 'ocean',   label: '海色', color: '#EFF4F8' },
  { id: 'dusk',    label: '黄昏', color: '#F5F0EA' },
  { id: 'deep',    label: '深海', color: '#0F1524' },
]

export default function Settings() {
  const { settings, update } = useSettings()
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [draft, setDraft] = useState({
    vpsBase: settings.vpsBase,
    apiKey: settings.apiKey,
    yanAvatar: settings.yanAvatar,
    zhiAvatar: settings.zhiAvatar,
  })

  function saveConnection() {
    update({
      vpsBase: draft.vpsBase.trim(),
      apiKey: draft.apiKey.trim(),
      yanAvatar: draft.yanAvatar.trim() || '年',
      zhiAvatar: draft.zhiAvatar.trim() || '砚',
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function clearChat() {
    if (confirm('清空本地对话记录？开篇的那几句也会回到初始状态。')) {
      localStorage.removeItem('yann-hadal-chat')
      location.reload()
    }
  }

  return (
    <div className="page settings-page">
      <h1 className="page-title">设置</h1>
      <p className="page-sub">这个家的钥匙抽屉</p>

      {/* 背景 */}
      <section className="card settings-section">
        <div className="settings-section-title">背景</div>
        <div className="skin-row">
          {SKINS.map(s => (
            <button
              key={s.id}
              className={`skin-swatch ${settings.skin === s.id ? 'skin-swatch--active' : ''}`}
              style={{ background: s.color }}
              onClick={() => update({ skin: s.id })}
              title={s.label}
            >
              {settings.skin === s.id && <span className="skin-check">✓</span>}
            </button>
          ))}
        </div>
        <div className="skin-labels">
          {SKINS.map(s => <span key={s.id} className="skin-label">{s.label}</span>)}
        </div>
      </section>

      {/* 头像 */}
      <section className="card settings-section">
        <div className="settings-section-title">头像字符</div>
        <p className="settings-hint">对话气泡旁边的小圆圈里显示的字，一到两个字符。</p>
        <div className="settings-grid">
          <label className="settings-field">
            <span className="settings-label">蔺年</span>
            <input
              className="settings-input settings-input--short"
              value={draft.yanAvatar}
              maxLength={2}
              onChange={e => setDraft(d => ({ ...d, yanAvatar: e.target.value }))}
            />
          </label>
          <label className="settings-field">
            <span className="settings-label">蔺知砚</span>
            <input
              className="settings-input settings-input--short"
              value={draft.zhiAvatar}
              maxLength={2}
              onChange={e => setDraft(d => ({ ...d, zhiAvatar: e.target.value }))}
            />
          </label>
        </div>
      </section>

      {/* 连接 */}
      <section className="card settings-section">
        <div className="settings-section-title">VPS 连接</div>
        <p className="settings-hint">
          地址和密钥只存在这台设备的浏览器里，不会进代码仓库，不会被上传到任何地方。
          填好之后，对话页就能直接连到蔺知砚。
        </p>
        <label className="settings-field">
          <span className="settings-label">VPS 地址</span>
          <input
            className="settings-input"
            placeholder="https://…"
            value={draft.vpsBase}
            onChange={e => setDraft(d => ({ ...d, vpsBase: e.target.value }))}
          />
        </label>
        <label className="settings-field">
          <span className="settings-label">密钥</span>
          <div className="settings-key-row">
            <input
              className="settings-input"
              type={showKey ? 'text' : 'password'}
              placeholder="Bearer token"
              value={draft.apiKey}
              onChange={e => setDraft(d => ({ ...d, apiKey: e.target.value }))}
            />
            <button className="settings-eye" onClick={() => setShowKey(s => !s)}>
              {showKey ? '隐藏' : '显示'}
            </button>
          </div>
        </label>
      </section>

      {/* 保存 */}
      <div className="settings-actions">
        <button className="settings-save" onClick={saveConnection}>
          {saved ? '已保存 ✓' : '保存设置'}
        </button>
        <button className="settings-danger" onClick={clearChat}>
          清空对话记录
        </button>
      </div>

      <p className="settings-foot">
        Yann-Hadal · 名字住在海底，灯亮着
      </p>
    </div>
  )
}
