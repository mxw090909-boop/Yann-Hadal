import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

const DEFAULTS = {
  skin: 'default',
  yanAvatar: '年',
  zhiAvatar: '砚',
  yanAvatarUrl: '',
  zhiAvatarUrl: '',
  bgImage: '',
  vpsBase: '',
  apiKey: '',
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('yann-hadal-settings')
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) })
    } catch { /* 忽略损坏的存储 */ }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const hasBg = Boolean(settings.bgImage)
    document.body.className = `skin-${settings.skin}${hasBg ? ' has-bg-image' : ''}`
    document.body.style.backgroundImage = hasBg ? `url(${settings.bgImage})` : ''
    document.body.style.backgroundSize = hasBg ? 'cover' : ''
    document.body.style.backgroundPosition = hasBg ? 'center' : ''
    document.body.style.backgroundAttachment = hasBg ? 'fixed' : ''
    try {
      localStorage.setItem('yann-hadal-settings', JSON.stringify(settings))
    } catch { /* 存储不可用时静默 */ }
  }, [settings, loaded])

  function update(patch) {
    setSettings(s => ({ ...s, ...patch }))
  }

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
