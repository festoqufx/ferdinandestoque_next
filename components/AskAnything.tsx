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
  { label: 'Certificates', prompt: 'What certificates do you have?' },
  { label: 'Hobbies & Interests', prompt: 'What are your hobbies and interests?' },
  { label: 'Websites & Projects', prompt: 'What websites and projects have you worked on?' },
  { label: 'Services & Expertise', prompt: 'What services do you offer?' },
  { label: 'Skills', prompt: 'What are your technical skills?' },
  { label: 'Contact', prompt: 'How can I contact you?' }
]

const siteFacts = {
  name: 'Ferdinand Estoque',
  alias: 'Black Raven',
  title: 'Web Developer, UI/UX Designer, Digital Creator',
  location: 'Imus, Cavite, Philippines',
  experienceYears: '16+ years',
  education: 'Bachelor of Science in Information Technology (BSIT)',
  contact: {
    email: 'ferdinand.estoque@yahoo.com',
    phone: '+63 995 814 3127',
    location: 'Imus, Cavite, Philippines',
    github: 'https://github.com/festoqufx',
    linkedin: 'https://www.linkedin.com/in/ferdinand-estoque-46797876',
    instagram: 'https://www.instagram.com/ravenom_007'
  },
  certificates: [
    '**AI Foundations** by OpenAI — https://academy.openai.com/home/certificate/u77flalmmn',
    '**Anthropic Claude 101** by Anthropic — https://verify.skilljar.com/c/tadt9xixkhts',
    '**Azure Fundamentals** by Microsoft — https://simpli-web.app.link/e/4k1LYawGU5b',
    '**ITIL V4** by SimpliLearn — https://simpli-web.app.link/e/nIHO6LMkU5b',
    '**Cybersecurity Awareness** by HP — https://www.life-global.org/certificate/78f4c7bc-0144-428d-b48e-da9d56424494',
    '**AI for Business Professionals** by HP — https://www.life-global.org/certificate/a9de57e0-d363-4326-911a-d41b40a0311d'
  ],
  hobbies: [
    '**Coding**: Building side projects, testing new frameworks (Next.js, Vue, Angular), and experimenting with AI agents.',
    '**Gym/Fitness**: Daily workouts, strength training, and physical discipline.',
    '**Games**: Strategy games, retro classics, and studying interactive game mechanics.',
    '**Movies**: Sci-fi films, cinematic storytelling, and animation.',
    '**Painting**: Traditional and digital art, illustrations, and visual composition.'
  ],
  interests: [
    '**Music**: Audiophile sound, creating music apps (like Echoes Music Player).',
    '**Martial Arts**: Martial discipline, mental agility, and focus.',
    '**Photography**: Capturing street, landscape, and travel moments.',
    '**Reading**: Software architecture, AI advancements, UI/UX design, and personal development.',
    '**Travel**: Exploring diverse cultures and solo travel adventures, like my memorable solo trip across Japan! (Tokyo, Narita, Ichiran Ramen, and Disneyland)'
  ],
  skills: [
    'React', 'Svelte', 'Node.js', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS',
    'Vue', 'Angular', 'Laravel', 'PHP', 'Python', 'Java', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker',
    'Figma', 'Adobe AEM', 'SharePoint', 'JIRA', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects',
    'GitHub Copilot', 'Claude Code', 'Cursor', 'Cline', 'Devin', 'AntiGravity'
  ],
  aiTools: ['Claude Code', 'GitHub Copilot', 'OpenAI Codex', 'Cursor', 'Cline', 'AntiGravity', 'Devin'],
  services: [
    '**Web Development**: Custom web applications, API integrations, and scalable front-end and back-end architectures.',
    '**Web Design**: Modern responsive design, UI/UX prototyping, and accessible layouts.',
    '**Print Design**: Digital assets, flyers, business cards, and marketing collateral.',
    '**Branding & Rebranding**: Brand identity, logo design, style guides, and creative direction.',
    '**Illustration**: Custom traditional and digital artwork and media graphics.',
    '**CMS Integration & Maintenance**: Adobe Experience Manager (AEM), SharePoint, WordPress, and ongoing site upkeep.'
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
    '**Sudoku Solver** (React) — https://sudoku-solver-raven.vercel.app/',
    '**MyOnlineSite** (Angular) — https://festoque-v1-blkred.vercel.app/',
    '**WorldsTime** (Next.js) — https://next-world-time-raven-v1.vercel.app/',
    '**Space Snake** (Vue) — https://vue-space-snake-raven.vercel.app/',
    '**Memory Matrix** (Angular) — https://angular-memory-card-game-raven.vercel.app/',
    '**NEXT IDE** (Next.js) — https://next-web-based-ide-raven.vercel.app/',
    '**Digital Signature Pro** (Vue) — https://digital-signature-raven-pro.vercel.app/',
    '**Whats for Dinner Wheel** (Vue) — https://vue-whats-for-dinner-wheel-raven.vercel.app/',
    '**Echoes Music Player** (Angular) — https://festoqufx-github-io-echoes-music-pl.vercel.app/#/search/videos'
  ],
  companiesAndClients: [
    '**Visa / Teleperformance** (2025) — Implementation Analyst & Digital Content Manager (AEM, SharePoint, Figma, CI/CD)',
    '**Quinn Data Facilities, Inc.** (2016) — Back-End Web Developer (Laravel, MySQL, PostgreSQL)',
    '**Smart Communications, Inc.** (2015) — IT Consultant & Front-End Web Developer (ASP.NET, C#, Bootstrap)',
    '**Nasdaq** (2014) — Web Designer & Developer (Phoenix, Web360, ColdFusion, Bootstrap)',
    '**Crosspower Phils, Inc.** (2013) — Multimedia Web Designer (WordPress, Genesis, PHP/MySQL)',
    '**SPI Global** (2008) — Senior Web Content Editor & Analyst (Arbortext, SGML, XML, DHTML)'
  ]
}

