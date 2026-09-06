'use client'

import { useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import SkillsPerspective from '../components/SkillsPerspective'
import Portfolio from '../components/Portfolio'
import InfinityCarousel from '../components/InfinityCarousel'
import Marquee from '../components/Marquee'
import Slicebox from '../components/Slicebox'
import Ravenom from '../components/Ravenom'
import Services from '../components/Services'
import VideoSection from '../components/VideoSection'
import Certificates from '../components/Certificates'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import AskAnything from '../components/AskAnything'
import BackToTop from '../components/BackToTop'
import SoundToggle from '../components/SoundToggle'

export default function Home() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const selector = [
      '.section-title',
      '.container_title',
      '.intro_text',
      '.scene',
      '.timeline',
      '.portfolio-item',
      '.card_v5',
      '.cards_v5',
      '.tipsy_box_v1',
      '.team_testimonials > [class*="col-"]',
      '.contact-cards-row_v1 > [class*="col-"]',
      '.contact-content-row_v1 > [class*="col-"]',
      '.footer-zigzag',
      '#github',
      '.pc-lottie-container',
    ].join(',')

    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement && !el.classList.contains('js-scroll-fade')) {
        el.classList.add('js-scroll-fade')
      }
    })
  }, [])

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <SkillsPerspective />
        <Portfolio />
        <InfinityCarousel />
        <Marquee />
        <Slicebox />
        <Ravenom />
        <Services />
        <VideoSection />
        <Certificates />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <AskAnything />
      <BackToTop />
      <SoundToggle />
    </>
  )
}