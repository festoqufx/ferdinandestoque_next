'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        setIsActive(true)
      } else {
        setIsActive(false)
      }
    }

    window.addEventListener('scroll', toggleBacktotop)
    toggleBacktotop()

    return () => window.removeEventListener('scroll', toggleBacktotop)
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <a
      href="#"
      onClick={scrollToTop}
      className={`back-to-top d-flex align-items-center justify-content-center ${isActive ? 'active' : ''}`}
      aria-label="Scroll back to top"
    >
      <i className="bi bi-arrow-up-short"></i>
    </a>
  )
}