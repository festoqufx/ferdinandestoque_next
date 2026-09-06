'use client'

import { useEffect, useState, useCallback } from 'react'

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#About' },
  { label: 'Experience', href: '#Experience' },
  { label: 'Tech Stack', href: '#skills' },
  { label: 'Projects', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#hero')
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev)
  }

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false)
  }, [])

  // Smooth scroll to target section with header offset
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    closeMobileNav()

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.querySelector(href) as HTMLElement | null
    if (target) {
      const header = document.getElementById('header')
      const offset = header ? header.offsetHeight : 0
      const elementPos = target.offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth',
      })
    }
  }

  // Scroll listener for header shadow & active navigation indicator
  useEffect(() => {
    const handleScroll = () => {
      // Header scroll background effect
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Active section indicator on scroll
      const position = window.scrollY + 200
      for (const item of navItems) {
        const section = document.querySelector(item.href) as HTMLElement | null
        if (section) {
          const top = section.offsetTop
          const height = section.offsetHeight
          if (position >= top && position <= top + height) {
            setActiveSection(item.href)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile nav on ESC key or window resize above mobile breakpoint (991px)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileNav()
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 991) {
        closeMobileNav()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [closeMobileNav])

  return (
    <header
      id="header"
      className={`fixed-top d-flex align-items-center ${isScrolled ? 'header-scrolled' : ''}`}
    >
      <div className="container d-flex align-items-center justify-content-between">
        <div className="logo">
          <h1>
            <a
              href="#hero"
              className="main_logo_v1 animation-rotateIn_v1"
              onClick={(e) => handleScrollTo(e, '#hero')}
            >
              <img
                src="/assets/img/logo.png"
                alt="RAVENOM"
                width="40"
                height="40"
                fetchPriority="high"
                decoding="async"
              />
              {' RAVENOM'}
            </a>
          </h1>
        </div>

        <nav
          id="navbar"
          className={`navbar ${isMobileNavOpen ? 'navbar-mobile' : ''}`}
          onClick={(e) => {
            // Clicking the backdrop outside <ul> closes the mobile nav
            if (isMobileNavOpen && (e.target as HTMLElement).id === 'navbar') {
              closeMobileNav()
            }
          }}
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className={`nav-link scrollto ${activeSection === item.href ? 'active' : ''}`}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <i
            className={`bi mobile-nav-toggle ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`}
            onClick={toggleMobileNav}
            role="button"
            aria-label="Toggle navigation menu"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleMobileNav()
              }
            }}
          ></i>
        </nav>
      </div>
    </header>
  )
}
