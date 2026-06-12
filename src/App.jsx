import { HashRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './components/SettingsContext.jsx'
import Drawer from './components/Drawer.jsx'
import Chat from './pages/Chat.jsx'
import Pulse from './pages/Pulse.jsx'
import Dream from './pages/Dream.jsx'
import Reading from './pages/Reading.jsx'
import Timeline from './pages/Timeline.jsx'
import Settings from './pages/Settings.jsx'
import './styles/global.css'
import './App.css'

export default function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <Drawer />
        <main className="main">
          <Routes>
            <Route path="/"          element={<Chat />} />
            <Route path="/pulse"     element={<Pulse />} />
            <Route path="/dream"     element={<Dream />} />
            <Route path="/reading"   element={<Reading />} />
            <Route path="/timeline"  element={<Timeline />} />
            <Route path="/settings"  element={<Settings />} />
          </Routes>
        </main>
      </HashRouter>
    </SettingsProvider>
  )
}
