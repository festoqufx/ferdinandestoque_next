'use client'

import { useEffect, useState, useRef } from 'react'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [viewerCount, setViewerCount] = useState<number>(1)

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState<string>('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsletterError, setNewsletterError] = useState<string>('')
  const [newsletterSuccess, setNewsletterSuccess] = useState<string>('')
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())

    // Presence count loader/poller from presence API if available or simulated
    const fetchPresence = async () => {
      try {
        let res = await fetch('/api/presence')
        if (!res.ok) {
          res = await fetch('/api/presence.php')
        }
        if (res.ok) {
          const data = await res.json()
          if (data && (typeof data.viewers === 'number' || typeof data.count === 'number')) {
            setViewerCount(data.viewers ?? data.count ?? 1)
          }
        }
      } catch {
        // Fallback default
        setViewerCount((prev) => (prev > 0 ? prev : 1))
      }
    }

    fetchPresence()
    const interval = setInterval(fetchPresence, 30000)
    return () => clearInterval(interval)
  }, [])

  const validateEmail = (val: string): string => {
    const trimmed = val.trim()
    if (!trimmed) {
      return 'Email address is required.'
    }
    if (trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
      return 'Please enter a valid email address (e.g. name@example.com).'
    }
    return ''
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNewsletterEmail(val)
    if (newsletterStatus === 'error') {
      const err = validateEmail(val)
      if (!err) {
        setNewsletterStatus('idle')
        setNewsletterError('')
      } else {
        setNewsletterError(err)
      }
    }
  }

  const handleEmailBlur = () => {
    if (newsletterEmail.trim() && newsletterStatus !== 'success') {
      const err = validateEmail(newsletterEmail)
      if (err) {
        setNewsletterStatus('error')
        setNewsletterError(err)
      }
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const err = validateEmail(newsletterEmail)
    if (err) {
      setNewsletterStatus('error')
      setNewsletterError(err)
      emailInputRef.current?.focus()
      return
    }

    setNewsletterStatus('loading')
    setNewsletterError('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data?.success) {
        setNewsletterStatus('success')
        setNewsletterSuccess(data?.message || 'Thank you for subscribing to my newsletter!')
        setNewsletterEmail('')
      } else {
        setNewsletterStatus('error')
        setNewsletterError(data?.error || 'Subscription failed. Please try again or contact me directly.')
        emailInputRef.current?.focus()
      }
    } catch {
      setNewsletterStatus('error')
      setNewsletterError('Network error. Please check your connection and try again.')
      emailInputRef.current?.focus()
    }
  }

  const handleResetNewsletter = () => {
    setNewsletterStatus('idle')
    setNewsletterError('')
    setNewsletterSuccess('')
    setNewsletterEmail('')
    setTimeout(() => emailInputRef.current?.focus(), 50)
  }

  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-info">
                <main className="main-container_v1">
                  <svg className="svg-container_v1">
                    <defs>
                      <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                          <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                          <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                          <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                          <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>
                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
                        <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
                      </filter>
                    </defs>
                  </svg>
                  <div className="card-container_v1">
                    <div className="inner-container_v1">
                      <div className="border-outer">
                        <div className="main-card_v1"></div>
                      </div>
                      <div className="glow-layer-1"></div>
                      <div className="glow-layer-2"></div>
                    </div>
                    <div className="overlay-1_v1"></div>
                    <div className="overlay-2_v1"></div>
                    <div className="background-glow"></div>
                    <div className="content-container_v1">
                      <div className="content-top"></div>
                      <h3 style={{ color: 'azure' }}>Ferdinand Estoque</h3>
                      <p>
                        Imus Cavite <br /> Philippines <br />
                        <br />
                        <strong>Phone:</strong>
                      </p>
                      <p>
                        <a href="tel:+639958143127">+63 995 814 3127</a>
                      </p>
                      <p>
                        <strong>Email:</strong> ferdinand.estoque@yahoo.com <br />
                      </p>
                      <br />
                      <p className="pb-3">
                        <em>Follow me around the web</em>
                      </p>
                      <hr className="divider_v1" />
                      <div className="social-links mt-3">
                        <a href="https://github.com/festoqufx" target="_blank" rel="noopener noreferrer" className="github">
                          <i className="bi bi-github"></i>
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="facebook">
                          <i className="bi bi-facebook"></i>
                        </a>
                        <a href="https://www.instagram.com/ravenom_007" className="instagram" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/ferdinand-estoque-46797876" target="_blank" rel="noopener noreferrer" className="linkedin">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
              <br />
              <br />
            </div>
            <div className="col-lg-2 col-md-6 footer-links">
              <div>
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#About">About</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#services">Services</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#portfolio">Gallery</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#github">GitHub</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#testimonials">Testimonials</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 footer-links">
              <h4>Services</h4>
              <ul>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">Web Design</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">Web Development</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">Print Design</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">Marketing</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">Graphic Design</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">CMS Integration</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>
                  <a href="#services">Web Maintenance</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6 justify-content-center footer-newsletter">
              <h4>Newsletter</h4>
              <p style={{ color: '#ffffff', fontSize: '14px', margin: '10px 0 0 0', lineHeight: 1.5 }}>
                Subscribe to get updates on new projects, tech articles, and creative work.
              </p>

              {newsletterStatus === 'success' ? (
                <div
                  className="newsletter-success-box"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="d-flex align-items-center mb-1">
                    <i className="bi bi-check-circle-fill" style={{ color: '#00c853', fontSize: '18px', marginRight: '8px' }}></i>
                    <strong style={{ color: '#ffffff', fontSize: '14px' }}>Subscribed!</strong>
                  </div>
                  <p style={{ color: '#e0e0e0', fontSize: '13px', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
                    {newsletterSuccess}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetNewsletter}
                    className="newsletter-reset-btn"
                  >
                    Subscribe another email
                  </button>
                </div>
              ) : (
                <>
                  <form
                    action=""
                    method="post"
                    onSubmit={handleNewsletterSubmit}
                    noValidate
                    className={newsletterStatus === 'error' ? 'has-error' : ''}
                  >
                    <input
                      ref={emailInputRef}
                      type="email"
                      name="email"
                      placeholder="Your email"
                      value={newsletterEmail}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      disabled={newsletterStatus === 'loading'}
                      required
                      aria-label="Your email address"
                      aria-required="true"
                      aria-invalid={newsletterStatus === 'error'}
                      aria-describedby={newsletterStatus === 'error' ? 'newsletter-error-msg' : undefined}
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      aria-label={newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    >
                      {newsletterStatus === 'loading' ? (
                        <span className="d-inline-flex align-items-center justify-content-center gap-1">
                          <span className="newsletter-spinner" aria-hidden="true"></span>
                        </span>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>

                  {newsletterStatus === 'error' && newsletterError && (
                    <div
                      id="newsletter-error-msg"
                      className="newsletter-error-box"
                      role="alert"
                      aria-live="assertive"
                    >
                      <i className="bi bi-exclamation-circle-fill" style={{ marginRight: '6px', color: '#ff4d4f' }}></i>
                      <span>{newsletterError}</span>
                    </div>
                  )}
                </>
              )}

              <br />
              <br />
              <br />
              <span className="text-center justify-content-center" style={{ display: 'flex' }}>
                <img
                  className="image-style_v1 animation-rotateIn_v1"
                  src="/assets/img/logo2.png"
                  alt="RAVENOM"
                  width="81"
                  height="81"
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-lg-6 text-lg-start">
              <div className="viewers" aria-live="polite">
                <span className="viewers__skeleton" aria-hidden="true">
                  <span className="viewers__skeleton-dot"></span>
                  <span className="viewers__skeleton-bar"></span>
                </span>
                <span className="viewers__live">
                  <span className="presence-dot" aria-hidden="true"></span>
                  <b className="presence-num" id="viewerCount">{viewerCount}</b>
                  <span className="viewers__label" style={{ color: '#ffffff', marginLeft: '6px' }}>person viewing now</span>
                </span>
              </div>
            </div>
            <div className="col-lg-6 text-lg-end">
              <span>{currentYear}</span>&nbsp;&copy;&nbsp;FERDINAND&nbsp;ESTOQUE. All&nbsp;Rights&nbsp;Reserved
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        #footer .footer-top .footer-newsletter form {
          margin-top: 20px;
          background: #fff;
          padding: 6px 10px;
          position: relative;
          border-radius: 4px;
          transition: box-shadow 0.2s ease;
        }

        #footer .footer-top .footer-newsletter form.has-error {
          box-shadow: 0 0 0 2px #ff4d4f;
        }

        #footer .footer-top .footer-newsletter form input[type='email'] {
          border: 0;
          padding: 4px;
          width: calc(100% - 110px);
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          outline: none;
          color: #222;
        }

        #footer .footer-top .footer-newsletter form input[type='email']:disabled {
          background: #f5f5f5;
          color: #888;
        }

        #footer .footer-top .footer-newsletter form button[type='submit'] {
          position: absolute;
          top: 0;
          right: -2px;
          bottom: 0;
          border: 0;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          padding: 0 20px;
          background: #000000;
          color: #fff;
          transition: background 0.3s ease;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #footer .footer-top .footer-newsletter form button[type='submit']:hover:not(:disabled) {
          background: #ff0019;
        }

        #footer .footer-top .footer-newsletter form button[type='submit']:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          background: #333333;
        }

        .newsletter-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: nlSpin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes nlSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .newsletter-error-box {
          margin-top: 8px;
          color: #ff6b6b;
          font-size: 13px;
          display: flex;
          align-items: center;
          background: rgba(255, 77, 79, 0.1);
          border: 1px solid rgba(255, 77, 79, 0.3);
          padding: 6px 12px;
          border-radius: 4px;
          font-family: 'Lato', sans-serif;
          animation: nlFadeIn 0.2s ease;
        }

        .newsletter-success-box {
          margin-top: 20px;
          background: rgb(200 0 0 / 12%);
          border: 1px solid rgb(200 0 0 / 40%);
          padding: 14px 16px;
          border-radius: 4px;
          font-family: 'Lato', sans-serif;
          animation: nlFadeIn 0.25s ease;
        }

        .newsletter-reset-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Lato', sans-serif;
        }

        .newsletter-reset-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #ffffff;
        }

        @keyframes nlFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 575px) {
          #footer .footer-top .footer-newsletter form input[type='email'] {
            width: calc(100% - 100px);
            font-size: 13px;
          }

          #footer .footer-top .footer-newsletter form button[type='submit'] {
            padding: 0 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </footer>
  )
}
