'use client'

import { useEffect, useState, useRef } from 'react'

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
  time: string
  topic?: string
}

interface PromptItem {
  label: string
  prompt: string
}

const defaultPrompts: PromptItem[] = [
  { label: 'Skills', prompt: 'What are your skills?' },
  { label: 'Experience', prompt: 'Tell me about your experience.' },
  { label: 'Projects', prompt: 'Show me your projects.' },
  { label: 'Contact', prompt: 'How can I contact you?' }
]

const siteFacts = {
  name: 'Ferdinand Estoque',
  alias: 'Black Raven',
  title: 'Web Developer, UI/UX Designer, Digital Creator',
  location: 'Imus, Cavite, Philippines',
  experienceYears: '16+ years',
  education: 'Bachelor of Science in Information Technology',
  contact: {
    email: 'ferdinand.estoque@yahoo.com',
    phone: '+63 995 814 3127'
  },
  skills: [
    'React', 'Svelte', 'Node.js', 'JavaScript', 'HTML5', 'CSS', 'Bootstrap',
    'Laravel', 'MySQL', 'PostgreSQL', 'Figma', 'AEM', 'JIRA', 'SharePoint',
    'GitHub Copilot', 'Claude Code', 'Cursor', 'Cline'
  ],
  aiTools: ['Claude Code', 'GitHub Copilot', 'OpenAI Codex', 'Cursor', 'Cline', 'AntiGravity'],
  services: [
    'Web Design', 'Web Development', 'Print Design', 'Marketing',
    'Graphic Design', 'CMS Integration', 'Web Maintenance'
  ],
  experience: [
    '2025 - Visa / Teleperformance: Implementation Analyst / Digital Content Manager',
    '2016 - Quinn Data Facilities, Inc.: Back-End Web Developer',
    '2015 - Smart Communication, Inc.: IT Consultant / Front-End Web Developer',
    '2014 - Nasdaq: Web Designer Developer',
    '2013 - Crosspower Phils, Inc.: Multimedia Web Designer',
    '2008 - SPI Global: Senior Web Content Editor / Analyst'
  ],
  projects: [
    'Sudoku Solver', 'MyOnlineSite', 'WorldsTime', 'Space Snake',
    'Memory Matrix', 'NEXT IDE', 'Digital Signature Pro',
    'Whats for Dinner Wheel', 'Echoes music player'
  ]
}

const skillGroups = {
  frontEnd: ['React', 'Svelte', 'JavaScript', 'HTML5', 'CSS', 'Bootstrap'],
  backEnd: ['Node.js', 'Laravel', 'MySQL', 'PostgreSQL'],
  design: ['Figma', 'AEM', 'SharePoint', 'JIRA'],
  ai: ['GitHub Copilot', 'Claude Code', 'Cursor', 'Cline', 'OpenAI Codex', 'AntiGravity']
}

