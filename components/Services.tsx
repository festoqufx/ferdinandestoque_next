'use client'

const services = [
  {
    icon: 'bi bi-window-fullscreen',
    title: 'Web Development',
    description: 'Web development refers to the creating, building, and maintaining of websites. It includes aspects such as web design, web publishing, web programming, and database management. It is the creation of an application that works over the internet i.e. websites.'
  },
  {
    icon: 'bi bi-wordpress',
    title: 'Web Design',
    description: 'Web design encompasses many different skills and disciplines in the production and maintenance of websites. The different areas of web design include web graphic design; UI design; authoring, including standardised code and proprietary software; UX design; and SEO.'
  },
  {
    icon: 'bi bi-camera2',
    title: 'Rebranding',
    description: 'Rebranding is a marketing strategy in which a new name, term, symbol, design, concept or combination thereof is created for an established brand with the intention of developing a new, differentiated identity in the minds of consumers, investors, competitors, and other stakeholders'
  },
  {
    icon: 'bi bi-textarea-t',
    title: 'Illustration',
    description: 'An illustration is a decoration, interpretation, or visual explanation of a text, concept, or process, designed for integration in print and digitally published media, such as posters, flyers, magazines, books, teaching materials, animations, video games and films.'
  },
  {
    icon: 'bi bi-camera',
    title: 'Branding',
    description: 'Branding is the process of creating the brand identity of a company. This process also delivers materials that support the brand, like a logo, tagline, visual design, or tone of voice.'
  },
  {
    icon: 'bi bi-stack',
    title: 'Print Design',
    description: 'Print design is a subset of graphic design where the design is first created digitally then printed out. Mostly used for branding and marketing purposes i.e. Business cards, flyers, and packaging.'
  }
]

export default function Services() {
  return (
    <section id="services" className="services section-bg">
      <div className="container">
        <div className="section-title">
          <div className="height_divider_1"></div>
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                Services
                <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden className="Title__filled">Services</div>
            </div>
          </div>
          <div className="height_divider_1"></div>
          <div className="container">
            <div className="row">
              {services.map((service, index) => (
                <div key={index} className="col-lg-6">
                  <div className="cards_v5">
                    <article className="card_v5" style={{ marginBottom: '25px' }}>
                      <div className="card_box_v5">
                        <div className="row">
                          <div className="col-sm-1" style={{ textAlign: 'center', fontSize: '35px' }}>
                            <i className={service.icon}></i>
                          </div>
                          <div className="col-sm-11" style={{ textAlign: 'left' }}>
                            <h2 style={{ textAlign: 'left' }}>{service.title}</h2>
                            <p style={{ textAlign: 'left' }}>{service.description}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="height_divider_1"></div>
        </div>
      </div>
    </section>
  )
}