'use client'

import { useEffect, useState } from 'react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [viewerCount, setViewerCount] = useState<number>(1)

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
              <form action="" method="post" onSubmit={(e) => e.preventDefault()}>
                <input type="email" name="email" placeholder="Your email" />
                <input type="submit" value="Subscribe" />
              </form>
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
    </footer>
  )
}