export default function AskAnything() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [prompts, setPrompts] = useState<PromptItem[]>(defaultPrompts)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const nowLabel = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const formatList = (items: string[]) => items.map((item) => `- ${item}`).join('\n')

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        role: 'bot',
        text: `Hi. I can answer questions about Ferdinand's skills, experience, projects, services, contact details, education, AI tools, and the website itself.`,
        time: nowLabel(),
        topic: 'general'
      }
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const answerFromRules = (query: string) => {
    const q = query.toLowerCase().trim()
    const has = (pattern: RegExp) => pattern.test(q)

    if (!q) {
      return {
        text: `I can help with skills, experience, projects, services, contact details, education, AI tools, or the website itself.`,
        followUps: defaultPrompts
      }
    }

    if (has(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
      return {
        text: `Hello! I'm the Ask Anything assistant for Ferdinand Estoque's portfolio website. How can I help you today?`,
        followUps: defaultPrompts
      }
    }

    if (has(/\b(who are you|about you|tell me about you|black raven|ferdinand)\b/)) {
      return {
        text: `${siteFacts.name}, also known as **${siteFacts.alias}**, is a ${siteFacts.title} based in ${siteFacts.location}. He has ${siteFacts.experienceYears} of experience building modern digital experiences across design, development, and AI-assisted workflows.`,
        followUps: [
          { label: 'Skills', prompt: 'What are your skills?' },
          { label: 'Experience', prompt: 'Tell me about your experience.' },
          { label: 'Contact', prompt: 'How can I contact you?' }
        ]
      }
    }

    if (has(/\b(skill|skills|tech stack|stack|technology|tech)\b/)) {
      return {
        text: `Here is a snapshot of Ferdinand's core tech stack:\n${formatList(siteFacts.skills)}\n\nI can also breakdown by Front-end, Back-end, or AI tools!`,
        followUps: [
          { label: 'Front-end', prompt: 'What front-end skills do you use?' },
          { label: 'Back-end', prompt: 'What back-end skills do you use?' },
          { label: 'AI tools', prompt: 'What AI tools do you use?' }
        ]
      }
    }

    if (has(/\b(experience|timeline|work history|career|job)\b/)) {
      return {
        text: `Here is the career experience overview:\n${formatList(siteFacts.experience)}`,
        followUps: [
          { label: 'Projects', prompt: 'Show me your projects.' },
          { label: 'Services', prompt: 'What services do you offer?' },
          { label: 'Contact', prompt: 'How can I contact you?' }
        ]
      }
    }

    if (has(/\b(project|projects|portfolio|gallery|apps?)\b/)) {
      return {
        text: `Here are some featured projects:\n${formatList(siteFacts.projects)}\n\nYou can explore live demos and GitHub repos directly in the Projects section above!`,
        followUps: [
          { label: 'Skills', prompt: 'What are your skills?' },
          { label: 'Contact', prompt: 'How can I contact you?' }
        ]
      }
    }

    if (has(/\b(contact|email|phone|reach|location|where are you)\b/)) {
      return {
        text: `You can reach Ferdinand directly:\n- Email: ${siteFacts.contact.email}\n- Phone: ${siteFacts.contact.phone}\n- Location: ${siteFacts.location}`,
        followUps: [
          { label: 'Services', prompt: 'What services do you offer?' },
          { label: 'Projects', prompt: 'Show me your projects.' }
        ]
      }
    }

    if (has(/\b(service|services|what can you do|offer)\b/)) {
      return {
        text: `Ferdinand offers the following services:\n${formatList(siteFacts.services)}`,
        followUps: [
          { label: 'Contact', prompt: 'How can I contact you?' },
          { label: 'Projects', prompt: 'Show me your projects.' }
        ]
      }
    }

    if (has(/\b(ai|copilot|claude|cursor|cline|codex|antigravity)\b/)) {
      return {
        text: `Ferdinand actively uses modern AI-assisted engineering tools:\n${formatList(siteFacts.aiTools)}\n\nThis accelerates delivery, ensures high code quality, and enables fast prototyping.`,
        followUps: [
          { label: 'Skills', prompt: 'What are your skills?' },
          { label: 'Projects', prompt: 'Show me your projects.' }
        ]
      }
    }

    return {
      text: `I can help with Ferdinand's skills, experience, projects, services, contact details, education, AI tools, or the website itself. Feel free to try one of the suggestions below!`,
      followUps: defaultPrompts
    }
  }

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim()
    if (!text || isTyping) return

    const userMsg: ChatMessage = { role: 'user', text, time: nowLabel() }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    const delay = Math.min(1000, 350 + Math.sqrt(text.length) * 45)
    setTimeout(() => {
      const reply = answerFromRules(text)
      const botMsg: ChatMessage = { role: 'bot', text: reply.text, time: nowLabel() }
      setMessages((prev) => [...prev, botMsg])
      if (reply.followUps) {
        setPrompts(reply.followUps)
      }
      setIsTyping(false)
      if (!isOpen || isMinimized) {
        setUnreadCount((c) => c + 1)
      }
    }, delay)
  }

  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
      setUnreadCount(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    } else if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <div id="ask-anything-widget" className={`ask-anything-widget ${isOpen ? 'is-open' : ''}`}>
      <button
        id="ask-anything-launcher"
        className="ask-anything-launcher"
        type="button"
        aria-expanded={isOpen}
        onClick={toggleOpen}
        aria-label="Open chat with Ferdinand"
      >
        <i className="bi bi-chat-dots-fill ask-anything-launcher__icon" aria-hidden="true"></i>
        <span className="ask-anything-launcher__text" aria-hidden="true">
          <span className="ask-anything-launcher__eyebrow">Ask Anything</span>
          <span className="ask-anything-launcher__title">Chat with me</span>
          <span className="ask-anything-launcher__status">
            <span className="ask-anything__dot" aria-hidden="true"></span>Online
          </span>
        </span>
        {unreadCount > 0 && (
          <span id="ask-anything-badge" className="ask-anything-launcher__badge" role="status">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section
          id="ask-anything-panel"
          className={`ask-anything-panel ${isMinimized ? 'is-minimized' : ''}`}
          aria-label="Ask Anything chatbot"
        >
          <header className="ask-anything-panel__header">
            <div>
              <p className="ask-anything-panel__eyebrow">Ask Anything</p>
              <h2>Website assistant</h2>
            </div>
            <div className="ask-anything-panel__actions">
              <button
                id="ask-anything-clear"
                className="ask-anything-panel__action"
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      role: 'bot',
                      text: `Conversation cleared. What would you like to know about Ferdinand's work?`,
                      time: nowLabel(),
                      topic: 'general'
                    }
                  ])
                  setPrompts(defaultPrompts)
                }}
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                id="ask-anything-minimize"
                className="ask-anything-panel__action"
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title="Minimize chat"
              >
                &#8211;
              </button>
              <button
                id="ask-anything-close"
                className="ask-anything-panel__close"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>
          </header>

          {!isMinimized && (
            <>
              <div className="ask-anything-panel__status">
                <span className="ask-anything__dot" aria-hidden="true"></span>Online
              </div>
              <div id="ask-anything-messages" className="ask-anything-panel__messages" role="log">
                {messages.map((msg, idx) => (
                  <article key={idx} className={`ask-anything-message ask-anything-message--${msg.role}`}>
                    <div className="ask-anything-message__bubble">{msg.text}</div>
                    <span className="ask-anything-message__meta">
                      {msg.role === 'user' ? `You • ${msg.time}` : `Assistant • ${msg.time}`}
                    </span>
                  </article>
                ))}
                {isTyping && (
                  <div id="ask-anything-typing" className="ask-anything-panel__typing">
                    <span></span><span></span><span></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="ask-anything-panel__prompts" aria-label="Suggested questions">
                {prompts.map((p, i) => (
                  <button key={i} type="button" className="ask-anything-prompt" onClick={() => handleSend(p.prompt)}>
                    {p.label}
                  </button>
                ))}
              </div>

              <form
                id="ask-anything-form"
                className="ask-anything-panel__form"
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
              >
                <div className="ask-anything-panel__input-wrap">
                  <input
                    ref={inputRef}
                    id="ask-anything-input"
                    type="text"
                    maxLength={280}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about skills, experience, projects…"
                    aria-label="Type your question"
                  />
                  <span id="ask-anything-char-count" className="ask-anything-panel__char-count">
                    {280 - inputText.length}
                  </span>
                </div>
                <button id="ask-anything-send" type="submit" aria-label="Send message">
                  <i className="bi bi-send-fill" aria-hidden="true"></i>
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </div>
  )
}