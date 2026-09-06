'use client'

import { useEffect, useRef } from 'react'

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize scroll effects for timeline
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__fadeInUp')
        }
      })
    }, observerOptions)

    const timelineItems = timelineRef.current?.querySelectorAll('.timeline')
    timelineItems?.forEach((item) => {
      observer.observe(item)
    })

    return () => {
      timelineItems?.forEach((item) => {
        observer.unobserve(item)
      })
    }
  }, [])

  return (
    <section id="Experience" className="TIMELINE section-bg">
      <div className="container">
        <div className="section-title">
          <div className="height_divider_1"></div>
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                EXPERIENCE
                <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden className="Title__filled">EXPERIENCE</div>
            </div>
          </div>
          <div className="height_divider_1"></div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="main-timeline" ref={timelineRef}>
                {/* Visa/Teleperformance */}
                <div className="timeline">
                  <a href="#" className="timeline-content">
                    <div className="timeline-icon">
                      <img
                        className="timeline_logo"
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                        style={{ width: '90%', margin: '-2px 0 0 0' }}
                        src="/assets/img/timeline/vis.gif"
                        alt="Visa Teleperformance"
                      />
                    </div>
                    <div className="timeline-year">2025</div>
                    <h3 className="title">Visa/Teleperformance</h3>
                    <p className="description">
                      <strong>IMPLEMENTATION ANALYST/DIGITAL CONTENT MANAGER</strong>
                      <br />
                      AEM, Adobe Creative Suite, Bastion Host(SSH/RDP), JIRA, SharePoint, Figma, TFS, Github(CI/CD), Jenkins
                      <br /> Fulltime
                    </p>
                  </a>
                </div>

                {/* Quinn Data Facilities */}
                <div className="timeline">
                  <a href="#" className="timeline-content">
                    <div className="timeline-icon">
                      <img
                        className="timeline_logo"
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                        style={{ width: '90%', margin: '-6px 0 0 0' }}
                        src="/assets/img/timeline/qdf.gif"
                        alt="Quinn Data Facilities"
                      />
                    </div>
                    <div className="timeline-year">2016</div>
                    <h3 className="title">QUINN DATA FACILITIES, INC.</h3>
                    <p className="description">
                      <strong>BACK-END WEB DEVELOPER</strong>
                      <br />
                      Laravel, MySQL, MsSQL, PostgreSQL, Git, Wordpress, Bootstrap, HTML5, CSS, JS
                      <br /> Fulltime
                    </p>
                  </a>
                </div>

                {/* Smart Communications */}
                <div className="timeline">
                  <a href="#" className="timeline-content">
                    <div className="timeline-icon">
                      <img
                        className="timeline_logo"
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                        style={{ width: '78%', margin: '-6px 0 0 0' }}
                        src="/assets/img/timeline/smrt.gif"
                        alt="Smart Communications"
                      />
                    </div>
                    <div className="timeline-year">2015</div>
                    <h3 className="title">SMART COMMUNICATION, INC.</h3>
                    <p className="description">
                      <strong>IT CONSULTANT/FRONT-END WEB DEVELOPER</strong>
                      <br />
                      Sitefinity, ASP.NET, C#, Bootstrap, HTML5, CSS, JS, JQUERY, SEO
                      <br /> Contractual
                    </p>
                  </a>
                </div>

                {/* NASDAQ */}
                <div className="timeline">
                  <a href="#" className="timeline-content">
                    <div className="timeline-icon">
                      <img
                        className="timeline_logo"
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                        style={{ width: '79%', margin: '-7px 0 0 0' }}
                        src="/assets/img/timeline/ndq.gif"
                        alt="Nasdaq"
                      />
                    </div>
                    <div className="timeline-year">2014</div>
                    <h3 className="title">NASDAQ</h3>
                    <p className="description">
                      <strong>WEB DESIGNER DEVELOPER</strong>
                      <br />
                      Phoenix, Web360, Bootstrap, Foundation, ColdFusion, HTML5, XSLT, CSS, JS
                      <br /> Contractual
                    </p>
                  </a>
                </div>

                {/* Crosspower Phils */}
                <div className="timeline">
                  <a href="#" className="timeline-content">
                    <div className="timeline-icon">
                      <img
                        className="timeline_logo"
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                        style={{ width: '77%', margin: '-8px 0 0 0' }}
                        src="/assets/img/timeline/cpr.gif"
                        alt="Crosspower Phils"
                      />
                    </div>
                    <div className="timeline-year">2013</div>
                    <h3 className="title">CROSSPOWER PHILS, INC.</h3>
                    <p className="description">
                      <strong>MULTIMEDIA WEB DESIGNER</strong>
                      <br />
                      Wordpress, Genesis, Git, Initializr, PHP/Mysql, Bootstrap, HTML5, JS, CSS
                      <br /> Project based
                    </p>
                  </a>
                </div>

                {/* SPI Global */}
                <div className="timeline">
                  <a href="#" className="timeline-content">
                    <div className="timeline-icon">
                      <img
                        className="timeline_logo"
                        loading="lazy"
                        decoding="async"
                        width="60"
                        height="60"
                        style={{ width: '87%', margin: '-8px 0 0 0' }}
                        src="/assets/img/timeline/spi1.gif"
                        alt="SPI Global"
                      />
                    </div>
                    <div className="timeline-year">2008</div>
                    <h3 className="title">SPI GLOBAL</h3>
                    <p className="description">
                      <strong>SENIOR WEB CONTENT EDITOR/ANALYST</strong>
                      <br />
                      Arbortext, Contenta DB, SGML, DTD, DHTML, XHTML, XML, CSS, JIRA, Citrix
                      <br /> Fulltime
                    </p>
                  </a>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}