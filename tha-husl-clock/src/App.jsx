import { useEffect, useState } from 'react'
import './App.css'
import HuslTimer from './HuslTimer.jsx'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isBibleTickerOpen, setIsBibleTickerOpen] = useState(true)

  useEffect(() => {
    if (!isChatOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsChatOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isChatOpen])

  return (
    <main className="phone-viewport">
      <div className="timer-container">
        <header className="hud-header">
          <h1>Tha' Hus'L Clock.</h1>
          <div className="academy-separator-break" aria-hidden="true"><br /></div>
          <div className="academy-separator" aria-hidden="true" />
        
          <button
            className="bible-ticker-button"
            type="button"
            aria-controls="bible-ticker"
            aria-expanded={isBibleTickerOpen}
            onClick={() => setIsBibleTickerOpen((open) => !open)}
          >
            BIBLE
          </button>
          <div
            className="bible-ticker"
            id="bible-ticker"
            aria-label="Bible ticker, King James Version"
            hidden={!isBibleTickerOpen}
          >
            <div className="bible-ticker-track">
              <span>
                “The Lord is my shepherd; I shall not want.” — Psalm 23:1 (KJV)
              </span>
              <span aria-hidden="true">
                “The Lord is my shepherd; I shall not want.” — Psalm 23:1 (KJV)
              </span>
            </div>
          </div>
         

        {/* Top Action Navbar for Menu, Hus'L Log, and Punch In */}
        <nav className="top-nav-bar" aria-label="Main Navigation">
          <button className="top-nav-btn" aria-label="Open Menu">
            <span className="material-symbols-outlined">menu</span>
            <span className="nav-btn-text">MENU</span>
          </button>

          <button className="top-nav-btn" aria-label="Open Husl Log">
            <span className="material-symbols-outlined">book_2</span>
            <span className="nav-btn-text">Hus'L log</span>
          </button>

          <button className="top-nav-btn punch-in-btn" aria-label="Punch In">
            <span className="material-symbols-outlined">badge</span>
            <span className="nav-btn-text">Punch In</span>
          </button>
        </nav>
        </header>
        <HuslTimer />
      </div>
      <footer className="phone-footer">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v5M10 6.2v.2" />
        </svg>
        <span>Hus&apos;L Verse.io all rights reserved 2026.</span>
      </footer>
      <div
        className="prophecii-dismiss-backdrop"
        aria-hidden="true"
        hidden={!isChatOpen}
        onClick={() => setIsChatOpen(false)}
      />
      <aside
        id="prophecii-chat-popup"
        className="prophecii-chat-popup"
        aria-labelledby="prophecii-chat-message"
        hidden={!isChatOpen}
      >
        <button
          className="prophecii-chat-close"
          type="button"
          aria-label="Close assistant message"
          onClick={() => setIsChatOpen(false)}
        >
          &times;
        </button>
        <p id="prophecii-chat-message">
          Hi! I am Prophecii, your Hus&apos;L Verse assistant, more features coming soon.
        </p>
      </aside>
      <button
        className="prophecii-chat-button"
        type="button"
        aria-label="Open Prophecii assistant"
        aria-controls="prophecii-chat-popup"
        aria-expanded={isChatOpen}
        onClick={() => setIsChatOpen((open) => !open)}
      >
        <img src="/prophecii_bubble.png" alt="" />
      </button>
    </main>
  )
}

export default App
