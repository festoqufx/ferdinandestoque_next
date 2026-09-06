'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Hobbies from './Hobbies'

interface Certificate {
  title: string
  logo: string
  alt: string
  url: string
  desc: string
}

const certificates: Certificate[] = [
  {
    title: 'AI Foundations',
    logo: '/assets/img/certificates/openai.jpg',
    alt: 'OpenAI',
    url: 'https://academy.openai.com/home/certificate/u77flalmmn',
    desc: 'This OpenAI certificate validates foundational AI knowledge and practical understanding of AI concepts.'
  },
  {
    title: 'Introduction to Cybersecurity Awareness',
    logo: '/assets/img/certificates/hp.jpg',
    alt: 'HP',
    url: 'https://www.life-global.org/certificate/78f4c7bc-0144-428d-b48e-da9d56424494',
    desc: 'This HP certificate validates foundational cybersecurity awareness and knowledge of online safety practices.'
  },
  {
    title: 'ITIL V4 certificate',
    logo: '/assets/img/certificates/simplilearn.jpg',
    alt: 'Simplilearn',
    url: 'https://simpli-web.app.link/e/nIHO6LMkU5b',
    desc: 'This SimpliLearn certificate validates knowledge of ITIL 4 practices for effective IT service management and delivery.'
  },
  {
    title: 'Azure Fundamentals',
    logo: '/assets/img/certificates/microsoft.jpg',
    alt: 'Microsoft',
    url: 'https://simpli-web.app.link/e/4k1LYawGU5b',
    desc: 'This SimpliLearn certificate validates foundational knowledge of Azure cloud services and core cloud computing concepts.'
  },
  {
    title: 'AI for Business Professionals',
    logo: '/assets/img/certificates/hp.jpg',
    alt: 'HP',
    url: 'https://www.life-global.org/certificate/a9de57e0-d363-4326-911a-d41b40a0311d',
    desc: 'This HP certificate demonstrates foundational AI knowledge and its practical use in business.'
  },
  {
    title: 'Anthropic Claude 101',
    logo: '/assets/img/certificates/anthropic.jpg',
    alt: 'Anthropic',
    url: 'https://verify.skilljar.com/c/tadt9xixkhts',
    desc: 'This Anthropic certificate validates foundational knowledge of Claude and its practical use in AI-assisted work.'
  }
]

export default function Certificates() {
  const [currentActive, setCurrentActive] = useState<number>(0)
  const [prevActive, setPrevActive] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartPosRef = useRef<number>(0)
  const isHoveredRef = useRef<boolean>(false)

  const TESTIM_SPEED = 4500
  const IGNORE_TOUCH = 30

  // Play slide transition with proper active and inactive CSS animation classes
  const playSlide = useCallback((targetIndex: number) => {
    let nextIndex = targetIndex
    if (nextIndex < 0) {
      nextIndex = certificates.length - 1
    } else if (nextIndex >= certificates.length) {
      nextIndex = 0
    }

    setCurrentActive((prevCurrent) => {
      if (prevCurrent !== nextIndex) {
        setPrevActive(prevCurrent)
      }
      return nextIndex
    })
  }, [])

  // Auto-rotation timer handler
  const queueNext = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (typeof document !== 'undefined' && document.hidden) return
    if (isHoveredRef.current) return

    timerRef.current = setTimeout(() => {
      playSlide(currentActive + 1)
    }, TESTIM_SPEED)
  }, [currentActive, playSlide])

  // Navigation handlers
  const handlePrev = useCallback(() => {
    playSlide(currentActive - 1)
  }, [currentActive, playSlide])

  const handleNext = useCallback(() => {
    playSlide(currentActive + 1)
  }, [currentActive, playSlide])

  const handleDotClick = useCallback((index: number) => {
    playSlide(index)
  }, [playSlide])

  // Manage auto-rotation timer lifecycle & tab visibility
  useEffect(() => {
    queueNext()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
      } else {
        queueNext()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [queueNext])

  // Keyboard navigation (ArrowLeft and ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is inside an input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase()
      if (activeTag === 'input' || activeTag === 'textarea') return

      if (e.key === 'ArrowLeft' || e.keyCode === 37) {
        const testimEl = document.getElementById('testim_v15')
        if (testimEl) {
          const rect = testimEl.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            handlePrev()
          }
        }
      } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
        const testimEl = document.getElementById('testim_v15')
        if (testimEl) {
          const rect = testimEl.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            handleNext()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handlePrev, handleNext])

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPosRef.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndPos = e.changedTouches[0].clientX
    const touchPosDiff = touchStartPosRef.current - touchEndPos

    if (touchPosDiff > IGNORE_TOUCH) {
      handleNext()
    } else if (touchPosDiff < -IGNORE_TOUCH) {
      handlePrev()
    }
  }

  // Hover pause handling
  const handleMouseEnter = () => {
    isHoveredRef.current = true
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    queueNext()
  }

  return (
    <section id="TIMELINE" className="TIMELINE section-bg">
      <div className="height_divider_1"></div>
      <div className="container">
        <div className="section-title">
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                CERTIFICATES <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden className="Title__filled">CERTIFICATES</div>
            </div>
          </div>
          <div className="height_divider_1"></div>

          {/* Certificates Slider / Carousel (id="testim_v15" class="testim_v15") */}
          <div className="row">
            <section
              id="testim_v15"
              className="testim_v15"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="wrap_v15">
                <span
                  id="right-arrow_v15"
                  className="arrow_v15 right_v15 fa fa-chevron-right"
                  onClick={handleNext}
                  role="button"
                  tabIndex={0}
                  aria-label="Next certificate"
                ></span>
                <span
                  id="left-arrow_v15"
                  className="arrow_v15 left_v15 fa fa-chevron-left"
                  onClick={handlePrev}
                  role="button"
                  tabIndex={0}
                  aria-label="Previous certificate"
                ></span>

                <ul id="testim-dots_v15" className="dots_v15">
                  {certificates.map((cert, i) => (
                    <li
                      key={cert.title}
                      className={`dot_v15 ${i === currentActive ? 'testim-active_v15' : ''}`}
                      onClick={() => handleDotClick(i)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Go to certificate ${i + 1}: ${cert.title}`}
                    ></li>
                  ))}
                </ul>

                <div id="testim-content_v15" className="cont_v15">
                  {certificates.map((cert, i) => {
                    let statusClass = ''
                    if (i === currentActive) {
                      statusClass = 'testim-active_v15'
                    } else if (i === prevActive && prevActive !== null) {
                      statusClass = 'testim-inactive_v15'
                    }

                    return (
                      <div key={cert.title} className={statusClass}>
                        <div className="testim-logo_v15">
                          <img
                            src={cert.logo}
                            alt={cert.alt}
                            width="100"
                            height="100"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <a href={cert.url} target="_blank" rel="noopener noreferrer">
                          <h2>{cert.title}</h2>
                          <p>{cert.desc}</p>
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Hobbies and interests */}
          <Hobbies />
        </div>
      </div>
    </section>
  )
}
