'use client'

export default function About() {
  return (
    <section id="About" className="About section-bg">
      <div className="container">
        <div className="section-title">
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                About
                <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden className="Title__filled">About</div>
            </div>
          </div>
          <div className="height_divider_1"></div>
          <div className="circle_r">
            <div className="slider_cube">
              <div className="container_cube">
                <div className="slide_cube x"></div>
                <div className="slide_cube y"></div>
                <div className="slide_cube z"></div>
              </div>
              <div className="shadow_cube"></div>
            </div>
          </div>
          <div className="height_divider_1"></div>

          <div className="container">
            <div className="row">
              <div className="col-lg-6" style={{ textAlign: 'right' }}>
                <h3 className="intro_text">
                  Welcome to the digital realm where creativity meets innovation. I'm Ferdinand
                  Estoque a.k.a. Black Raven, a seasoned Web Developer, UI/UX Designer, and Digital Creator with over 16
                  years of experience building modern, user-centered digital experiences. Armed with a Bachelor of Science
                  in Information Technology, I combine technical expertise, creative design, and AI-powered development to
                  transform ideas into scalable, high-performing solutions.
                </h3>
              </div>
              <div className="col-lg-6">
                <div
                  className="pc-lottie-container"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px auto 30px', width: '100%', maxWidth: '500px' }}
                >
                  <img
                    src="/assets/img/SVG/PC2.svg"
                    className="pc-anim-svg"
                    alt="PC Animation"
                    width="500"
                    height="405"
                    style={{ width: '500px', maxWidth: '100%', height: 'auto' }}
                  />
                  <lottie-player
                    autoPlay
                    loop
                    mode="normal"
                    background="transparent"
                    style={{ display: 'none', width: '500px', height: 'auto' }}
                  ></lottie-player>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <h3 className="intro_text">
                  My journey began with a passion for pixel-perfect design and a curiosity for emerging
                  technologies.
                  Over the years, I have developed expertise in front-end and back-end web development, responsive web
                  design, UI/UX, branding, content management systems, and digital product development. I enjoy creating
                  intuitive user experiences that seamlessly blend aesthetics, functionality, accessibility, and
                  performance.
                  <br /><br />
                  Today, I am AI and digitally fluent, leveraging modern AI-assisted development tools such as Claude
                  Code, GitHub Copilot, OpenAI Codex, Cursor, Cline, and AntiGravity to accelerate development, improve code
                  quality, build automation tools that streamline workflows, and rapidly prototype innovative solutions. By
                  combining AI with modern engineering practices, I deliver software faster while maintaining high standards
                  for quality, scalability, and maintainability.
                  <br /><br />
                  Beyond software development, I have extensive experience in branding, digital advertising, animation,
                  image editing, and multimedia design. Whether designing engaging user interfaces, developing enterprise
                  web applications, or creating compelling digital experiences, I approach every project with creativity,
                  precision, and a commitment to continuous improvement.
                  <br /><br />
                  I believe great digital products are built through collaboration, thoughtful design, and continuous
                  innovation. Every project is an opportunity to solve real-world problems, improve user experiences, and
                  create meaningful value through technology.
                  <br /><br />
                  Based in Cavite, Philippines, I continue to explore emerging technologies, AI-powered development,
                  automation, and modern software engineering practices to help businesses innovate and grow in an
                  ever-evolving digital landscape.
                  <br /><br />
                  Whether you're looking to build a modern web application, enhance your digital presence, automate
                  business processes, or bring your next idea to life, I'd be excited to collaborate with you.
                  <br /><br />
                  Let's build something exceptional—together.
                </h3>
              </div>
            </div>
          </div>
        </div>
        <ul className="stage clearfix">
          <li className="scene">
            <div className="movie" onClick={() => true}>
              <div className="poster"></div>
              <div className="info">
                <header>
                  <h1>Ichiran Ramen</h1>
                </header>
                <p>I enjoyed a delicious meal at Ichiran Ramen, experiencing the rich flavors of authentic Japanese ramen.
                  From the perfectly cooked noodles to the flavorful broth, every bite made the visit a memorable part of
                  my trip to Japan.</p>
              </div>
            </div>
          </li>
          <li className="scene">
            <div className="movie" onClick={() => true}>
              <div className="poster"></div>
              <div className="info">
                <header>
                  <h1>Narita Airport</h1>
                </header>
                <p>Waiting to board my flight at Narita Airport, taking one last look at Japan before heading home.
                  Grateful for the unforgettable memories, incredible places, delicious food, and peaceful moments from
                  this amazing solo journey. Goodbye, Japan—until we meet again.</p>
              </div>
            </div>
          </li>
          <li className="scene">
            <div className="movie" onClick={() => true}>
              <div className="poster"></div>
              <div className="info">
                <header>
                  <h1>Tokyo Disney land</h1>
                </header>
                <p>I spent a few days staying at a hotel near Disneyland, enjoying a relaxing solo getaway. I explored the
                  parks at my own pace, discovered nearby attractions, and took time to unwind while creating memorable
                  experiences.</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}