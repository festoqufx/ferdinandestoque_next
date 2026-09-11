'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface SlideItem {
  id: number
  src: string
  alt: string
}

const rawSlides: SlideItem[] = [
  { id: 1, src: '/assets/img/site/1.jpg', alt: 'Website 1' },
  { id: 2, src: '/assets/img/site/2.jpg', alt: 'Website 2' },
  { id: 3, src: '/assets/img/site/3.jpg', alt: 'Website 3' },
  { id: 4, src: '/assets/img/site/4.jpg', alt: 'Website 4' },
  { id: 5, src: '/assets/img/site/5.jpg', alt: 'Website 5' },
  { id: 6, src: '/assets/img/site/6.jpg', alt: 'Website 6' },
  { id: 7, src: '/assets/img/site/7.jpg', alt: 'Website 7' },
  { id: 8, src: '/assets/img/site/8.jpg', alt: 'Website 8' },
  { id: 9, src: '/assets/img/site/9.jpg', alt: 'Website 9' },
  { id: 10, src: '/assets/img/site/10.jpg', alt: 'Website 10' },
  { id: 11, src: '/assets/img/site/11.jpg', alt: 'Website 11' },
  { id: 12, src: '/assets/img/site/12.jpg', alt: 'Website 12' },
  { id: 13, src: '/assets/img/site/13.jpg', alt: 'Website 13' },
  { id: 14, src: '/assets/img/site/14.jpg', alt: 'Website 14' },
]

// If even, clone first item so total is odd (exact behavior of legacy poster carousel)
const initialSlides: SlideItem[] =
  rawSlides.length % 2 === 0
    ? [...rawSlides, { ...rawSlides[0], id: rawSlides.length + 1 }]
    : rawSlides

interface SlotStyle {
  width: number
  height: number
  left: number
  top: number
  zIndex: number
  opacity: number
}

function getVerticalAlign(h: number, height: number, align: string = 'middle') {
  if (align === 'middle') return (height - h) / 2
  if (align === 'top') return 0
  if (align === 'bottom') return height - h
  return (height - h) / 2
}

function calculateSlots(
  setting: {
    width: number
    height: number
    posterWidth: number
    posterHeight: number
    scale: number
    verticalAlign?: string
  },
  total: number
): SlotStyle[] {
  const slots: SlotStyle[] = new Array(total)
  const half = Math.floor(total / 2)
  const r = (setting.width - setting.posterWidth) / 2
  const p = r / half

  // Center item (slot 0)
  slots[0] = {
    width: setting.posterWidth,
    height: setting.posterHeight,
    left: r,
    top: getVerticalAlign(setting.posterHeight, setting.height, setting.verticalAlign),
    zIndex: half,
    opacity: 1,
  }

  // Right side (slots 1 to half)
  let curW = setting.posterWidth
  let curH = setting.posterHeight
  let zIndexRight = half
  const c = r + setting.posterWidth

  for (let s = 0; s < half; s++) {
    zIndexRight--
    curW *= setting.scale
    curH *= setting.scale
    const opacity = 1 / (s + 2)
    const left = c + (s + 1) * p - curW
    const top = getVerticalAlign(curH, setting.height, setting.verticalAlign)
    slots[s + 1] = {
      width: Math.round(curW),
      height: Math.round(curH),
      left: Math.round(left),
      top: Math.round(top),
      zIndex: zIndexRight,
      opacity: Number(opacity.toFixed(3)),
    }
  }

  // Left side (slots half + 1 to total - 1)
  let curLeftW = slots[half].width
  let curLeftH = slots[half].height
  let u = half

  for (let s = 0; s < half; s++) {
    const slotIdx = half + 1 + s
    slots[slotIdx] = {
      width: Math.round(curLeftW),
      height: Math.round(curLeftH),
      left: Math.round(s * p),
      top: Math.round(getVerticalAlign(curLeftH, setting.height, setting.verticalAlign)),
      zIndex: s,
      opacity: Number((1 / u).toFixed(3)),
    }
    curLeftW /= setting.scale
    curLeftH /= setting.scale
    u--
  }

  return slots
}

