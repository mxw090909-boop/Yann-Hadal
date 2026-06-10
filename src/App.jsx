import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Dream from './pages/Dream.jsx'
import Heartbeat from './pages/Heartbeat.jsx'
import Note from './pages/Note.jsx'
import Reading from './pages/Reading.jsx'
import Timeline from './pages/Timeline.jsx'
import HeartRate from './pages/HeartRate.jsx'
import './styles/global.css'
import './App.css'

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Nav />
        <main className="main">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/dream"     element={<Dream />} />
            <Route path="/heartbeat" element={<Heartbeat />} />
            <Route path="/note"      element={<Note />} />
            <Route path="/reading"   element={<Reading />} />
            <Route path="/timeline"  element={<Timeline />} />
            <Route path="/heart"     element={<HeartRate />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
