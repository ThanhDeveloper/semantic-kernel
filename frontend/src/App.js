import { useState } from 'react';
import ChatWidget from './components/ChatWidget/ChatWidget';
import './App.css';

function HeartPulseIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M4 17h5l2.25-5 4.25 10 2.4-5H28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      <path d="M16 28S5 21.7 5 12.4A6.2 6.2 0 0 1 16 8.2a6.2 6.2 0 0 1 11 4.2C27 21.7 16 28 16 28Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

function App() {
  const [chatOpenSignal, setChatOpenSignal] = useState(0);

  const openConversation = () => {
    setChatOpenSignal((signal) => signal + 1);
  };

  return (
    <main className="portal-shell">
      <div
        className="hero-image"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/healthcare.png)` }}
        aria-hidden="true"
      />
      <div className="hero-tint" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#portal" aria-label="Cura Health home">
          <span className="brand-mark"><HeartPulseIcon /></span>
          <span>Cura<span className="brand-light">Health</span></span>
        </a>
        <div className="header-status">
          <span className="status-dot" />
          Private care, simply connected
        </div>
      </header>

      <section className="hero-content" id="portal" aria-labelledby="hero-heading">
        <div className="eyebrow"><span className="eyebrow-sparkle">✦</span> Healthcare Portal</div>
        <h1 id="hero-heading">Your Health,<br /><em>Connected.</em></h1>
        <p className="hero-copy">
          Connect with healthcare professionals and manage your care through one simple conversation.
        </p>

        <button className="conversation-card" onClick={openConversation} type="button">
          <span className="conversation-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 11.5a7.2 7.2 0 0 1-7.5 7 8.5 8.5 0 0 1-3.15-.6L4 19.5l1.7-4.6A6.45 6.45 0 0 1 5 12a7.2 7.2 0 0 1 7.5-7 7.2 7.2 0 0 1 7.5 6.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              <path d="M9 12h.01M12.5 12h.01M16 12h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.8" />
            </svg>
          </span>
          <span className="conversation-text">
            <strong>Have a healthcare question?</strong>
            <small>Start a conversation with Cura</small>
          </span>
          <span className="conversation-arrow" aria-hidden="true">→</span>
        </button>
      </section>

      <aside className="care-note" aria-label="Portal benefit">
        <span className="care-note-icon">✦</span>
        <span><strong>Care that listens</strong><br />Guidance begins with a conversation.</span>
      </aside>

      <ChatWidget openSignal={chatOpenSignal} />
    </main>
  );
}

export default App;
