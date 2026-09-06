'use client'

import { useState, useRef } from 'react'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

interface FormFields {
  name: string
  email: string
  subject: string
  message: string
}

interface FieldErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormFields>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'error' | 'sent'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const subjectInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const validateField = (name: keyof FormFields, value: string): string => {
    const val = value.trim()
    switch (name) {
      case 'name':
        if (!val) return 'Please enter your name.'
        if (val.length < 2) return 'Name must be at least 2 characters.'
        return ''
      case 'email':
        if (!val) return 'Please enter your email address.'
        if (val.length > 254 || !EMAIL_REGEX.test(val)) return 'Please enter a valid email address.'
        return ''
      case 'subject':
        if (!val) return 'Please enter a subject.'
        if (val.length < 3) return 'Subject must be at least 3 characters.'
        return ''
      case 'message':
        if (!val) return 'Please write your message.'
        if (val.length < 10) return 'Message must be at least 10 characters.'
        return ''
      default:
        return ''
    }
  }

  const validateAll = (): { isValid: boolean; errors: FieldErrors } => {
    const errors: FieldErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message),
    }

    const isValid = !errors.name && !errors.email && !errors.subject && !errors.message
    return { isValid, errors }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name] || formStatus === 'error') {
      const err = validateField(name as keyof FormFields, value)
      setFieldErrors((prev) => ({ ...prev, [name]: err }))
      if (!err && formStatus === 'error') {
        const remaining = { ...fieldErrors, [name]: '' }
        if (!Object.values(remaining).some(Boolean)) {
          setErrorMessage('')
        }
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = validateField(name as keyof FormFields, value)
    setFieldErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { isValid, errors } = validateAll()
    setFieldErrors(errors)
    setTouched({ name: true, email: true, subject: true, message: true })

    if (!isValid) {
      setFormStatus('error')
      const firstError = errors.name || errors.email || errors.subject || errors.message
      setErrorMessage(firstError || 'Please fill in all required fields correctly.')

      // Focus the first invalid field
      if (errors.name) nameInputRef.current?.focus()
      else if (errors.email) emailInputRef.current?.focus()
      else if (errors.subject) subjectInputRef.current?.focus()
      else if (errors.message) messageInputRef.current?.focus()
      return
    }

    setFormStatus('loading')
    setErrorMessage('')

    const payload = new FormData()
    payload.append('name', formData.name.trim())
    payload.append('email', formData.email.trim())
    payload.append('subject', formData.subject.trim())
    payload.append('message', formData.message.trim())

    try {
      // First attempt: Next.js API route
      let response = await fetch('/api/contact', {
        method: 'POST',
        body: payload,
      })

      // Fallback to PHP backend if /api/contact is unavailable (e.g. PHP hosting)
      if (!response.ok && response.status === 404) {
        response = await fetch('forms/contact.php', {
          method: 'POST',
          body: payload,
        })
      }

      let data: any = {}
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}))
      } else {
        const text = await response.text()
        if (text.trim() === 'OK' || response.ok) {
          data = { success: true, message: 'Your message has been sent. Thank you!' }
        } else {
          data = { success: false, error: text }
        }
      }

      if (response.ok && data?.success !== false) {
        setFormStatus('sent')
        setSuccessMessage(data?.message || 'Your message has been sent successfully. Thank you!')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFieldErrors({})
        setTouched({})
      } else {
        setFormStatus('error')
        setErrorMessage(data?.error || 'Form submission failed. Please try again or email directly.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network connection error. Please try again or email directly at ferdinand.estoque@yahoo.com.')
    }
  }

  const handleResetForm = () => {
    setFormStatus('idle')
    setErrorMessage('')
    setSuccessMessage('')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setFieldErrors({})
    setTouched({})
    setTimeout(() => nameInputRef.current?.focus(), 50)
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
                  title="Google Maps Location"
                ></iframe>
              </div>
              <div className="col-12 col-lg-6">
                <div className="card-container_v5">
                  <div className="content-container_v5">
                    <div className="content-top">
                      <div className="scrollbar-glass glass_v5" style={{ textAlign: 'center' }}>
                        {formStatus === 'sent' ? (
                          <div className="sent-message-card" role="alert" aria-live="polite">
                            <div className="sent-icon-wrap">
                              <i className="bi bi-check-circle-fill" style={{ color: '#00c853', fontSize: '42px' }}></i>
                            </div>
                            <h3 style={{ color: '#ffffff', fontFamily: 'Orbitron, sans-serif', marginTop: '12px' }}>
                              Message Sent!
                            </h3>
                            <p style={{ color: '#d0d0d8', fontSize: '14px', margin: '10px 0 20px 0', lineHeight: 1.6 }}>
                              {successMessage}
                            </p>
                            <button
                              type="button"
                              onClick={handleResetForm}
                              className="send-another-btn"
                            >
                              Send Another Message
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="php-email-form" noValidate>
                            <div className="row">
                              <div className="col-md-6 form-group">
                                <input
                                  ref={nameInputRef}
                                  type="text"
                                  name="name"
                                  className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                                  id="name"
                                  placeholder="Your Name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  disabled={formStatus === 'loading'}
                                  required
                                  aria-required="true"
                                  aria-invalid={!!fieldErrors.name}
                                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                                />
                                {fieldErrors.name && (
                                  <span id="name-error" className="field-error-text">
                                    {fieldErrors.name}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6 form-group mt-3 mt-md-0">
                                <input
                                  ref={emailInputRef}
                                  type="email"
                                  className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                                  name="email"
                                  id="email"
                                  placeholder="Your Email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  disabled={formStatus === 'loading'}
                                  required
                                  aria-required="true"
                                  aria-invalid={!!fieldErrors.email}
                                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                />
                                {fieldErrors.email && (
                                  <span id="email-error" className="field-error-text">
                                    {fieldErrors.email}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-group mt-3">
                              <input
                                ref={subjectInputRef}
                                type="text"
                                className={`form-control ${fieldErrors.subject ? 'is-invalid' : ''}`}
                                name="subject"
                                id="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={formStatus === 'loading'}
                                required
                                aria-required="true"
                                aria-invalid={!!fieldErrors.subject}
                                aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                              />
                              {fieldErrors.subject && (
                                <span id="subject-error" className="field-error-text">
                                  {fieldErrors.subject}
                                </span>
                              )}
                            </div>
                            <div className="form-group mt-3">
                              <textarea
                                ref={messageInputRef}
                                className={`form-control ${fieldErrors.message ? 'is-invalid' : ''}`}
                                name="message"
                                id="message"
                                rows={5}
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={formStatus === 'loading'}
                                required
                                aria-required="true"
                                aria-invalid={!!fieldErrors.message}
                                aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                              ></textarea>
                              {fieldErrors.message && (
                                <span id="message-error" className="field-error-text">
                                  {fieldErrors.message}
                                </span>
                              )}
                            </div>

                            <div className="my-3">
                              {formStatus === 'loading' && (
                                <div className="loading" style={{ display: 'block' }}>
                                  <span className="loading-spinner" aria-hidden="true"></span>
                                  <span>Sending message...</span>
                                </div>
                              )}
                              {formStatus === 'error' && (
                                <div className="error-message" style={{ display: 'block' }} role="alert">
                                  <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '8px' }}></i>
                                  <span>{errorMessage}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-center">
                              <button
                                type="submit"
                                disabled={formStatus === 'loading'}
                                aria-label={formStatus === 'loading' ? 'Sending message...' : 'Send Message'}
                              >
                                {formStatus === 'loading' ? (
                                  <span className="d-inline-flex align-items-center gap-2">
                                    <span className="btn-spinner" aria-hidden="true"></span>
                                    <span>Sending...</span>
                                  </span>
                                ) : (
                                  'Send Message'
                                )}
                              </button>
                            </div>
                          </form>
                        )}
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

      <style jsx>{`
        .field-error-text {
          color: #ff6b6b;
          font-size: 12px;
          display: block;
          text-align: left;
          margin-top: 4px;
          margin-left: 2px;
          font-family: 'Lato', sans-serif;
          animation: fieldErrorFade 0.2s ease;
        }

        @keyframes fieldErrorFade {
          from {
            opacity: 0;
            transform: translateY(-3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact .php-email-form input.is-invalid,
        .contact .php-email-form textarea.is-invalid {
          border-color: #ff4d4f !important;
          box-shadow: 0 0 0 1px #ff4d4f !important;
        }

        .contact .php-email-form .loading {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .contact .php-email-form .error-message {
          background: rgba(237, 60, 13, 0.2);
          border: 1px solid rgba(237, 60, 13, 0.6);
          color: #ff9b85;
          border-radius: 4px;
          padding: 12px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          text-align: left;
        }

        .sent-message-card {
          padding: 30px 20px;
          text-align: center;
          animation: sentFade 0.3s ease;
        }

        @keyframes sentFade {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .send-another-btn {
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%);
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 4px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .send-another-btn:hover {
          background: rgba(255, 0, 25, 0.6);
          border-color: #ff0019;
          box-shadow: 0 0 16px rgba(255, 0, 25, 0.5);
        }

        .contact .php-email-form button[type=submit]:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  )
}
