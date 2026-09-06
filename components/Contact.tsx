'use client'

import { useState } from 'react'

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'error' | 'sent'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('loading')

    const formData = new FormData(e.currentTarget)
    try {
      const response = await fetch('forms/contact.php', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        setFormStatus('sent')
      } else {
        setFormStatus('error')
        setErrorMessage('Form submission failed. Please try again or email directly.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Form submission failed. Please try again or email directly.')
    }
  }

  return (
    <section id="contact" className="contact section-bg">
      <div className="container">
        <main className="main-container_v1">
          <div className="container contact-layout_v1">
            <div className="row svg-grid-wrapper_v1">
              <div className="col-12">
                <svg className="svg-container_v1" aria-hidden="true" focusable="false">
                  <defs>
                    <filter id="turbulent-displace-contact" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
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
              </div>
            </div>
            <div className="section-title">
              <div className="container_title">
                <div className="Title">
                  <h1 className="Title_h1">
                    Contact <div className="Title__highlight"></div>
                  </h1>
                  <div className="Title__underline"></div>
                  <div aria-hidden className="Title__filled">Contact</div>
                </div>
              </div>
              <div className="height_divider_1"></div>
            </div>
            <div className="row g-4 align-items-stretch contact-cards-row_v1 mb-2">
              <div className="col-12 col-md-6 col-lg-6">
                <div className="card-container_v2">
                  <div className="content-container_v2">
                    <div className="content-top">
                      <div className="scrollbar-glass glass_v2" style={{ textAlign: 'center' }}>
                        <i className="bi bi-map" style={{ fontSize: '30px' }}></i>
                        <h3>Address</h3>
                        <p>Imus Cavite</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card-container_v3">
                  <div className="content-container_v3">
                    <div className="content-top">
                      <div className="scrollbar-glass glass_v3" style={{ textAlign: 'center' }}>
                        <i className="bi bi-envelope" style={{ fontSize: '30px' }}></i>
                        <h4>Email Us</h4>
                        <p>ferdinand.estoque@yahoo.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card-container_v3">
                  <div className="content-container_v3">
                    <div className="content-top">
                      <div className="scrollbar-glass glass_v3" style={{ textAlign: 'center' }}>
                        <i className="bi bi-telephone-inbound" style={{ fontSize: '30px' }}></i>
                        <h4>Call me</h4>
                        <p>
                          <a href="tel:+639958143127">+63 995 814 3127</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-4 align-items-stretch contact-content-row_v1 mt-1">
              <div className="col-12 col-lg-6">
                <iframe
                  className="mb-4 mb-lg-0"
                  src="https://maps.google.com/maps?width=2048&amp;height=800&amp;hl=en&amp;q=TEA garden imus&amp;t=p&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  style={{ border: 0, width: '100%', height: '384px' }}
                  allowFullScreen
                ></iframe>
              </div>
              <div className="col-12 col-lg-6">
                <div className="card-container_v5">
                  <div className="content-container_v5">
                    <div className="content-top">
                      <div className="scrollbar-glass glass_v5" style={{ textAlign: 'center' }}>
                        <form onSubmit={handleSubmit} className="php-email-form">
                          <div className="row">
                            <div className="col-md-6 form-group">
                              <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                            </div>
                            <div className="col-md-6 form-group mt-3 mt-md-0">
                              <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                            </div>
                          </div>
                          <div className="form-group mt-3">
                            <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                          </div>
                          <div className="form-group mt-3">
                            <textarea className="form-control" name="message" rows={5} placeholder="Message" required></textarea>
                          </div>
                          <div className="my-3">
                            {formStatus === 'loading' && <div className="loading" style={{ display: 'block' }}>Loading</div>}
                            {formStatus === 'error' && <div className="error-message" style={{ display: 'block' }}>{errorMessage}</div>}
                            {formStatus === 'sent' && <div className="sent-message" style={{ display: 'block' }}>Your message has been sent. Thank you!</div>}
                          </div>
                          <div className="text-center">
                            <button type="submit">Send Message</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 mt-lg-4"></div>
          </div>
        </main>
      </div>
    </section>
  )
}