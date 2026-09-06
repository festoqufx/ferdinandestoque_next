'use client'

const hobbies = [
  { icon: '/assets/img/icons/icons_1.png', label: 'Hobbies', title: 'CODING' },
  { icon: '/assets/img/icons/icons_3.png', label: 'Hobbies', title: 'GYM' },
  { icon: '/assets/img/icons/icons_2.png', label: 'Hobbies', title: 'GAMES' },
  { icon: '/assets/img/icons/icons_5.png', label: 'Hobbies', title: 'MOVIES' },
  { icon: '/assets/img/icons/icons_7.png', label: 'Hobbies', title: 'PAINTING' }
]

const interests = [
  { icon: '/assets/img/icons/icons_6.png', label: 'Interest', title: 'MUSIC' },
  { icon: '/assets/img/icons/icons_4.png', label: 'Interest', title: 'MARTIAL ARTS' },
  { icon: '/assets/img/icons/icons_8.png', label: 'Interest', title: 'PHOTOGRAPHY' },
  { icon: '/assets/img/icons/icons_9.png', label: 'Interest', title: 'READING' },
  { icon: '/assets/img/icons/icons_10.png', label: 'Interest', title: 'TRAVEL' }
]

export default function Hobbies() {
  return (
    <div className="container">
      <div className="height_divider_1"></div>
      <div className="container_title">
        <div className="Title">
          <h1 className="Title_h1">
            HOBBIES and INTERESTS
            <div className="Title__highlight"></div>
          </h1>
          <div className="Title__underline"></div>
          <div aria-hidden className="Title__filled">HOBBIES and INTERESTS</div>
        </div>
      </div>
      <div className="height_divider_1"></div>

      <div className="figure_box">
        {hobbies.map((item, index) => (
          <figure key={`hobby-${index}`} className="snip1229">
            <img src={item.icon} alt={item.title} width="376" height="338" />
            <figcaption className="figcaption_img">
              <div className="heading">
                <h3>{item.label}</h3>
              </div>
              <p>{item.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="figure_box">
        <br />
        {interests.map((item, index) => (
          <figure key={`interest-${index}`} className="snip1229">
            <img src={item.icon} alt={item.title} width="376" height="338" />
            <figcaption className="figcaption_img">
              <div className="heading">
                <h3>
                  <span>{item.label}</span>
                </h3>
              </div>
              <p>{item.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="clearfix"></div>
      <div className="height_divider_1"></div>
    </div>
  )
}