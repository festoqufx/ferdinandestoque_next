'use client'

const topImages = [
  '/assets/img/figma/1.png',
  '/assets/img/figma/2.png',
  '/assets/img/figma/3.png',
  '/assets/img/figma/4.png',
  '/assets/img/figma/5.png',
]

const bottomImages = [
  '/assets/img/figma/6.png',
  '/assets/img/figma/7.png',
  '/assets/img/figma/8.png',
  '/assets/img/figma/9.png',
  '/assets/img/figma/10.png',
]

export default function Marquee() {
  return (
    <section id="marquee_box">
      <div className="height_divider_1"></div>

      {/* First marquee - images */}
      <div className="marquee">
        <div className="marquee__group">
          {topImages.map((src, i) => (
            <img
              key={`top-${i}`}
              loading="lazy"
              decoding="async"
              src={src}
              alt={`Figma design ${i + 1}`}
              width="400"
              height="267"
            />
          ))}
        </div>
        <div aria-hidden="true" className="marquee__group">
          {topImages.map((src, i) => (
            <img
              key={`top-dup-${i}`}
              loading="lazy"
              decoding="async"
              src={src}
              alt={`Figma design ${i + 1}`}
              width="400"
              height="267"
            />
          ))}
        </div>
      </div>

      {/* Second marquee - text with borders */}
      <div className="marquee marquee--borders" style={{ '--duration': '100s' } as React.CSSProperties}>
        <div className="marquee__group">
          <p>FIGMA</p>
          <p aria-hidden="true">SAMPLE</p>
          <p aria-hidden="true">FIGMA</p>
        </div>
        <div aria-hidden="true" className="marquee__group">
          <p>SAMPLE</p>
          <p>FIGMA</p>
          <p>SAMPLE</p>
        </div>
      </div>

      {/* Third marquee - reverse images */}
      <div className="marquee marquee--reverse">
        <div className="marquee__group">
          {bottomImages.map((src, i) => (
            <img
              key={`bottom-${i}`}
              loading="lazy"
              decoding="async"
              src={src}
              alt={`Figma design ${i + 6}`}
              width="400"
              height="267"
            />
          ))}
        </div>
        <div aria-hidden="true" className="marquee__group">
          {bottomImages.map((src, i) => (
            <img
              key={`bottom-dup-${i}`}
              loading="lazy"
              decoding="async"
              src={src}
              alt={`Figma design ${i + 6}`}
              width="400"
              height="267"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
