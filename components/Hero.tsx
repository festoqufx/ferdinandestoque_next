'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const isHoveredRef = useRef<boolean>(false)
  const touchStartXRef = useRef<number>(0)
  const wrapTextRef = useRef<HTMLDivElement>(null)
  const totalSlides = 3

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // Auto-advance carousel every 5000ms, paused on hover
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        nextSlide()
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [nextSlide])

  // Keyboard navigation for hero carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevSlide, nextSlide])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  // Rotating text engine for Slide 1
  useEffect(() => {
    const words = document.querySelectorAll<HTMLElement>('.word_rt')
    if (words.length === 0) return

    words.forEach((word) => {
      if (word.querySelector('.letter')) return
      const text = word.textContent || ''
      word.textContent = ''
      const letters = text.split('')
      letters.forEach((letter) => {
        const span = document.createElement('span')
        span.textContent = letter
        span.className = 'letter'
        word.append(span)
      })
    })

    let currentWordIndex = 0
    const maxWordIndex = words.length - 1

    words[0].style.opacity = '1'

    const rotateText = () => {
      if (words.length === 0) return
      const currentWord = words[currentWordIndex]
      const nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1]

      // Rotate out letters of current word
      Array.from(currentWord.children as HTMLCollectionOf<HTMLElement>).forEach((letter, i) => {
        setTimeout(() => {
          letter.className = 'letter out'
        }, i * 80)
      })

      // Reveal and rotate in letters of next word
      nextWord.style.opacity = '1'
      Array.from(nextWord.children as HTMLCollectionOf<HTMLElement>).forEach((letter, i) => {
        letter.className = 'letter behind'
        setTimeout(() => {
          letter.className = 'letter in'
        }, 340 + i * 80)
      })

      currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1
    }

    rotateText()
    const interval = setInterval(rotateText, 4000)

    return () => clearInterval(interval)
  }, [])

  // 3D Perspective Parallax for class="wrap_text" on Slide 2
  useEffect(() => {
    const wrapContainer = wrapTextRef.current
    if (!wrapContainer) return

    const textElements = Array.from(wrapContainer.querySelectorAll<HTMLElement>('.text'))
    if (!textElements.length) return

    const coarseQuery = window.matchMedia('(pointer: coarse)')
    let halfX = window.innerWidth / 2
    let halfY = window.innerHeight / 2

    const isCoarse = () => coarseQuery.matches || window.innerWidth <= 991

    const parallaxFactor = () => {
      if (window.innerWidth <= 575) return 0.004
      if (window.innerWidth <= 991) return 0.006
      return 0.01
    }

    const layerOffset = (i: number) => {
      if (!isCoarse()) return { x: 0, y: 0 }
      const step = window.innerWidth <= 400 ? 0.8 : 1.15
      return { x: i * step, y: i * step * 1.85 }
    }

    const restPose = (el: HTMLElement, i: number, duration?: number) => {
      const offset = layerOffset(i)
      const z = 1 * (i + 8)
      el.style.transition = duration
        ? `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        : 'none'
      el.style.transform = `translate3d(calc(-50% + ${offset.x}px), ${offset.y}px, ${z}px)`
    }

    // Initialize all 10 text layers
    textElements.forEach((el, i) => restPose(el, i, 1))

    const handleResize = () => {
      halfX = window.innerWidth / 2
      halfY = window.innerHeight / 2
      textElements.forEach((el, i) => restPose(el, i, 0.35))
    }

    let rafId: number | null = null
    const handleMouseMove = (e: MouseEvent) => {
      if (isCoarse()) return
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const factor = parallaxFactor()
        const dx = e.clientX - halfX
        const dy = e.clientY - halfY
        textElements.forEach((el, i) => {
          const x = dx * (i + 1) * factor
          const y = dy * (i + 1) * factor
          const z = 1 * (i + 8)
          el.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px, ${z}px)`
        })
      })
    }

    const handleMouseLeave = () => {
      if (isCoarse()) return
      textElements.forEach((el, i) => restPose(el, i, 0.5))
    }

    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [currentSlide])

  // Canvas animation for mouse pointer
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    if (!canvas || !canvas.getContext) return

    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      canvas.style.display = 'none'
      return
    }

    const raf =
      window.requestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame
    const caf = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
    let rAF: any
    const renderCtx = canvas.getContext('2d')!

    let W: number, H: number
    const particles: any[] = []
    let mx = 0,
      my = 0,
      mActive = false
    let hue = 0

    const cfg = {
      total: 15,
      speed: 0.12,
      size: 28,
      glow: true,
      trail: false,
      color: 'white',
    }

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function colorOf(id: number) {
      const t = id / cfg.total,
        a = 1 - t * 0.55
      switch (cfg.color) {
        case 'rainbow':
          return `hsla(${(hue + id * 22) % 360},100%,65%,${a})`
        case 'fire':
          return `rgba(255,${Math.round(180 * (1 - t))},0,${a})`
        case 'ice':
          return `rgba(${Math.round(140 * (1 - t))},${Math.round(200 + 55 * (1 - t))},255,${a})`
        case 'gold':
          return `rgba(255,${Math.round(215 - 120 * t)},0,${a})`
        default:
          return `rgba(255,255,255,${a})`
      }
    }

    class Particle {
      id: number
      x: number
      y: number
      ax: number
      ay: number
      sx: number
      sy: number
      orbit: number

      constructor(i: number) {
        this.id = i + 1
        this.x = -50
        this.y = window.innerHeight
        this.ax = Math.PI * 2 * Math.random()
        this.ay = Math.PI * 2 * Math.random()
        this.sx = 0.03 * Math.random() + 0.03
        this.sy = 0.03 * Math.random() + 0.03
        this.orbit = 160
      }

      update() {
        let dx = 0,
          dy = 0
        if (this.id > 1) {
          const prev = particles[this.id - 2]
          dx = prev.x - this.x
          dy = prev.y - this.y
          this.x += dx * cfg.speed
          this.y += dy * cfg.speed
        } else if (!mActive) {
          this.x = W / 2 + Math.cos(this.ax) * this.orbit
          this.y = H / 2 + Math.sin(this.ay) * this.orbit
          this.ax += this.sx
          this.ay += this.sy
        } else {
          dx = mx - this.x
          dy = my - this.y
          this.x += dx * cfg.speed
          this.y += dy * cfg.speed
        }
        const angle = Math.atan2(dy, dx)
        const scale = Math.cos((Math.PI / 2) * (this.id / cfg.total))
        const color = colorOf(this.id)
        const s = cfg.size
        renderCtx.save()
        renderCtx.globalAlpha = 1 - (this.id / cfg.total) * 0.55
        if (cfg.glow) {
          renderCtx.shadowBlur = 18
          renderCtx.shadowColor = color
        }
        renderCtx.translate(this.x, this.y)
        renderCtx.rotate(angle)
        renderCtx.scale(scale, scale)
        renderCtx.beginPath()
        renderCtx.moveTo(-s * 0.866, -s * 0.5)
        renderCtx.lineTo(0, 0)
        renderCtx.lineTo(-s * 0.866, s * 0.5)
        renderCtx.lineTo(-s * 0.6, 0)
        renderCtx.closePath()
        renderCtx.fillStyle = color
        renderCtx.fill()
        renderCtx.strokeStyle = 'rgba(0,0,0,0.25)'
        renderCtx.lineWidth = 0.8 / Math.abs(scale || 1)
        renderCtx.stroke()
        renderCtx.restore()
      }
    }

    const init = () => {
      caf(rAF)
      resize()
      particles.length = 0
      for (let i = 0; i < cfg.total; i++) particles.push(new Particle(i))
      draw()
    }

    const draw = () => {
      if (cfg.trail) {
        renderCtx.fillStyle = 'rgba(0,0,0,0.15)'
        renderCtx.fillRect(0, 0, W, H)
      } else {
        renderCtx.clearRect(0, 0, W, H)
      }
      hue = (hue + 1) % 360
      for (let i = 0; i < cfg.total; i++) {
        if (particles[i]) particles[i].update()
      }
      rAF = raf(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      mActive = true
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', resize, { passive: true })

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init).catch(() => init())
    } else {
      init()
    }

    return () => {
      caf(rAF)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="hero">
      <canvas id="canvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}></canvas>
      <div className="hero-container">
        <div
          id="heroCarousel"
          data-bs-interval="5000"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          onMouseEnter={() => {
            isHoveredRef.current = true
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Indicators */}
          <ol className="carousel-indicators" id="hero-carousel-indicators">
            {[0, 1, 2].map((idx) => (
              <li
                key={idx}
                data-bs-target="#heroCarousel"
                data-bs-slide-to={idx}
                className={currentSlide === idx ? 'active' : ''}
                role="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </ol>

          <div className="carousel-inner" role="listbox">
            {/* Slide 1 */}
            <div
              className={`carousel-item ${currentSlide === 0 ? 'active' : ''}`}
              style={{ backgroundImage: 'url(/assets/img/slide/slide-1.jpg)' }}
            >
              <div className="carousel-container">
                <div className="carousel-content">
                  <div
                    className="pc-lottie-container"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: '15px auto 3px auto',
                      width: '100%',
                      maxWidth: '500px',
                    }}
                  >
                    <img
                      src="/assets/img/SVG/PCv1.svg"
                      className="pc-anim-svg"
                      alt="PC Animation"
                      width="500"
                      height="505"
                      style={{ width: '500px', maxWidth: '100%', height: 'auto' }}
                    />
                    <lottie-player
                      autoPlay
                      loop
                      mode="normal"
                      background="transparent"
                      style={{ display: 'none', width: '500px', height: 'auto' }}
                    ></lottie-player>
                  </div>
                  <p>&nbsp;</p>
                  <h2 className="h2_half text-center">
                    FERDINAND ESTOQUE
                    <span className="span_half">FERDINAND ESTOQUE</span>
                    <span className="span_half">FERDINAND ESTOQUE</span>
                    <span className="span_half">BLACK RAVEN</span>
                  </h2>
                  <p>&nbsp;</p>
                  <div className="middle">
                    <div className="rotating-text">
                      <p>
                        <span className="word_rt alizarin">FRONT-END&nbsp;DEVELOPMENT</span>
                        <span className="word_rt alizarin">BACK-END&nbsp;DEVELOPMENT</span>
                        <span className="word_rt alizarin">BRANDING</span>
                        <span className="word_rt alizarin">REBRANDING</span>
                        <span className="word_rt alizarin">MOTION&nbsp;and&nbsp;GRAPHIC&nbsp;DESIGN</span>
                        <span className="word_rt alizarin">WEB&nbsp;MAINTENANCE</span>
                        <span className="word_rt alizarin">WEB&nbsp;CONSULTING</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div
              className={`carousel-item ${currentSlide === 1 ? 'active' : ''}`}
              style={{ backgroundColor: 'black' }}
            >
              <div className="carousel-container">
                <div className="carousel-content">
                  <div
                    className="pc-lottie-container"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: '5px auto 30px',
                      width: '100%',
                      maxWidth: '700px',
                    }}
                  >
                    <img
                      src="/assets/img/SVG/code.svg"
                      className="pc-anim-svg"
                      alt="PC Animation"
                      width="500"
                      height="500"
                      style={{ width: '700px', maxWidth: '100%', height: 'auto' }}
                    />
                    <lottie-player
                      autoPlay
                      loop
                      mode="normal"
                      background="transparent"
                      style={{ display: 'none', width: '700px', height: 'auto' }}
                    ></lottie-player>
                  </div>
                  <div ref={wrapTextRef} className="wrap_text">
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                    <div className="text">BLACK RAVEN</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div
              className={`carousel-item ${currentSlide === 2 ? 'active' : ''}`}
              style={{ backgroundImage: 'url(/assets/img/slide/slide-3.jpg)' }}
            >
              <div className="carousel-container">
                <div className="carousel-content">
                  <div className="center" style={{ margin: '0 auto' }}>
                    <p>click me</p>
                    <a
                      id="blackred"
                      href="https://raven-cuve-website-portfolio.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span data-attr="BLACK">BLACK</span>
                      <span data-attr="RAVEN">RAVEN</span>
                    </a>
                    <p>&nbsp;</p>
                    <div className="container_text">
                      <div className="text_text">
                        <span style={{ '--i': 1 } as React.CSSProperties}>w</span>
                        <span style={{ '--i': 2 } as React.CSSProperties}>w</span>
                        <span style={{ '--i': 3 } as React.CSSProperties}>w</span>
                        <span style={{ '--i': 4 } as React.CSSProperties}>.</span>
                        <span style={{ '--i': 5 } as React.CSSProperties}>f</span>
                        <span style={{ '--i': 6 } as React.CSSProperties}>e</span>
                        <span style={{ '--i': 7 } as React.CSSProperties}>r</span>
                        <span style={{ '--i': 8 } as React.CSSProperties}>d</span>
                        <span style={{ '--i': 9 } as React.CSSProperties}>i</span>
                        <span style={{ '--i': 10 } as React.CSSProperties}>n</span>
                        <span style={{ '--i': 11 } as React.CSSProperties}>a</span>
                        <span style={{ '--i': 12 } as React.CSSProperties}>n</span>
                        <span style={{ '--i': 13 } as React.CSSProperties}>d</span>
                        <span style={{ '--i': 14 } as React.CSSProperties}>e</span>
                        <span style={{ '--i': 15 } as React.CSSProperties}>s</span>
                        <span style={{ '--i': 16 } as React.CSSProperties}>t</span>
                        <span style={{ '--i': 17 } as React.CSSProperties}>o</span>
                        <span style={{ '--i': 18 } as React.CSSProperties}>q</span>
                        <span style={{ '--i': 19 } as React.CSSProperties}>u</span>
                        <span style={{ '--i': 20 } as React.CSSProperties}>e</span>
                        <span style={{ '--i': 21 } as React.CSSProperties}>.</span>
                        <span style={{ '--i': 22 } as React.CSSProperties}>c</span>
                        <span style={{ '--i': 23 } as React.CSSProperties}>o</span>
                        <span style={{ '--i': 24 } as React.CSSProperties}>m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <a
            className="carousel-control-prev"
            href="#heroCarousel"
            role="button"
            aria-label="Previous slide"
            onClick={(e) => {
              e.preventDefault()
              prevSlide()
            }}
          >
            <span className="carousel-control-prev-icon bi bi-chevron-double-left" aria-hidden="true"></span>
          </a>
          <a
            className="carousel-control-next"
            href="#heroCarousel"
            role="button"
            aria-label="Next slide"
            onClick={(e) => {
              e.preventDefault()
              nextSlide()
            }}
          >
            <span className="carousel-control-next-icon bi bi-chevron-double-right" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </section>
  )
}
