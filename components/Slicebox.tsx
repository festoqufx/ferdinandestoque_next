'use client'

import { useEffect, useRef } from 'react'

export default function Slicebox() {
  const sliceboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize slicebox slider
    const initSlicebox = () => {
      const slicebox = sliceboxRef.current
      if (!slicebox) return

      const slider = slicebox.querySelector('.sb-slider') as HTMLElement
      const items = Array.from(slider.querySelectorAll('li')) as HTMLElement[]
      const navDots = slicebox.querySelectorAll('.nav-dots span')
      const navArrows = slicebox.querySelectorAll('.nav-arrows a')
      const shadow = slicebox.querySelector('.shadow') as HTMLElement
      const currentDot = slicebox.querySelector('.nav-dot-current') as HTMLElement

      let currentIndex = 0
      const totalItems = items.length

      // Update dots
      const updateDots = (index: number) => {
        navDots.forEach((dot, i) => {
          dot.classList.toggle('nav-dot-current', i === index)
        })
      }

      // Initialize first dot
      if (navDots.length > 0) {
        navDots[0].classList.add('nav-dot-current')
      }

      // Next button
      if (navArrows.length > 0) {
        navArrows[0].addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % totalItems
          updateDots(currentIndex)
          // Smooth transition
          slider.style.transform = `translateX(-${currentIndex * 100}%)`
        })
      }

      // Previous button
      if (navArrows.length > 1) {
        navArrows[1].addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + totalItems) % totalItems
          updateDots(currentIndex)
          slider.style.transform = `translateX(-${currentIndex * 100}%)`
        })
      }

      // Auto-advance
      const autoAdvance = () => {
        currentIndex = (currentIndex + 1) % totalItems
        updateDots(currentIndex)
        slider.style.transform = `translateX(-${currentIndex * 100}%)`
      }

      const autoTimer = setInterval(autoAdvance, 5000)

      return () => clearInterval(autoTimer)
    }

    // Initialize when component mounts
    initSlicebox()
  }, [])

  return (
    <section id="GALLERY" className="TIMELINE section-bg">
      <p>&nbsp;</p>
      <div className="container">
        <div className="wrapper slicebox" ref={sliceboxRef}>
          <ul id="sb-slider" className="sb-slider">
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-1.jpg" alt="image1" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 1</h3>
              </div>
            </li>
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-2.jpg" alt="image2" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 2</h3>
              </div>
            </li>
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-3.jpg" alt="image1" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 3</h3>
              </div>
            </li>
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-4.jpg" alt="image1" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 4</h3>
              </div>
            </li>
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-5.jpg" alt="image1" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 5</h3>
              </div>
            </li>
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-6.jpg" alt="image1" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 6</h3>
              </div>
            </li>
            <li>
              <img loading="lazy" decoding="async" src="/assets/img/portfolio/portfolio-7.jpg" alt="image1" width="600" height="400" />
              <div className="sb-description">
                <h3>LOGO 7</h3>
              </div>
            </li>
          </ul>
          <div id="shadow" className="shadow"></div>
          <div id="nav-arrows" className="nav-arrows">
            <a href="#">Next</a>
            <a href="#">Previous</a>
          </div>
          <div id="nav-dots" className="nav-dots">
            <span className="nav-dot-current"></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center tipsy_box_v1" style={{ height: '700px', margin: '0 0 170px 0' }}>
            <span id="tipsy_box">
              <a href="https://raven-cuve-website-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>BLACK RAVEN</a>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}