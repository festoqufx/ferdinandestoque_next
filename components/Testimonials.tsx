'use client'

const testimonials = [
  {
    name: 'Walter White',
    role: 'IT Professional',
    subject: '👦🏼',
    description: `It was a pleasure collaborating with Raven on different projects. One of the things that I think is special about him is that he never settles, even after completing the projects he finds other resources and strengthens him knowledge. Collaborating with him is easy and comfortable, it's like working with someone you've known for a long period of time.`,
    color: 'cg'
  },
  {
    name: 'Amanda Jepson',
    role: 'IT Professional',
    subject: '👧🏻',
    description: `Throughout all our collaborations, Raven has always conducted herself politely and kindly. He comes across as someone that's always willing to help and puts the team ahead of himself. But beneath this, I see a strength and determination to distinguish himself. He's not only someone I highly recommend but is also someone I greatly respect.`,
    color: 'cr_v1'
  },
  {
    name: 'Sarah Jhonson',
    role: 'IT Professional',
    subject: '👧',
    description: `As a developer and a problem solver, I think Raven is a great collaborative partner to have. I met Raven in some basic javascript & react projects and since then he has drastically progressed in him understanding of the development process. He always has a professional environment and has good audio and video quality which makes it easier to communicate with him.`,
    color: 'cg'
  },
  {
    name: 'William Anderson',
    role: 'IT Professional',
    subject: '👦',
    description: `I had the pleasure of working with him on several web development projects. He's a highly skilled Web Developer who writes clean, maintainable code and consistently delivers high-quality solutions. His problem-solving ability, professionalism, and collaborative approach make him a valuable teammate. I would gladly recommend him to any organization.`,
    color: 'cr_v1'
  }
]

export default function Testimonials() {
  return (
    <section id="pricing" className="pricing section-bg clearfix">
      <section id="testimonials" className="team">
        <div className="container">
          <div className="section-title">
            <div className="container_title_2">
              <div className="Title">
                <h1 className="Title_h1">
                  TESTIMONIALS <div className="Title__highlight"></div>
                </h1>
                <div className="Title__underline"></div>
                <div aria-hidden className="Title__filled">TESTIMONIALS</div>
              </div>
            </div>
            <div className="height_divider_1"></div>
          </div>
          <div className="row team_testimonials">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-3 col-md-6 d-flex align-items-stretch" style={{ marginBottom: '25px' }}>
                <div className={`cp-card_v1 ${testimonial.color}`}>
                  <div className="cp-outer_v1"></div>
                  <div className="cp-body_v1">
                    <div className="cp-img_v1">
                      <div className="corner_v1 tl_v1"></div>
                      <div className="corner_v1 tr_v1"></div>
                      <div className="corner_v1 bl_v1"></div>
                      <div className="corner_v1 br_v1"></div>
                      <div className="status_v1">
                        <div className="sblink_v1"></div>Profile
                      </div>
                      <div className="cp-subject_v1">{testimonial.subject}</div>
                    </div>
                    <div className="cp-info_v1">
                      <div className="cp-sys_v1">IT Professional</div>
                      <div className="cp-title_v1">{testimonial.name}</div>
                      <div className="cp-desc_v1">{testimonial.description}</div>
                      <div className="cp-stats_v1">
                        <div className="cpstat_v1">
                          <span className="cpstat_v1-n">
                            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                              <i className="bi bi-x"></i>
                            </a>
                          </span>
                        </div>
                        <div className="cpstat_v1">
                          <span className="cpstat_v1-n">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                              <i className="bi bi-facebook"></i>
                            </a>
                          </span>
                        </div>
                        <div className="cpstat_v1">
                          <span className="cpstat_v1-n">
                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                              <i className="bi bi-instagram"></i>
                            </a>
                          </span>
                        </div>
                      </div>
                      <button className="cp-cta_v1">
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-linkedin"></i>
                        </a> LinkedIn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}