import { useEffect, useRef, useState } from 'react';
import './ChatWidget.css';

const demoMessages = [
  { id: 'welcome', sender: 'assistant', text: "Hi! I'm your Healthcare Assistant 👋" },
  { id: 'help', sender: 'assistant', text: 'I can help you get started with your healthcare needs.' },
  { id: 'booking', sender: 'user', text: "I'd like to book an appointment." },
  { id: 'reply', sender: 'assistant', text: "Sure! Tell me what type of appointment you're looking for." },
];

// Replace this temporary function with fetch('/api/chat') when a backend is available.
const getMockResponse = async () => {
  await new Promise((resolve) => window.setTimeout(resolve, 1250));
  return 'Response from system';
};

function AssistantIcon() {
  return <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false"><path d="M5 12.5A8 8 0 0 1 13 4a8 8 0 0 1 8 8.5v4A2.5 2.5 0 0 1 18.5 19H17l-2 2.5L13 19h-2.5A2.5 2.5 0 0 1 8 16.5v-4Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="M10.5 13h.01M15.5 13h.01M13 7.5v2" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" /></svg>;
}

function ChatBubbleIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M26.5 15A10.5 10.5 0 0 1 16 25.5a12.3 12.3 0 0 1-4.4-.8L5 27l2-5.6A9.5 9.5 0 0 1 5.5 16 10.5 10.5 0 0 1 16 5.5 10.5 10.5 0 0 1 26.5 15Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" /><path d="M10.5 16h11M16 10.5v11" stroke="currentColor" strokeLinecap="round" strokeWidth="2.1" /></svg>;
}

function SendIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m21 3-7.2 18-3.6-7.2L3 10.2 21 3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" /><path d="m10.2 13.8 4.3-4.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>;
}

function ChatWidget({ openSignal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (openSignal > 0) setIsOpen(true);
  }, [openSignal]);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 180);
  }, [isOpen]);

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, isOpen]);

  const submitMessage = async (event) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || isTyping) return;

    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: 'user', text: message }]);
    setInput('');
    setIsTyping(true);
    const response = await getMockResponse(message);
    setMessages((current) => [...current, { id: `assistant-${Date.now()}`, sender: 'assistant', text: response }]);
    setIsTyping(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="chat-widget">
      <section className={`chat-panel ${isOpen ? 'chat-panel--open' : ''}`} aria-hidden={!isOpen} aria-label="Healthcare Assistant chat">
        <header className="chat-header">
          <div className="assistant-avatar"><AssistantIcon /></div>
          <div className="assistant-heading"><h2>Healthcare Assistant</h2><p><span className="online-dot" /> Here to help you</p></div>
          <button className="close-chat" type="button" onClick={() => setIsOpen(false)} aria-label="Close Healthcare Assistant chat"><CloseIcon /></button>
        </header>

        <div className="chat-messages" aria-live="polite" aria-relevant="additions text">
          <div className="chat-date">Today</div>
          {messages.map((message) => (
            <div className={`message-row message-row--${message.sender}`} key={message.id}>
              {message.sender === 'assistant' && <span className="message-avatar"><AssistantIcon /></span>}
              <div className={`message message--${message.sender}`}>{message.text}</div>
            </div>
          ))}
          {isTyping && <div className="message-row message-row--assistant"><span className="message-avatar"><AssistantIcon /></span><div className="message message--assistant typing-bubble" aria-label="Healthcare Assistant is typing"><i /><i /><i /></div></div>}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-composer" onSubmit={submitMessage}>
          <label className="sr-only" htmlFor="chat-message">Message Healthcare Assistant</label>
          <input id="chat-message" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Write a message..." autoComplete="off" />
          <button className="send-message" type="submit" disabled={!input.trim() || isTyping} aria-label="Send message"><SendIcon /></button>
        </form>
        <p className="chat-privacy">Your conversation is private and secure.</p>
      </section>

      <button className={`chat-launcher ${isOpen ? 'chat-launcher--open' : ''}`} type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close Healthcare Assistant chat' : 'Open Healthcare Assistant chat'}>
        {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
        {!isOpen && <span className="chat-notification">1</span>}
      </button>
    </div>
  );
}

export default ChatWidget;
