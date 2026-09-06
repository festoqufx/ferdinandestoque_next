'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface Project {
  title: string
  description: string
  image: string
  liveUrl: string
  githubUrl: string
  category: 'React' | 'Vue' | 'Angular'
  filterClass: 'filter-app' | 'filter-card' | 'filter-web'
}

const projects: Project[] = [
  {
    title: 'Soduko solver',
    description: 'A puzzle solver built with React',
    image: '/assets/img/portfolio/portfolio-1.jpg',
    liveUrl: 'https://sudoku-solver-raven.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/sudoku-solver-raven',
    category: 'React',
    filterClass: 'filter-app',
  },
  {
    title: 'MyOnlineSite',
    description: 'A portfolio website',
    image: '/assets/img/portfolio/portfolio-2.jpg',
    liveUrl: 'https://festoque-v1-blkred.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/festoque_v1_blkred',
    category: 'Angular',
    filterClass: 'filter-web',
  },
  {
    title: 'WorldsTime',
    description: 'A world clock application',
    image: '/assets/img/portfolio/portfolio-3.jpg',
    liveUrl: 'https://next-world-time-raven-v1.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/next-world-time-raven',
    category: 'React',
    filterClass: 'filter-app',
  },
  {
    title: 'Space Snake',
    description: 'A game built with Vue',
    image: '/assets/img/portfolio/portfolio-4.jpg',
    liveUrl: 'https://vue-space-snake-raven.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/vue-space-snake-raven',
    category: 'Vue',
    filterClass: 'filter-card',
  },
  {
    title: 'Memory Matrix',
    description: 'A memory card game',
    image: '/assets/img/portfolio/portfolio-5.jpg',
    liveUrl: 'https://angular-memory-card-game-raven.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/angular-memory-card-game-raven',
    category: 'Angular',
    filterClass: 'filter-web',
  },
  {
    title: 'NEXT IDE',
    description: 'A web-based IDE',
    image: '/assets/img/portfolio/portfolio-6.jpg',
    liveUrl: 'https://next-web-based-ide-raven.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/next-web-based-ide-raven',
    category: 'React',
    filterClass: 'filter-app',
  },
  {
    title: 'Digital Signature Pro',
    description: 'A digital signature application',
    image: '/assets/img/portfolio/portfolio-7.jpg',
    liveUrl: 'https://digital-signature-raven-pro.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/digital-signature-raven-pro',
    category: 'Vue',
    filterClass: 'filter-card',
  },
  {
    title: 'Whats for Dinner Wheel',
    description: 'A meal planning wheel',
    image: '/assets/img/portfolio/portfolio-9.jpg',
    liveUrl: 'https://vue-whats-for-dinner-wheel-raven.vercel.app/',
    githubUrl: 'https://github.com/festoqufx/vue-whats-for-dinner-wheel-raven',
    category: 'Vue',
    filterClass: 'filter-card',
  },
  {
    title: 'Echoes music player',
    description: 'A music player',
    image: '/assets/img/portfolio/portfolio-8.jpg',
    liveUrl: 'https://festoqufx-github-io-echoes-music-pl.vercel.app/#/search/videos',
    githubUrl: 'https://github.com/festoqufx/festoqufx.github.io-echoes-music-player',
    category: 'Angular',
    filterClass: 'filter-web',
  },
]