export default function InfinityCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [itemPositions, setItemPositions] = useState<number[]>(() =>
    initialSlides.map((_, i) => i)
  )
  const [dimensions, setDimensions] = useState({
    width: 1000,
    height: 321,
    posterWidth: 481,
    posterHeight: 321,
    scale: 0.8,
    speed: 300,
    delay: 2000,
    autoPlay: true,
  })
  const isHoveredRef = useRef(false)
  const isVisibleRef = useRef(true)
  const touchStartXRef = useRef(0)

  // Recalculate dimensions on resize
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return
    const parentWidth = containerRef.current.parentElement?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1000)
    const viewport = typeof window !== 'undefined' ? window.innerWidth : 1000
    const available = Math.min(parentWidth, viewport)
    const baseWidth = 1000
    const baseHeight = 321
    const basePosterWidth = 481
    const basePosterHeight = 321
    const scale = available < baseWidth ? Math.max(0.32, available / baseWidth) : 1

    setDimensions((prev) => ({
      ...prev,
      width: Math.round(baseWidth * scale),
      height: Math.round(baseHeight * scale),
      posterWidth: Math.round(basePosterWidth * scale),
      posterHeight: Math.round(basePosterHeight * scale),
    }))
  }, [])

  useEffect(() => {
    updateDimensions()
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateDimensions, 100)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [updateDimensions])

  // Rotate left (advance next)
  const rotateLeft = useCallback(() => {
    setItemPositions((prev) => {
      const total = prev.length
      return prev.map((slot) => (slot - 1 + total) % total)
    })
  }, [])

  // Rotate right (go prev)
  const rotateRight = useCallback(() => {
    setItemPositions((prev) => {
      const total = prev.length
      return prev.map((slot) => (slot + 1) % total)
    })
  }, [])

  // Rotate to specific slot
  const handleItemClick = (currentSlot: number) => {
    if (currentSlot === 0) return // Already center
    const total = initialSlides.length
    const half = Math.floor(total / 2)
    if (currentSlot <= half) {
      // Rotate left currentSlot times
      setItemPositions((prev) =>
        prev.map((slot) => (slot - currentSlot + total) % total)
      )
    } else {
      // Rotate right (total - currentSlot) times
      const step = total - currentSlot
      setItemPositions((prev) =>
        prev.map((slot) => (slot + step) % total)
      )
    }
  }

  // Autoplay
  useEffect(() => {
    if (!dimensions.autoPlay) return

    const interval = setInterval(() => {
      if (!isHoveredRef.current && isVisibleRef.current) {
        rotateLeft()
      }
    }, dimensions.delay)

    return () => clearInterval(interval)
  }, [dimensions.autoPlay, dimensions.delay, rotateLeft])

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    const el = containerRef.current
    if (!el || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        rotateLeft()
      } else {
        rotateRight()
      }
    }
  }

  const slots = calculateSlots(dimensions, initialSlides.length)
  const btnWidth = Math.max(36, (dimensions.width - dimensions.posterWidth) / 2)
  const btnZIndex = Math.ceil(initialSlides.length / 2) + 2

  return (
    <section id="infinity" className="infinity">
      <div className="height_divider_1"></div>
      <div className="container">
        <p style={{ textAlign: 'center' }}>Websites I’ve Worked With</p>
        <div className="container_pictureSlider">
          <div
            ref={containerRef}
            className="pictureSlider poster-main"
            data-setting='{"width": 1000, "height": 321, "posterWidth": 481, "posterHeight": 321, "scale": 0.8, "autoPlay": true, "delay": 2000, "speed": 300}'
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
            }}
            onMouseEnter={() => {
              isHoveredRef.current = true
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="poster-btn poster-prev-btn"
              role="button"
              aria-label="Previous slide"
              onClick={rotateRight}
              style={{
                width: `${btnWidth}px`,
                height: `${dimensions.height}px`,
                zIndex: btnZIndex,
              }}
            ></div>
            <ul
              className="poster-list"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
              }}
            >
              {initialSlides.map((slide, index) => {
                const slotIndex = itemPositions[index]
                const slot = slots[slotIndex] || slots[0]

                return (
                  <li
                    key={slide.id}
                    className="poster-item"
                    onClick={() => handleItemClick(slotIndex)}
                    style={{
                      width: `${slot.width}px`,
                      height: `${slot.height}px`,
                      left: `${slot.left}px`,
                      top: `${slot.top}px`,
                      zIndex: slot.zIndex,
                      opacity: slot.opacity,
                      transition: `width ${dimensions.speed}ms ease-in-out, height ${dimensions.speed}ms ease-in-out, left ${dimensions.speed}ms ease-in-out, top ${dimensions.speed}ms ease-in-out, opacity ${dimensions.speed}ms ease-in-out`,
                      cursor: slotIndex === 0 ? 'default' : 'pointer',
                    }}
                  >
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <img
                        decoding="async"
                        src={slide.src}
                        width="481"
                        height="321"
                        alt={slide.alt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
            <div
              className="poster-btn poster-next-btn"
              role="button"
              aria-label="Next slide"
              onClick={rotateLeft}
              style={{
                width: `${btnWidth}px`,
                height: `${dimensions.height}px`,
                zIndex: btnZIndex,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}