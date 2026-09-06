'use client'

export default function VideoSection() {
  return (
    <section id="iframe_video" className="cta_iframe_video">
      <div className="container iframe-container">
        <div
          style={{
            position: 'relative',
            height: 0,
            overflow: 'hidden',
            paddingBottom: '56.25%',
            borderStyle: 'none'
          }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            src="https://www.youtube.com/embed/Yh3T9Wec1B4?loop=1"
            title="Video presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  )
}