const filterOptions = [
  { label: 'All', filter: '*' },
  { label: 'React', filter: '.filter-app' },
  { label: 'Vue', filter: '.filter-card' },
  { label: 'Angular', filter: '.filter-web' },
]

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<string>('*')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalIndex, setModalIndex] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number>(0)

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
  }

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === '*') return true
    return project.filterClass === activeFilter.replace('.', '')
  })

  // Modal handlers
  const openModal = (index: number) => {
    setModalIndex(index)
    setModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  const nextModalSlide = useCallback(() => {
    setModalIndex((prev) => (prev + 1) % filteredProjects.length)
  }, [filteredProjects.length])

  const prevModalSlide = useCallback(() => {
    setModalIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length)
  }, [filteredProjects.length])

  const goToModalSlide = (index: number) => {
    setModalIndex(index)
  }

  // Keyboard controls & body scroll lock for modal
  useEffect(() => {
    if (!modalOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowRight') {
        nextModalSlide()
      } else if (e.key === 'ArrowLeft') {
        prevModalSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalOpen, closeModal, nextModalSlide, prevModalSlide])

  // Touch gesture support for modal carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextModalSlide()
      } else {
        prevModalSlide()
      }
    }
  }

  // Glass-effect border spotlight tracking (--mx, --my custom CSS properties)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    const item = (e.target as HTMLElement).closest('.portfolio-item') as HTMLElement | null
    if (!item || !container.contains(item)) return
    const target = (item.querySelector('img') || item) as HTMLElement
    const rect = target.getBoundingClientRect()
    item.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    item.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const currentProject = filteredProjects[modalIndex] || filteredProjects[0]

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <div className="section-title">
          <div className="height_divider_1"></div>
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                Projects
                <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden="true" className="Title__filled">
                Projects
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <p>
              The following are sample applications and development tools I created using the latest front-end and
              back-end technologies. Each project showcases my technical skills and includes both a live deployment on
              Vercel and the corresponding GitHub repository for source code and documentation.
            </p>
          </div>
          <div className="height_divider_1"></div>
        </div>

        {/* Warning alert */}
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div
                className="alert alert-simple_v1 alert-danger_v1_v1 text-left show"
                style={{ color: '#ffffff', fontWeight: 'lighter', fontFamily: 'Lato' }}
              >
                <i className="fa fa-warning blinking-text_v1" style={{ color: '#ff0000', fontSize: '27px' }}></i>
                <strong style={{ color: '#ff0000' }}> Heads up!</strong> My website is continuously updated with new features and
                improvements. If you notice missing content, blank sections, or loading issues, please clear your{' '}
                <strong className="blinking-text_v1" style={{ color: '#ff0000', fontSize: '30px' }}>
                  browser cache
                </strong>{' '}
                and refresh the page to ensure you're viewing the most recent version.
              </div>
            </div>
          </div>
          <div className="height_divider_1"></div>
        </div>
      </div>

      {/* Project Filters */}
      <div className="container" style={{ margin: '0px auto 40px auto' }}>
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul id="portfolio-flters">
              {filterOptions.map((opt) => (
                <li
                  key={opt.filter}
                  data-filter={opt.filter}
                  className={activeFilter === opt.filter ? 'filter-active' : ''}
                  onClick={() => handleFilterClick(opt.filter)}
                  role="button"
                  tabIndex={0}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Portfolio Items Container */}
        <div
          ref={containerRef}
          className="row portfolio-container"
          onMouseMove={handleMouseMove}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.title}
              className={`col-lg-4 col-md-6 portfolio-item ${project.filterClass}`}
            >
              <img
                loading="lazy"
                decoding="async"
                src={project.image}
                className="img-fluid"
                alt={project.title}
                width="600"
                height="400"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(index)}
              />
              <div className="portfolio-info">
                <h4>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="site-link"
                    style={{ color: '#000' }}
                  >
                    <i className="bi bi-link"></i> {project.title}
                  </a>
                </h4>
                <a
                  href={project.image}
                  data-gallery="portfolioGallery"
                  className="portfolio-lightbox preview-link"
                  title={project.title}
                  role="button"
                  aria-label={`Preview ${project.title}`}
                  onClick={(e) => {
                    e.preventDefault()
                    openModal(index)
                  }}
                >
                  <i className="bi bi-plus" style={{ color: '#000' }}></i>
                </a>
                <a
                  href={project.githubUrl}
                  className="details-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="More Details"
                >
                  <i className="bi bi-github" style={{ color: '#000' }}></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cube button */}
      <div className="container" style={{ margin: '30px auto 30px auto' }}>
        <div className="row align-items-center">
          <div className="col-lg-4">
            <div className="continuous-7"></div>
          </div>
          <div
            className="col-lg-4"
            style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center' }}
          >
            <div className="button-icon_v2_v2 text-center">
              <div className="icon_v2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1083 1069"
                  width="25"
                  height="25"
                  aria-hidden="true"
                >
                  <path
                    d="M526.64 14.44C591.27 10.17 663.39 21.27 723.73 44.77C834.63 87.95 924.2 166.15 980.27 271.23C994.06 297.06 1006.49 324.7 1014.53 352.93C1027.57 398.68 1034.53 444.86 1035.38 492.5C1036.15 535.57 1030.11 579.77 1018.63 621.22C1002.05 681.04 972.85 739.1 934.4 787.87C923.54 801.65 911.6 814.34 899.58 827.09C860.78 868.26 812.75 902.05 761.68 926.16C706.33 952.28 646.72 968.24 585.5 971.85C522.85 975.55 460.55 966.13 401.24 946.3C349.35 928.95 302 902.01 258.92 868.53C216.41 835.5 181.81 795.11 151.68 750.79C124.75 711.18 105.2 663.6 92.88 617.56C85.48 589.89 79.48 561.11 77.23 532.5C76.05 517.58 76.06 502.45 76.08 487.5C76.09 475.18 76.05 462.78 77.18 450.5C92.17 287.48 189.62 141.65 335.23 66.73C395.01 35.97 459.71 18.87 526.64 14.44ZM541.62 35.46C501.22 37.28 461.48 42.29 422.73 54.28C282.44 97.68 167.16 207.43 120.64 347.23C108.48 383.79 100.25 421.99 97.88 460.5C97.26 470.51 96.91 480.45 96.9 490.5C96.9 493.3 96.34 496.74 96.95 499.47C97.59 502.32 101.48 504.97 103.51 506.99C109.01 512.49 114.52 517.98 120 523.5C135.79 539.38 151.72 555.12 167.49 571.01C171.89 575.43 185.97 587.72 188.41 592.08C190.4 595.62 190.8 600.58 192.02 604.46C194.45 612.16 197.26 619.78 200.19 627.3C209.35 650.82 220.62 673.99 234.16 695.32C271.41 754.01 321.1 805.17 383.59 836.94C399.7 845.13 416.57 851.96 433.65 857.83C442.71 860.95 452.32 862.92 461.25 866.34C466.81 868.47 478.95 882.82 483.84 887.66C499.23 902.93 514.5 918.33 529.91 933.58C534.27 937.89 538.59 942.24 542.92 946.58C544.48 948.13 546.56 951.19 548.65 951.95C552.72 953.42 568.36 952.2 573.5 952.06C757.26 946.78 923.53 823.62 986.3 651.73C998.67 617.88 1006.67 583.29 1011.33 547.59C1012.72 536.95 1013.6 526.24 1013.87 515.5C1013.97 511.34 1014.94 505.64 1013.8 501.62C1013.19 499.46 1010.18 497.43 1008.6 495.9C1004.38 491.79 1000.2 487.64 996 483.5C983.91 471.58 971.56 459.96 959.59 447.91C954.76 443.05 946.37 436.22 943.31 430.23C941.28 426.25 940.83 420.93 939.78 416.61C937.42 406.9 934.68 397.24 931.8 387.66C923.61 360.49 912.58 333.56 898.83 308.69C858.71 236.09 796.54 177.52 720.45 144.06C702.68 136.24 684.22 129.89 665.41 125.19C657.81 123.29 650.14 121.63 642.48 120.08C639.49 119.48 636.24 119.26 633.36 118.24C628.83 116.62 618.57 104.01 614.58 99.92C599.91 84.91 585.62 69.54 571.09 54.41C566.85 49.99 562.74 45.38 558.65 40.82C557.28 39.29 555.78 36.52 553.85 35.66C550.66 34.25 545.05 35.3 541.62 35.46ZM538.69 85.45C547.91 84.84 567.84 83.19 576.1 86.47C580.67 88.29 587.67 96.5 591.38 100.11C602.7 111.13 613.79 122.38 624.99 133.51C629.01 137.49 635.59 145.92 640.51 148.08C643.23 149.28 646.52 149.55 649.4 150.25C655.7 151.8 662.02 153.42 668.22 155.37C687 161.28 705.48 168.65 723.12 177.43C791.27 211.33 837.78 259.31 876.35 324.17C888.5 344.6 897.13 367.31 904.64 389.77C907.27 397.64 909.51 405.76 911.61 413.79C912.31 416.5 912.62 419.94 914.05 422.38C916.88 427.23 923.13 431.47 927.25 435.26C936.11 443.4 944.64 451.89 953.73 459.78C956.68 462.33 968.23 471.47 969.01 474.54C970.44 480.2 968.2 494.89 967.93 501.5C966.82 529.02 962.64 556.62 957.1 583.53C952.63 605.2 946.99 626.71 938.74 647.3C905.6 730.11 836.59 806.21 758.73 849.23C700.26 881.54 634.16 899.19 567.5 901.73C556.81 902.14 546.17 901.93 535.5 901.27C531.21 901 525.92 901.46 521.94 899.49C517.43 897.26 513.47 891.09 509.99 887.51C499.29 876.52 489.11 865.05 478.59 853.89C474.33 849.37 469.91 842.04 464.4 839.08C457.94 835.61 449.66 834.13 442.73 831.7C429.8 827.17 417.05 821.8 404.77 815.71C352.26 789.66 306.37 749.68 272.66 701.81C257.5 680.27 244.31 656.65 234.27 632.28C230.62 623.41 227.53 614.31 224.29 605.28C222.98 601.63 222.13 596.86 219.92 593.65C216.11 588.12 209.42 583.59 204.6 578.91C193.44 568.06 182.16 557.35 170.95 546.55C166.74 542.5 155.11 534 153.56 528.83C152.78 526.24 153.11 523.18 152.91 520.5C152.09 509.49 151.46 498.56 151.74 487.5C152.57 454.62 156.74 422.26 164.8 390.42C198.21 258.31 290.72 155.82 418.64 109.21C457.3 95.13 497.75 88.15 538.69 85.45ZM544.8 154.47C523.83 156.6 503.26 158.72 482.64 163.24C474.24 165.08 466.41 168.12 458.27 170.69C430.07 179.56 402.84 192.23 378.17 208.62C362.72 218.88 347.62 229.93 333.59 242.06C326.28 248.38 319.83 255.71 313.36 262.84C297.22 280.63 282.74 299.23 270.35 319.84C266.37 326.46 261.81 332.97 258.43 339.93C239.76 378.4 227.01 419.9 223.08 462.5C219.78 498.3 221.49 535.33 229.1 570.47C254.6 688.21 342.71 784.06 456.56 821.91C500.6 836.56 547.18 841.48 593.5 837.83C640.69 834.11 688.99 820.43 730.2 796.67C792.64 760.68 843.47 708.21 874.32 642.78C877.49 636.06 881.19 629.24 883.81 622.3C887.56 612.35 890.43 601.97 893.34 591.75C897.67 576.61 902.22 561.21 903.9 545.5C907.05 516.03 907.7 477.84 903.92 448.5C902.02 433.71 898.45 419.08 894.77 404.66C891.86 393.29 887.61 382.14 883.32 371.24C845.86 276.23 767.4 201.37 669.76 170.66C655.42 166.15 641.41 162.12 626.54 159.78C599.8 155.57 571.96 151.71 544.8 154.47ZM638.12 452.5C631.24 462.14 621.72 470.49 613.39 478.89C599.45 492.94 585.51 507.03 571.26 520.76C564.98 526.82 558.71 532.89 552.42 538.93C549.89 541.35 546.55 545.44 543.3 546.79C537.14 549.35 521.62 547.93 514.5 547.93C504.5 547.93 494.5 548 484.5 547.93C480.03 547.89 475.46 548.58 472.5 544.82C472.66 541.27 475.65 538.98 477.92 536.38C483.2 530.36 488.85 524.68 494.47 518.96C509.83 503.32 525.54 488.02 540.82 472.32C546.59 466.39 556.54 458.59 560.17 451.5C556.28 446.74 551.72 442.49 547.34 438.17C545.65 436.5 543.33 433.31 541.05 432.53C537.07 431.16 525.28 432.3 520.5 432.3C504.5 432.3 488.5 432.3 472.5 432.3C427.17 432.3 381.83 432.3 336.5 432.3C313.14 432.3 288.73 433.77 265.5 432.09C263.07 422.49 275.83 413.62 282 407.5C288.52 401.02 295.12 394.62 301.65 388.15C304.04 385.78 307.33 381.13 310.59 380.06C314.91 378.64 320.97 379.69 325.5 379.69C336.5 379.69 347.5 379.69 358.5 379.69C408.17 379.69 457.83 379.69 507.5 379.69C521.5 379.69 535.5 379.69 549.5 379.69C554.26 379.69 564.14 378.44 568.25 380.25C571.45 381.67 576.69 388.43 579.4 391.1C588.28 399.89 597.09 408.75 605.91 417.59C613.56 425.26 621.37 432.81 628.67 440.81C631.96 444.41 636.52 447.89 638.12 452.5ZM719.76 381.5C719.76 410.28 719.76 439.06 719.76 467.84C720.46 467.58 721.29 467.7 721.96 467.36C723.44 466.6 725.33 463.26 726.47 461.93C730.14 457.64 733.81 453.32 737.61 449.14C752.39 432.87 766.62 416.14 781.45 399.93C784.48 396.62 795.83 382.85 798.88 381.46C801.58 380.22 805.59 380.93 808.5 380.93C815.83 380.93 823.17 380.91 830.5 380.93C837.5 380.95 844.5 381.07 851.5 381.07C855.53 381.08 859.47 380.55 862.54 383.5C861.64 389.15 856.28 393.88 852.45 397.95C844.85 406.03 837.77 414.68 830.6 423.15C805.43 452.9 778.88 481.53 754.07 511.61C745.99 521.4 737.52 531.09 728.91 540.41C726.42 543.11 723.23 548.84 719.87 550.35C716.67 551.79 710.99 550.7 707.5 550.7C698.5 550.7 689.5 550.63 680.5 550.43C676.46 550.33 671.52 550.94 668.17 548.5C666.11 543.42 667.02 536.94 666.98 531.5C666.89 520.5 666.92 509.5 666.93 498.5C666.96 472.83 666.99 447.17 667.1 421.5C667.16 408.68 665.93 395.08 667.5 382.37C671.69 380.24 677.74 381.19 682.5 381.15C692.86 381.05 710.34 379.28 719.76 381.5ZM452.07 544.5C448.42 550.82 442.56 555.81 437.61 561.13C426.85 572.67 415.54 583.73 404.33 594.83C400.88 598.24 389.66 611.26 386 612.45C382.94 613.44 378.7 612.71 375.5 612.71C368.17 612.71 360.83 612.71 353.5 612.71C335.17 612.71 316.83 612.73 298.5 612.71C288.96 612.7 277.3 613.98 268.29 610.5C269.08 603.73 279.59 594.93 284.37 589.85C290.51 583.33 296.8 576.97 303.1 570.6C305.1 568.56 308.01 564.29 310.81 563.47C314.22 562.47 318.95 563.29 322.5 563.29C330.5 563.29 338.5 563.29 346.5 563.29C349.74 563.29 354.3 564.11 357.37 562.99C359.47 562.23 361.51 559.13 363.04 557.54C367.16 553.28 371.56 549.14 375.24 544.5C370.13 536.51 361.26 529.72 354.55 522.95C340.11 508.38 325.84 493.67 311.46 479.05C305.26 472.75 289.35 459.82 288.07 451.5C291.05 449.21 295.75 449.54 299.5 449.28C309.09 448.61 318.88 448.93 328.5 448.93C335.83 448.93 343.17 448.94 350.5 448.93C353.4 448.93 357.39 448.23 360.07 449.49C362.98 450.87 365.82 455.13 368.07 457.42C373.69 463.14 379.38 468.78 385.04 474.46C400.02 489.48 414.99 504.51 429.92 519.57C436.19 525.89 448.59 536.82 452.07 544.5ZM867.57 608.5C864.56 611.44 859.57 611.56 855.5 611.75C846.85 612.14 838.16 612.07 829.5 612.12C800.5 612.31 771.5 612.39 742.5 612.54C734.17 612.59 725.83 612.63 717.5 612.67C714.49 612.68 710.06 613.52 707.27 612.26C703.75 610.67 700.38 605.57 697.69 602.82C689.79 594.78 681.68 586.72 674.2 578.28C670.57 574.18 667.17 570.17 668.88 564.5C699.86 563.83 730.84 563.17 761.81 562.5C758.3 557.79 749.91 550.99 750.29 544.56C750.5 541 753.76 537.91 755.92 535.39C761.13 529.32 766.67 523.46 772.03 517.52C774.3 515 777.29 511.41 781.12 512.46C783.89 513.22 786.18 516.46 787.98 518.5C792.67 523.82 797.08 529.38 801.96 534.53C817.38 550.81 832.19 567.61 847.52 583.97C852.76 589.56 865.54 601.73 867.57 608.5ZM691.11 609.5C686.06 612.46 678.28 611.49 672.5 611.72C658.18 612.29 643.83 612.11 629.5 612.19C576.84 612.5 524.17 612.31 471.5 612.31C455.5 612.31 439.49 612.52 423.5 612.2C418.31 612.09 409.95 613.42 406.19 609.5C414.28 596.8 426.76 586.44 437.42 575.92C440.43 572.95 446.57 565.13 450.15 563.64C454.19 561.96 464.77 563.29 469.5 563.29C484.17 563.29 498.83 563.29 513.5 563.29C544.5 563.29 575.5 563.29 606.5 563.29C615.83 563.29 625.17 563.29 634.5 563.29C638.27 563.29 643.38 562.4 646.98 563.56C649.62 564.41 651.98 567.72 653.89 569.6C658.76 574.4 663.63 579.21 668.53 583.98C674.31 589.61 689.33 602.37 691.11 609.5Z"
                    fill="#000000"
                    fillRule="evenodd"
                    stroke="#000000"
                    strokeWidth="0.25"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="cube_v2">
                <span className="side_v2 front_v2">All Projects</span>
                <span className="side_v2 top_v2">
                  <a
                    href="https://ravens-online-portfolio-v1.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ffffff' }}
                  >
                    Click here!
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Lightbox Modal with Slider / Carousel Navigation */}
      {modalOpen && currentProject && (
        <div
          className="portfolio-modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
        >
          {/* Top Bar: Counter & Close Button */}
          <div className="portfolio-modal-topbar" onClick={(e) => e.stopPropagation()}>
            <span className="portfolio-modal-counter">
              <i className="bi bi-images" style={{ marginRight: '6px' }}></i>
              {modalIndex + 1} / {filteredProjects.length}
            </span>
            <button
              type="button"
              className="portfolio-modal-close-btn"
              onClick={closeModal}
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Previous Slide Button */}
          {filteredProjects.length > 1 && (
            <button
              type="button"
              className="portfolio-modal-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation()
                prevModalSlide()
              }}
              aria-label="Previous project"
              title="Previous (Left Arrow)"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          )}

          {/* Modal Center Content / Slide */}
          <div
            className="portfolio-modal-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="portfolio-modal-image-container">
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="portfolio-modal-img"
              />
            </div>

            <div className="portfolio-modal-details">
              <div className="portfolio-modal-header">
                <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                  <h3 id="portfolio-modal-title" className="portfolio-modal-title mb-0">
                    {currentProject.title}
                  </h3>
                  <span className={`portfolio-modal-badge ${currentProject.filterClass}`}>
                    {currentProject.category}
                  </span>
                </div>
                <p className="portfolio-modal-description mb-3">
                  {currentProject.description}
                </p>
              </div>

              <div className="portfolio-modal-links d-flex gap-2 flex-wrap">
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-modal-action-btn primary"
                >
                  <i className="bi bi-link-45deg"></i>
                  <span>Live Demo</span>
                </a>
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-modal-action-btn secondary"
                >
                  <i className="bi bi-github"></i>
                  <span>Source Code</span>
                </a>
              </div>
            </div>
          </div>

          {/* Next Slide Button */}
          {filteredProjects.length > 1 && (
            <button
              type="button"
              className="portfolio-modal-nav-btn next"
              onClick={(e) => {
                e.stopPropagation()
                nextModalSlide()
              }}
              aria-label="Next project"
              title="Next (Right Arrow)"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          )}

          {/* Carousel Thumbnail/Dot Indicators */}
          {filteredProjects.length > 1 && (
            <div
              className="portfolio-modal-indicators"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredProjects.map((proj, idx) => (
                <button
                  key={proj.title}
                  type="button"
                  className={`portfolio-modal-indicator-dot ${modalIndex === idx ? 'active' : ''}`}
                  onClick={() => goToModalSlide(idx)}
                  aria-label={`Go to ${proj.title} (Slide ${idx + 1})`}
                  title={proj.title}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scoped styles for the portfolio modal lightbox & carousel navigation */}
      <style jsx>{`
        .portfolio-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 70px 20px 40px 20px;
          animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .portfolio-modal-topbar {
          position: absolute;
          top: 15px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100000;
        }

        .portfolio-modal-counter {
          color: #ffffff;
          font-family: 'Orbitron', monospace, sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px 14px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          backdrop-filter: blur(4px);
        }

        .portfolio-modal-close-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          backdrop-filter: blur(4px);
        }

        .portfolio-modal-close-btn:hover {
          background: #ff0019;
          border-color: #ff0019;
          color: #ffffff;
          transform: rotate(90deg) scale(1.08);
          box-shadow: 0 0 16px rgba(255, 0, 25, 0.6);
        }

        .portfolio-modal-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 100000;
          backdrop-filter: blur(6px);
        }

        .portfolio-modal-nav-btn.prev {
          left: 20px;
        }

        .portfolio-modal-nav-btn.next {
          right: 20px;
        }

        .portfolio-modal-nav-btn:hover {
          background: #ff0019;
          border-color: #ff0019;
          color: #ffffff;
          transform: translateY(-50%) scale(1.12);
          box-shadow: 0 0 20px rgba(255, 0, 25, 0.6);
        }

        .portfolio-modal-content {
          position: relative;
          max-width: 860px;
          width: 100%;
          max-height: calc(100vh - 120px);
          background: #121216;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85),
            0 0 35px rgba(255, 0, 25, 0.12);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          z-index: 99999;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .portfolio-modal-image-container {
          width: 100%;
          background: #08080a;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .portfolio-modal-img {
          width: 100%;
          max-height: 54vh;
          object-fit: contain;
          display: block;
          transition: opacity 0.25s ease;
        }

        .portfolio-modal-details {
          padding: 22px 26px;
          background: #121216;
        }

        .portfolio-modal-title {
          font-family: 'Orbitron', sans-serif;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .portfolio-modal-badge {
          display: inline-block;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 4px;
          color: #ffffff;
        }

        .portfolio-modal-badge.filter-app {
          background: #ff0019;
        }

        .portfolio-modal-badge.filter-card {
          background: #00c853;
        }

        .portfolio-modal-badge.filter-web {
          background: #d50000;
        }

        .portfolio-modal-description {
          color: #b0b0b8;
          font-size: 14px;
          line-height: 1.6;
          font-family: 'Lato', sans-serif;
        }

        .portfolio-modal-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .portfolio-modal-action-btn.primary {
          background: #ff0019;
          color: #ffffff;
          border: 1px solid #ff0019;
        }

        .portfolio-modal-action-btn.primary:hover {
          background: #d60015;
          border-color: #d60015;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(255, 0, 25, 0.5);
          transform: translateY(-1px);
        }

        .portfolio-modal-action-btn.secondary {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .portfolio-modal-action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .portfolio-modal-indicators {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 100000;
        }

        .portfolio-modal-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          border: none;
          background: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
        }

        .portfolio-modal-indicator-dot:hover {
          background: rgba(255, 255, 255, 0.75);
        }

        .portfolio-modal-indicator-dot.active {
          width: 26px;
          background: #ff0019;
          box-shadow: 0 0 10px rgba(255, 0, 25, 0.6);
        }

        @media (max-width: 768px) {
          .portfolio-modal-nav-btn {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .portfolio-modal-nav-btn.prev {
            left: 8px;
          }

          .portfolio-modal-nav-btn.next {
            right: 8px;
          }

          .portfolio-modal-details {
            padding: 16px;
          }

          .portfolio-modal-title {
            font-size: 17px;
          }
        }
      `}</style>
    </section>
  )
}