const skillGroups = {
  frontEnd: ['React', 'Svelte', 'JavaScript', 'TypeScript', 'Next.js', 'Vue', 'Angular', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS'],
  backEnd: ['Node.js', 'Laravel', 'PHP', 'Python', 'Java', 'MySQL', 'PostgreSQL', 'MongoDB'],
  design: ['Figma', 'Photoshop', 'Illustrator', 'Adobe AEM', 'SharePoint', 'JIRA'],
  ai: siteFacts.aiTools
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
  const isLoaded = useRef(false)

  const HISTORY_KEY = 'askAnythingHistoryV3'
  const PREFS_KEY = 'askAnythingPrefsV3'
  const MAX_HISTORY = 40

  const nowLabel = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const formatList = (items: string[]) => items.map((item) => `- ${item}`).join('\n')

  const renderBotHtml = (rawText: string) => {
    const safe = rawText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return safe
      .replace(/\*\*([^*\n]{1,120})\*\*/g, "<strong>$1</strong>")
      .replace(/(https?:\/\/[^\s<&]{4,})/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />');
  };

  useEffect(() => {
    if (isLoaded.current) return
    isLoaded.current = true

    try {
      const savedPrefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}')
      if (savedPrefs.minimized) setIsMinimized(true)

      const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
      if (Array.isArray(savedHistory) && savedHistory.length > 0) {
        setMessages(savedHistory)
      } else {
        setMessages([
          {
            role: 'bot',
            text: `Hi! I'm the website assistant for Ferdinand Estoque.\n\nI can answer questions based strictly on the site's content, including Ferdinand's **certificates**, **hobbies & interests**, **websites & projects**, **services & expertise**, **skills**, and **contact details**.`,
            time: nowLabel(),
            topic: 'general'
          }
        ])
      }
    } catch (_) {
      setMessages([
        {
          role: 'bot',
          text: `Hi! I'm the website assistant for Ferdinand Estoque. How can I help you today?`,
          time: nowLabel(),
          topic: 'general'
        }
      ])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)))
      } catch (_) {}
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ minimized: isMinimized }))
    } catch (_) {}
  }, [isMinimized])

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        toggleOpen()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [isOpen])

  /**
   * Intelligently extracts topics and keywords, matches synonyms/variations,
   * supports compound questions, and answers strictly using website facts.
   */
  const answerFromRules = (query: string): { text: string; followUps?: PromptItem[]; topic?: string } => {
    const raw = query.trim()
    const q = raw.toLowerCase()

    if (!q) {
      return {
        text: `I can answer questions about Ferdinand's certificates, hobbies, interests, websites, projects, services, skills, experience, and contact details.`,
        followUps: defaultPrompts,
        topic: 'general'
      }
    }

    const has = (pattern: RegExp) => pattern.test(q)

    // Conversational & utility intents
    if (has(/\b(clear|reset|start over|restart)\b/)) {
      return {
        text: `You can clear the conversation using the Clear button in the chat header.`,
        followUps: defaultPrompts,
        topic: 'utility'
      }
    }

    if (has(/\b(help|how to use|commands|what can i ask|what can you do|features)\b/)) {
      return {
        text: `You can ask me questions about:\n- **Certificates & Credentials** (OpenAI, Anthropic, Azure, ITIL, HP)\n- **Hobbies & Interests** (Coding, Fitness, Gaming, Movies, Art, Music, Travel)\n- **Websites & Projects** (Featured web apps & client websites)\n- **Services & Expertise** (Web development, UI/UX design, branding, CMS)\n- **Skills & Tech Stack** (React, Next.js, Vue, Angular, Node, AI tools)\n- **Work Experience** (Career timeline & companies)\n- **Contact Information** (Email, phone, social links)`,
        followUps: defaultPrompts,
        topic: 'help'
      }
    }

    if (has(/^(hi|hello|hey|good (morning|afternoon|evening)|howdy|greetings)[!.]?$/) || (has(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/) && q.split(/\s+/).length <= 4)) {
      return {
        text: `Hello! I'm the website assistant for Ferdinand Estoque. Ask me anything about Ferdinand's certificates, hobbies, interests, projects, services, or skills!`,
        followUps: defaultPrompts,
        topic: 'greeting'
      }
    }

    if (has(/\b(thank|thanks|thank you|appreciate it|cheers)\b/)) {
      return {
        text: `You're very welcome! Let me know if you need any other information from Ferdinand's portfolio.`,
        followUps: defaultPrompts,
        topic: 'greeting'
      }
    }

    if (has(/\b(bye|goodbye|see you|take care|cya)\b/)) {
      return {
        text: `Goodbye! You can reach Ferdinand directly via email at ${siteFacts.contact.email}. Have a great day!`,
        followUps: [{ label: 'Contact', prompt: 'How can I contact Ferdinand?' }, { label: 'Projects', prompt: 'Show me projects' }],
        topic: 'greeting'
      }
    }

    if (has(/\b(surprise me|random|fun fact|tell me something interesting|did you know)\b/)) {
      const funFacts = [
        `Ferdinand holds verified certificates in **AI Foundations** (OpenAI) and **Claude 101** (Anthropic)!`,
        `The alias **"Black Raven"** comes from Ferdinand's longtime online handle, ravenom_007.`,
        `Ferdinand went on a memorable solo trip across **Japan**, exploring Tokyo, Narita, Disneyland, and savoring authentic ramen at Ichiran!`,
        `Ferdinand's project **Echoes** is a fully functional web music player built with Angular.`,
        `Ferdinand has over **16 years of experience** in web development, having worked with Visa, Nasdaq, and Smart Communications.`
      ]
      return {
        text: funFacts[Math.floor(Math.random() * funFacts.length)],
        followUps: [{ label: 'Another Fact', prompt: 'Surprise me!' }, { label: 'Certificates', prompt: 'What certificates do you have?' }, { label: 'Japan Trip', prompt: 'Tell me about the Japan trip' }],
        topic: 'fun'
      }
    }

    // Comprehensive Keyword & Synonym Topic Extraction
    const wantsCertificates = has(/\b(cert|certs|certificate|certificates|certification|certifications|credential|credentials|qualification|qualifications|diploma|diplomas|licensed|license|licenses|accredited|accreditation|accreditations|certified)\b/)

    const wantsHobbies = has(/\b(hobb(y|ies)|pastime|pastimes|leisure|free time|spare time|for fun|outside of work|activit(y|ies)|things (he|you) enjoy(s)?|what (he|you) enjoy(s)?|what (he|you) (do|does) for fun|gym|workout|workouts|fitness|strength training|gaming|games|gamer|video games|painting|drawing|art)\b/)

    const wantsInterests = has(/\b(interest|interests|passion|passions|interested in|music|sound|audiophile|martial art|martial arts|karate|photography|photos|reading|books|travel|traveling|travels|trip|trips|japan|tokyo|narita|ichiran|disneyland|vacation|exploring)\b/)

    const wantsServices = has(/\b(service|services|expertise|services offered|capabilit(y|ies)|what (can you|can he) do|what services|offer|offers|offering|offerings|hire|hiring|freelance|rate|rates|pricing|price|cost|quote)\b/)

    const wantsWebsitesOrProjects = has(/\b(website|websites|web sites|project|projects|portfolio|portfolio items|client|clients|worked with|worked on|worked for|web development projects?|apps?|applications?|demos?|works?|what (have you|has he) built|showcase|sudoku|myonlinesite|worldstime|space snake|memory matrix|next ide|digital signature|dinner wheel|echoes)\b/)

    const wantsSkills = has(/\b(skill|skills|tech stack|stack|technolog(y|ies)|front[- ]?end|back[- ]?end|full[- ]?stack|languages?|frameworks?|proficienc(y|ies)|coding abilities|react|vue|angular|svelte|nextjs|node|php|python|laravel|typescript|javascript|database|databases)\b/)

    const wantsExperience = has(/\b(experience|timeline|work history|career|employment|jobs?|companies|company|background|roles?|resume|cv)\b/)

    const wantsContact = has(/\b(contact|email|phone|call|reach|message|touch|location|address|where (are you|is he) (based|located|living)|social|socials|github|linkedin|instagram)\b/)

    const wantsEducation = has(/\b(education|degree|college|university|graduated|graduate|bsit|bachelor|school|academic)\b/)

    const wantsAI = has(/\b(ai|artificial intelligence|ai tools|copilot|claude|cursor|cline|codex|antigravity|devin|unsloth)\b/)

    const wantsAbout = has(/\b(who (is|are) (ferdinand|he|black raven|you)|tell me about (him|ferdinand|black raven|yourself)|bio|biography|profile|overview)\b/)

    // Specific sub-query detection
    const hasOpenAICert = has(/\b(openai|ai foundations)\b/)
    const hasAnthropicCert = has(/\b(anthropic|claude 101)\b/)
    const hasAzureCert = has(/\b(azure|microsoft)\b/)
    const hasItilCert = has(/\b(itil|itil 4|it service)\b/)
    const hasHpCert = has(/\b(hp|cybersecurity awareness|ai for business)\b/)
    const hasJapanTravel = has(/\b(japan|tokyo|narita|ichiran|disneyland|travel|trip)\b/)
    const hasMusicInterest = has(/\b(music|sound|audiophile|echoes)\b/)
    const hasGymHobby = has(/\b(gym|workout|fitness|strength training)\b/)
    const hasGamesHobby = has(/\b(game|games|gaming|gamer)\b/)
    const hasPaintingHobby = has(/\b(painting|draw|drawing|art|visual art)\b/)

    // Specific project matching
    const projectMap: Record<string, { name: string; stack: string; url: string; github: string }> = {
      sudoku: { name: 'Sudoku Solver', stack: 'React', url: 'https://sudoku-solver-raven.vercel.app/', github: 'https://github.com/festoqufx/sudoku-solver-raven' },
      myonlinesite: { name: 'MyOnlineSite', stack: 'Angular', url: 'https://festoque-v1-blkred.vercel.app/', github: 'https://github.com/festoqufx/festoque_v1_blkred' },
      worldstime: { name: 'WorldsTime', stack: 'Next.js', url: 'https://next-world-time-raven-v1.vercel.app/', github: 'https://github.com/festoqufx/next-world-time-raven' },
      snake: { name: 'Space Snake', stack: 'Vue', url: 'https://vue-space-snake-raven.vercel.app/', github: 'https://github.com/festoqufx/vue-space-snake-raven' },
      memory: { name: 'Memory Matrix', stack: 'Angular', url: 'https://angular-memory-card-game-raven.vercel.app/', github: 'https://github.com/festoqufx/angular-memory-card-game-raven' },
      ide: { name: 'NEXT IDE', stack: 'Next.js', url: 'https://next-web-based-ide-raven.vercel.app/', github: 'https://github.com/festoqufx/next-web-based-ide-raven' },
      signature: { name: 'Digital Signature Pro', stack: 'Vue', url: 'https://digital-signature-raven-pro.vercel.app/', github: 'https://github.com/festoqufx/digital-signature-raven-pro' },
      dinner: { name: 'Whats for Dinner Wheel', stack: 'Vue', url: 'https://vue-whats-for-dinner-wheel-raven.vercel.app/', github: 'https://github.com/festoqufx/vue-whats-for-dinner-wheel-raven' },
      echoes: { name: 'Echoes Music Player', stack: 'Angular', url: 'https://festoqufx-github-io-echoes-music-pl.vercel.app/#/search/videos', github: 'https://github.com/festoqufx/festoqufx.github.io-echoes-music-player' }
    }
    const matchedProjectKey = Object.keys(projectMap).find((key) => q.includes(key))

    // Track matched categories for compound queries
    const matchedCategories: string[] = []
    if (wantsCertificates) matchedCategories.push('certificates')
    if (wantsHobbies) matchedCategories.push('hobbies')
    if (wantsInterests) matchedCategories.push('interests')
    if (wantsServices) matchedCategories.push('services')
    if (wantsWebsitesOrProjects && !matchedProjectKey) matchedCategories.push('websites_projects')
    if (wantsSkills && !wantsServices) matchedCategories.push('skills')
    if (wantsExperience && !wantsWebsitesOrProjects) matchedCategories.push('experience')
    if (wantsContact) matchedCategories.push('contact')
    if (wantsEducation) matchedCategories.push('education')

    // Handle Compound Multi-Topic Queries (e.g. "What are Ferdinand Estoque's certificates or hobbies?")
    if (matchedCategories.length > 1) {
      const sections: string[] = []
      const followUps: PromptItem[] = []

      if (wantsCertificates) {
        sections.push(`**Certificates & Qualifications**:\n${formatList(siteFacts.certificates)}`)
        followUps.push({ label: 'Certificates', prompt: 'Tell me more about certificates' })
      }
      if (wantsHobbies) {
        sections.push(`**Hobbies & Activities**:\n${formatList(siteFacts.hobbies)}`)
        followUps.push({ label: 'Hobbies', prompt: 'What are his hobbies?' })
      }
      if (wantsInterests) {
        sections.push(`**Interests & Passions**:\n${formatList(siteFacts.interests)}`)
        followUps.push({ label: 'Interests', prompt: 'Tell me about his interests' })
      }
      if (wantsServices) {
        sections.push(`**Services & Expertise**:\n${formatList(siteFacts.services)}`)
        followUps.push({ label: 'Services', prompt: 'What services do you offer?' })
      }
      if (wantsWebsitesOrProjects && !matchedProjectKey) {
        sections.push(`**Featured Websites & Projects**:\n${formatList(siteFacts.projects.slice(0, 5))}\n\n**Clients & Companies Worked With**:\n${formatList(siteFacts.companiesAndClients.slice(0, 4))}`)
        followUps.push({ label: 'All Projects', prompt: 'Show me all projects' })
      }
      if (wantsSkills && !wantsServices) {
        sections.push(`**Technical Skills & Stack**:\n${formatList(siteFacts.skills.slice(0, 10))} and more.`)
        followUps.push({ label: 'Skills', prompt: 'What are your skills?' })
      }
      if (wantsExperience && !wantsWebsitesOrProjects) {
        sections.push(`**Work History**:\n${formatList(siteFacts.experience)}`)
        followUps.push({ label: 'Experience', prompt: 'Tell me about your experience' })
      }
      if (wantsContact) {
        sections.push(`**Contact Details**:\n- Email: ${siteFacts.contact.email}\n- Phone: ${siteFacts.contact.phone}\n- Location: ${siteFacts.location}`)
        followUps.push({ label: 'Contact', prompt: 'How can I contact you?' })
      }
      if (wantsEducation) {
        sections.push(`**Education**:\n- ${siteFacts.education}`)
      }

      return {
        text: `Here is the relevant information from Ferdinand Estoque's website:\n\n${sections.join('\n\n')}`,
        followUps: followUps.slice(0, 4),
        topic: 'compound'
      }
    }

    // Specific Single Project query
    if (matchedProjectKey) {
      const p = projectMap[matchedProjectKey]
      return {
        text: `**${p.name}** is a project built with **${p.stack}**.\n- Live Demo: ${p.url}\n- GitHub: ${p.github}`,
        followUps: [
          { label: 'All Projects', prompt: 'Show me your projects.' },
          { label: 'Skills', prompt: 'What are your skills?' },
          { label: 'Contact', prompt: 'How can I contact you?' }
        ],
        topic: 'projects'
      }
    }

    // Specific Certificate queries
    if (wantsCertificates) {
      if (hasOpenAICert) {
        return {
          text: `Ferdinand holds the **AI Foundations** certificate by **OpenAI**.\nIt validates foundational AI knowledge and practical understanding of AI concepts.\nVerification URL: https://academy.openai.com/home/certificate/u77flalmmn`,
          followUps: [
            { label: 'Anthropic Cert', prompt: 'Tell me about the Anthropic certificate.' },
            { label: 'All Certificates', prompt: 'What certificates do you have?' },
            { label: 'AI Tools', prompt: 'What AI tools do you use?' }
          ],
          topic: 'certificates'
        }
      }
      if (hasAnthropicCert) {
        return {
          text: `Ferdinand holds the **Anthropic Claude 101** certificate by **Anthropic**.\nIt validates foundational knowledge of Claude and its practical use in AI-assisted work.\nVerification URL: https://verify.skilljar.com/c/tadt9xixkhts`,
          followUps: [
            { label: 'OpenAI Cert', prompt: 'Tell me about the OpenAI certificate.' },
            { label: 'All Certificates', prompt: 'What certificates do you have?' },
            { label: 'AI Tools', prompt: 'What AI tools do you use?' }
          ],
          topic: 'certificates'
        }
      }
      if (hasAzureCert) {
        return {
          text: `Ferdinand holds the **Azure Fundamentals** certificate by **Microsoft** (via SimpliLearn).\nIt validates foundational knowledge of Azure cloud services and core cloud computing concepts.\nVerification URL: https://simpli-web.app.link/e/4k1LYawGU5b`,
          followUps: [
            { label: 'ITIL Cert', prompt: 'Tell me about the ITIL certificate.' },
            { label: 'All Certificates', prompt: 'What certificates do you have?' },
            { label: 'Tech Stack', prompt: 'What is your tech stack?' }
          ],
          topic: 'certificates'
        }
      }
      if (hasItilCert) {
        return {
          text: `Ferdinand holds the **ITIL V4 certificate** by **SimpliLearn**.\nIt validates knowledge of ITIL 4 practices for effective IT service management and delivery.\nVerification URL: https://simpli-web.app.link/e/nIHO6LMkU5b`,
          followUps: [
            { label: 'Azure Cert', prompt: 'Tell me about the Azure certificate.' },
            { label: 'All Certificates', prompt: 'What certificates do you have?' },
            { label: 'Experience', prompt: 'Tell me about your experience.' }
          ],
          topic: 'certificates'
        }
      }
      if (hasHpCert) {
        return {
          text: `Ferdinand holds two certifications from **HP (LIFE Global)**:\n- **Cybersecurity Awareness**: https://www.life-global.org/certificate/78f4c7bc-0144-428d-b48e-da9d56424494\n- **AI for Business Professionals**: https://www.life-global.org/certificate/a9de57e0-d363-4326-911a-d41b40a0311d`,
          followUps: [
            { label: 'OpenAI Cert', prompt: 'Tell me about the OpenAI certificate.' },
            { label: 'Anthropic Cert', prompt: 'Tell me about the Anthropic certificate.' },
            { label: 'All Certificates', prompt: 'What certificates do you have?' }
          ],
          topic: 'certificates'
        }
      }
      return {
        text: `Ferdinand holds 6 verified professional certificates and credentials in AI, Cloud, Cybersecurity, and IT Service Management:\n\n${formatList(siteFacts.certificates)}\n\nYou can also explore the credential badges in the Certificates section!`,
        followUps: [
          { label: 'OpenAI Cert', prompt: 'OpenAI certificate' },
          { label: 'Anthropic Cert', prompt: 'Anthropic certificate' },
          { label: 'Hobbies & Interests', prompt: 'What are your hobbies and interests?' }
        ],
        topic: 'certificates'
      }
    }

    // Specific Hobbies / Activities queries
    if (wantsHobbies && !wantsInterests) {
      if (hasGymHobby) {
        return {
          text: `Ferdinand's fitness activities include daily workouts, strength training, and physical discipline to stay energized and focused.`,
          followUps: [{ label: 'Other Hobbies', prompt: 'What other hobbies do you have?' }, { label: 'Interests', prompt: 'What are your interests?' }],
          topic: 'hobbies'
        }
      }
      if (hasGamesHobby) {
        return {
          text: `Ferdinand enjoys strategy games and retro classics, as well as studying interactive game mechanics.`,
          followUps: [{ label: 'Other Hobbies', prompt: 'What other hobbies do you have?' }, { label: 'Projects', prompt: 'Show me your projects.' }],
          topic: 'hobbies'
        }
      }
      if (hasPaintingHobby) {
        return {
          text: `Ferdinand practices traditional and digital painting, visual composition, and artistic illustration.`,
          followUps: [{ label: 'Other Hobbies', prompt: 'What other hobbies do you have?' }, { label: 'Design Skills', prompt: 'What design tools do you use?' }],
          topic: 'hobbies'
        }
      }
      return {
        text: `Here are Ferdinand's hobbies and things he enjoys outside of work:\n\n${formatList(siteFacts.hobbies)}`,
        followUps: [
          { label: 'Interests', prompt: 'What are your interests?' },
          { label: 'Certificates', prompt: 'What certificates do you have?' },
          { label: 'Websites & Projects', prompt: 'What projects have you worked on?' }
        ],
        topic: 'hobbies'
      }
    }

    // Specific Interests / Passions queries
    if (wantsInterests && !wantsHobbies) {
      if (hasJapanTravel) {
        return {
          text: `One of Ferdinand's favorite travel experiences was an incredible solo journey across **Japan**!\nHe explored Tokyo at his own pace, visited Narita, stayed near Tokyo Disneyland, and enjoyed quiet moments savoring authentic Japanese ramen at Ichiran. It was an enriching cultural and solo adventure.`,
          followUps: [
            { label: 'Other Interests', prompt: 'What other interests do you have?' },
            { label: 'Hobbies', prompt: 'What are your hobbies?' },
            { label: 'Contact', prompt: 'How can I contact you?' }
          ],
          topic: 'interests'
        }
      }
      if (hasMusicInterest) {
        return {
          text: `Ferdinand is an audiophile passionate about high-fidelity sound and created **Echoes Music Player**, an interactive web app built with Angular!\nDemo: https://festoqufx-github-io-echoes-music-pl.vercel.app/#/search/videos`,
          followUps: [
            { label: 'Other Interests', prompt: 'What other interests do you have?' },
            { label: 'Hobbies', prompt: 'What are your hobbies?' },
            { label: 'Projects', prompt: 'Show me your projects.' }
          ],
          topic: 'interests'
        }
      }
      return {
        text: `Here are Ferdinand's personal interests and passions:\n\n${formatList(siteFacts.interests)}`,
        followUps: [
          { label: 'Japan Trip', prompt: 'Tell me about the Japan trip' },
          { label: 'Hobbies', prompt: 'What are your hobbies?' },
          { label: 'Certificates', prompt: 'What certificates do you have?' }
        ],
        topic: 'interests'
      }
    }

    // Websites, Clients, and Projects Worked With / On
    if (wantsWebsitesOrProjects) {
      return {
        text: `Here are the websites and projects Ferdinand has built and worked with:\n\n**Featured Web Applications**:\n${formatList(siteFacts.projects)}\n\n**Enterprise & Client Platforms Worked With**:\n${formatList(siteFacts.companiesAndClients)}\n\nYou can also explore live demos in the Projects section and the client showcase in the Infinity Carousel!`,
        followUps: [
          { label: 'Skills', prompt: 'What are your technical skills?' },
          { label: 'Services', prompt: 'What services do you offer?' },
          { label: 'Contact', prompt: 'How can I contact you?' }
        ],
        topic: 'projects'
      }
    }

    // Services Offered & Expertise
    if (wantsServices) {
      return {
        text: `Ferdinand offers professional services and expertise in the following areas:\n\n${formatList(siteFacts.services)}\n\nRates are flexible and project-based. Reach out at ${siteFacts.contact.email} for inquiries or collaboration!`,
        followUps: [
          { label: 'Contact', prompt: 'How can I contact you?' },
          { label: 'Websites & Projects', prompt: 'What projects have you worked on?' },
          { label: 'Skills', prompt: 'What are your skills?' }
        ],
        topic: 'services'
      }
    }

    // Skills & Tech Stack
    if (wantsSkills) {
      if (has(/\b(front[- ]?end|ui|ui\/ux|design)\b/)) {
        return {
          text: `Front-end and UI/UX design tools highlighted on the site:\n\n**Front-End**:\n${formatList(skillGroups.frontEnd)}\n\n**Design & Prototyping**:\n${formatList(skillGroups.design)}`,
          followUps: [{ label: 'Back-end', prompt: 'What back-end skills do you use?' }, { label: 'AI Tools', prompt: 'What AI tools do you use?' }, { label: 'Projects', prompt: 'Show me your projects.' }],
          topic: 'skills'
        }
      }
      if (has(/\b(back[- ]?end|backend|database|server|api)\b/)) {
        return {
          text: `Back-end, API, and database technologies on the site:\n\n${formatList(skillGroups.backEnd)}`,
          followUps: [{ label: 'Front-end', prompt: 'What front-end skills do you use?' }, { label: 'Experience', prompt: 'Tell me about your experience.' }],
          topic: 'skills'
        }
      }
      return {
        text: `Here is a snapshot of Ferdinand's core technical stack and skills:\n\n${formatList(siteFacts.skills)}\n\nHe has 16+ years of experience across Front-End, Back-End, UI/UX Design, and AI-assisted workflows.`,
        followUps: [
          { label: 'Front-end', prompt: 'What front-end skills do you use?' },
          { label: 'Back-end', prompt: 'What back-end skills do you use?' },
          { label: 'Certificates', prompt: 'What certificates do you have?' }
        ],
        topic: 'skills'
      }
    }

    // Experience & Work History
    if (wantsExperience) {
      return {
        text: `Here is Ferdinand's career experience and work history from the website:\n\n${formatList(siteFacts.experience)}\n\nHe has over 16 years of professional industry experience across global enterprises and digital agencies.`,
        followUps: [
          { label: 'Websites & Projects', prompt: 'What websites have you worked with?' },
          { label: 'Services', prompt: 'What services do you offer?' },
          { label: 'Certificates', prompt: 'What certificates do you have?' }
        ],
        topic: 'experience'
      }
    }

    // Contact Information
    if (wantsContact) {
      return {
        text: `You can reach Ferdinand directly:\n- Email: ${siteFacts.contact.email}\n- Phone: ${siteFacts.contact.phone}\n- Location: ${siteFacts.location}\n- GitHub: ${siteFacts.contact.github}\n- LinkedIn: ${siteFacts.contact.linkedin}\n- Instagram: ${siteFacts.contact.instagram}`,
        followUps: [
          { label: 'Services', prompt: 'What services do you offer?' },
          { label: 'Websites & Projects', prompt: 'What projects have you worked on?' },
          { label: 'Certificates', prompt: 'What certificates do you have?' }
        ],
        topic: 'contact'
      }
    }

    // Education & Academic Background
    if (wantsEducation) {
      return {
        text: `Ferdinand holds a **${siteFacts.education}** degree and has over 16 years of professional industry experience.`,
        followUps: [
          { label: 'Certificates', prompt: 'What certificates do you have?' },
          { label: 'Experience', prompt: 'Tell me about your experience.' },
          { label: 'Skills', prompt: 'What are your skills?' }
        ],
        topic: 'education'
      }
    }

    // AI Tools
    if (wantsAI) {
      return {
        text: `Ferdinand actively uses modern AI-assisted engineering tools:\n\n${formatList(siteFacts.aiTools)}\n\nHe also holds verified AI certificates from OpenAI and Anthropic!`,
        followUps: [
          { label: 'OpenAI Cert', prompt: 'Tell me about the OpenAI certificate' },
          { label: 'Anthropic Cert', prompt: 'Tell me about the Anthropic certificate' },
          { label: 'Skills', prompt: 'What are your skills?' }
        ],
        topic: 'ai'
      }
    }

    // About / Biography
    if (wantsAbout) {
      return {
        text: `${siteFacts.name}, also known as **${siteFacts.alias}**, is a ${siteFacts.title} based in ${siteFacts.location}. He has ${siteFacts.experienceYears} of experience combining technical expertise, creative design, and AI-powered development.`,
        followUps: [
          { label: 'Certificates', prompt: 'What certificates do you have?' },
          { label: 'Hobbies & Interests', prompt: 'What are your hobbies and interests?' },
          { label: 'Skills', prompt: 'What are your skills?' }
        ],
        topic: 'about'
      }
    }

    // Website structure
    if (has(/\b(this website|about this site|site sections|page sections)\b/)) {
      return {
        text: `This website is Ferdinand Estoque's portfolio, showcasing his About, Experience, Tech Stack, Projects, Certificates, Hobbies & Interests, Services, Testimonials, and Contact sections.`,
        followUps: defaultPrompts,
        topic: 'website'
      }
    }

    // Fallback: When information is NOT available on the website
    return {
      text: `I could not find that information on Ferdinand Estoque's website. I can only provide details based on the website's published content, such as his certificates, hobbies, interests, websites and projects, services and expertise, skills, experience, education, and contact details.`,
      followUps: defaultPrompts,
      topic: 'unknown'
    }
  }

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim()
    if (!text || isTyping) return

    const userMsg: ChatMessage = { role: 'user', text, time: nowLabel() }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    const delay = Math.min(900, 320 + Math.sqrt(text.length) * 40)
    setTimeout(() => {
      const reply = answerFromRules(text)
      const botMsg: ChatMessage = { role: 'bot', text: reply.text, time: nowLabel(), topic: reply.topic }
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
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setIsOpen(false)
    }
  }

  const handleCopy = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    const originalContent = btn.innerHTML
    const markCopied = () => {
      btn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i> Copied'
      setTimeout(() => {
        btn.innerHTML = originalContent
      }, 1600)
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(markCopied).catch(markCopied)
    } else {
      markCopied()
    }
  }

  const clearChat = () => {
    const clearMsg: ChatMessage = {
      role: 'bot',
      text: `Conversation cleared. What would you like to know about Ferdinand's certificates, hobbies, interests, websites, projects, services, or skills?`,
      time: nowLabel(),
      topic: 'general'
    }
    setMessages([clearMsg])
    setPrompts(defaultPrompts)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([clearMsg]))
    } catch (_) {}
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
                onClick={clearChat}
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
              <div id="ask-anything-messages" className="ask-anything-panel__messages" role="log" aria-live="polite">
                {messages.map((msg, idx) => {
                  const isNew = idx === messages.length - 1 && msg.role === 'bot' && !isTyping
                  return (
                    <article key={idx} className={`ask-anything-message ask-anything-message--${msg.role} ${isNew ? 'is-new' : ''}`}>
                      {msg.role === 'bot' ? (
                        <>
                          <div
                            className="ask-anything-message__bubble"
                            dangerouslySetInnerHTML={{ __html: renderBotHtml(msg.text) }}
                          />
                          <span className="ask-anything-message__meta">Assistant • {msg.time}</span>
                          <button
                            type="button"
                            className="ask-anything-message__copy"
                            onClick={(e) => handleCopy(msg.text, e)}
                            aria-label="Copy message"
                          >
                            <i className="bi bi-clipboard" aria-hidden="true"></i> Copy
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="ask-anything-message__bubble">{msg.text}</div>
                          <span className="ask-anything-message__meta">You • {msg.time}</span>
                        </>
                      )}
                    </article>
                  )
                })}
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
                    placeholder="Ask about certificates, hobbies, projects..."
                    aria-label="Type your question"
                  />
                  <span
                    id="ask-anything-char-count"
                    className={`ask-anything-panel__char-count ${inputText.length > 250 ? 'is-near-limit' : ''}`}
                  >
                    {280 - inputText.length}
                  </span>
                </div>
                <button id="ask-anything-send" type="submit" disabled={!inputText.trim()} aria-label="Send message">
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
