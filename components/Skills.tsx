'use client'

import { useEffect, useRef } from 'react'

export default function Skills() {
  const cloudRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cloud = cloudRef.current
    if (!cloud) return

    const elements = Array.from(cloud.querySelectorAll<HTMLElement>('.cloud-element'))
    if (!elements.length) return

    let tooltip = tooltipRef.current
    if (!tooltip) {
      tooltip = cloud.querySelector('.cloud-tooltip') as HTMLDivElement | null
      if (!tooltip) {
        tooltip = document.createElement('div')
        tooltip.className = 'cloud-tooltip'
        cloud.appendChild(tooltip)
      }
    }

    const basePitchVel = 0.0018
    const baseYawVel = 0.0022
    const maxDragSpeed = 0.045
    const damping = 0.93
    const minScale = 0.45
    const maxScale = 1.15
    const minOpacity = 0.35
    const maxOpacity = 1.0
    const maxBlur = 2.0

    let resizeTimer: NodeJS.Timeout | null = null
    let radius = 220
    let width = 600
    let height = 600
    let elementSize = 60
    let isVisible = true
    let isHovering = false
    let isDragging = false
    let activeHoverIndex = -1
    let curPitch = basePitchVel
    let curYaw = baseYawVel
    let targetPitch = basePitchVel
    let targetYaw = baseYawVel
    let startX = 0
    let startY = 0
    let lastTime = 0
    let animationFrameId: number | null = null

    interface CloudItem {
      el: HTMLElement
      ux: number
      uy: number
      uz: number
      x: number
      y: number
      z: number
      skillName: string
    }

    let items: CloudItem[] = []

    const updateTooltipPos = (e: MouseEvent | PointerEvent | Touch) => {
      if (!tooltip) return
      const rect = cloud.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      tooltip.style.left = `${offsetX}px`
      tooltip.style.top = `${offsetY}px`
    }

    const updateDimensions = () => {
      const rect = cloud.getBoundingClientRect()
      width = rect.width || 600
      height = rect.height || 600
      elementSize = elements[0]?.offsetWidth || 60
      const minDim = Math.min(width, height)
      radius = Math.max(110, minDim / 2 - 0.7 * elementSize)
      items.forEach((item) => {
        item.x = item.ux * radius
        item.y = item.uy * radius
        item.z = item.uz * radius
      })
    }

    const initSphereItems = () => {
      const count = elements.length
      const goldAngle = Math.PI * (3 - Math.sqrt(5))

      items = elements.map((el, i) => {
        const s = 1 - (i / (count - 1 || 1)) * 2
        const radXZ = Math.sqrt(1 - s * s)
        const theta = i * goldAngle
        const ux = Math.cos(theta) * radXZ
        const uy = s
        const uz = Math.sin(theta) * radXZ
        const img = el.querySelector('img')
        let name = 'Skill'
        if (img) {
          name = img.getAttribute('alt') || img.getAttribute('data-name') || img.getAttribute('title') || 'Skill'
          if (!img.getAttribute('alt')) img.setAttribute('alt', name)
          if (!img.getAttribute('title')) img.setAttribute('title', name)
        } else {
          name = el.getAttribute('data-name') || el.textContent?.trim() || 'Skill'
        }

        el.addEventListener('mouseenter', (ev: MouseEvent) => {
          activeHoverIndex = i
          isHovering = true
          if (tooltip) {
            tooltip.textContent = name
            tooltip.classList.add('active')
            updateTooltipPos(ev)
          }
        })

        el.addEventListener('mousemove', (ev: MouseEvent) => {
          if (activeHoverIndex === i) {
            updateTooltipPos(ev)
          }
        })

        el.addEventListener('mouseleave', () => {
          if (activeHoverIndex === i) {
            activeHoverIndex = -1
            isHovering = false
            if (tooltip) {
              tooltip.classList.remove('active')
            }
          }
        })

        return {
          el,
          ux,
          uy,
          uz,
          x: ux * radius,
          y: uy * radius,
          z: uz * radius,
          skillName: name
        }
      })
    }

    const rotateCoordinates = (pitch: number, yaw: number) => {
      const cosPitch = Math.cos(pitch)
      const sinPitch = Math.sin(pitch)
      const cosYaw = Math.cos(yaw)
      const sinYaw = Math.sin(yaw)

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const x1 = item.x * cosYaw + item.z * sinYaw
        const z1 = -item.x * sinYaw + item.z * cosYaw
        const y2 = item.y * cosPitch - z1 * sinPitch
        const z2 = item.y * sinPitch + z1 * cosPitch

        item.x = x1
        item.y = y2
        item.z = z2
        item.ux = item.x / (radius || 1)
        item.uy = item.y / (radius || 1)
        item.uz = item.z / (radius || 1)
      }
    }

    const renderLoop = () => {
      if (!isVisible) return

      if (isDragging) {
        curPitch = targetPitch
        curYaw = targetYaw
      } else if (isHovering) {
        curPitch += 0.08 * (0.25 * basePitchVel - curPitch)
        curYaw += 0.08 * (0.25 * baseYawVel - curYaw)
      } else {
        curPitch += (targetPitch - curPitch) * (1 - damping)
        curYaw += (targetYaw - curYaw) * (1 - damping)
        targetPitch += 0.03 * (basePitchVel - targetPitch)
        targetYaw += 0.03 * (baseYawVel - targetYaw)
      }

      rotateCoordinates(curPitch, curYaw)

      const halfW = width / 2
      const halfH = height / 2

      for (let i = 0; i < items.length; i++) {
        if (i === activeHoverIndex) continue
        const item = items[i]
        const normZ = item.z / (radius || 1)
        const depth = (normZ + 1) / 2
        const scale = minScale + depth * (maxScale - minScale)
        const opacity = minOpacity + depth * (maxOpacity - minOpacity)
        const zIndex = Math.round(100 * (normZ + 1))
        const blur = (1 - depth) * maxBlur
        const posX = halfW + item.x - elementSize / 2
        const posY = halfH + item.y - elementSize / 2
        const style = item.el.style

        style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0px) scale(${scale.toFixed(3)})`
        style.opacity = opacity.toFixed(2)
        style.zIndex = zIndex.toString()
        style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none'
      }

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = cloud.getBoundingClientRect()
      const relX = e.clientX - rect.left - width / 2
      const relY = e.clientY - rect.top - height / 2

      if (isDragging) {
        const now = performance.now()
        const dt = Math.max(1, now - lastTime)
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        targetYaw = (dx / dt) * 0.045
        targetPitch = -(dy / dt) * 0.045
        targetPitch = Math.max(-maxDragSpeed, Math.min(maxDragSpeed, targetPitch))
        targetYaw = Math.max(-maxDragSpeed, Math.min(maxDragSpeed, targetYaw))
        startX = e.clientX
        startY = e.clientY
        lastTime = now
      } else if (!isHovering) {
        targetYaw = (relX / (width / 2)) * baseYawVel * 2.5
        targetPitch = -(relY / (height / 2)) * basePitchVel * 2.5
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      lastTime = performance.now()
    }

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        lastTime = performance.now()
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0]
        const now = performance.now()
        const dt = Math.max(1, now - lastTime)
        const dx = touch.clientX - startX
        const dy = touch.clientY - startY
        targetYaw = (dx / dt) * 0.045
        targetPitch = -(dy / dt) * 0.045
        targetPitch = Math.max(-maxDragSpeed, Math.min(maxDragSpeed, targetPitch))
        targetYaw = Math.max(-maxDragSpeed, Math.min(maxDragSpeed, targetYaw))
        startX = touch.clientX
        startY = touch.clientY
        lastTime = now
      }
    }

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        updateDimensions()
      }, 100)
    }

    cloud.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })

    cloud.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onPointerUp, { passive: true })

    window.addEventListener('resize', onResize)

    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting
            if (isVisible) {
              if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
              animationFrameId = requestAnimationFrame(renderLoop)
            }
          })
        },
        { threshold: 0.05 }
      )
      observer.observe(cloud)
    }

    initSphereItems()
    updateDimensions()
    animationFrameId = requestAnimationFrame(renderLoop)

    return () => {
      cloud.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      cloud.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onPointerUp)
      window.removeEventListener('resize', onResize)
      if (observer) observer.disconnect()
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="text-center">
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                TECH STACK
                <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden className="Title__filled">TECH STACK</div>
            </div>
          </div>
          <div className="height_divider_1"></div>
        </div>
      </div>

      <div className="container">
        {/* Frontend */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-tre_v29"><span>React</span></li>
                  <li className="sk-dis_v29"><span>Svelte</span></li>
                  <li className="sk-dtb_v29"><span>NodeJS</span></li>
                  <li className="sk-tre_v29"><span>NextJS</span></li>
                  <li className="sk-pro_v29"><span>PHP</span></li>
                  <li className="sk-dis_v29"><span>JAVA</span></li>
                  <li className="sk-dtb_v29"><span>Python</span></li>
                  <li className="sk-ani_v29"><span>Docker</span></li>
                  <li className="sk-cms_v29"><span>Apache HTTP Server</span></li>
                  <li className="sk-dis_v29"><span>JSON Web Token (JWT)</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>Vue</span></li>
                  <li className="sk-dis_v29"><span>Astro</span></li>
                  <li className="sk-gim_v29"><span>ExpressJS</span></li>
                  <li className="sk-dis_v29"><span>NuxtJS</span></li>
                  <li className="sk-gim_v29"><span>LARAVEL</span></li>
                  <li className="sk-ani_v29"><span>Springboot</span></li>
                  <li className="sk-dtb_v29"><span>Django</span></li>
                  <li className="sk-jav_v29"><span>Zustand</span></li>
                  <li className="sk-ani_v29"><span>MCP</span></li>
                  <li className="sk-css_v29"><span>Progressive Web App (PWA)</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-wor_v29"><span>Angular</span></li>
                  <li className="sk-cms_v29"><span>Tanstack</span></li>
                  <li className="sk-gim_v29"><span>TYPESCRIPT</span></li>
                  <li className="sk-gim_v29"><span>NestJS</span></li>
                  <li className="sk-pro_v29"><span>JQuery</span></li>
                  <li className="sk-ani_v29"><span>RestAPI</span></li>
                  <li className="sk-cms_v29"><span>GraphQL</span></li>
                  <li className="sk-dis_v29"><span>Firebase</span></li>
                  <li className="sk-dis_v29"><span>Supabase</span></li>
                  <li className="sk-cms_v29"><span>OAuth 2.0</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Databases */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-php_v29"><span>MySQL</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-sql_v29"><span>MongoDB</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-pug_v29"><span>POSTGRESQL</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CSS */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-wor_v29"><span>TAILWIND</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-tre_v29"><span>MATERIAL UI</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-htm_v29"><span>BOOTSTRAP</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CMS */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-tre_v29"><span>Wordpress</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-not_v29"><span>Adobe Experience Manager</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-wor_v29"><span>Sharepoint</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Version Control */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-res_v29"><span>GitHub</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-cms_v29"><span>TFS</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-dis_v29"><span>Sourcetree</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Software */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-tre_v29"><span>PHOTOSHOP</span></li>
                  <li className="sk-dtb_v29"><span>PREMIERE PRO</span></li>
                  <li className="sk-dis_v29"><span>AFTER EFFECTS</span></li>
                  <li className="sk-pro_v29"><span>PRO CREATE</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-res_v29"><span>ILLUSTRATOR</span></li>
                  <li className="sk-tre_v29"><span>INDESIGN</span></li>
                  <li className="sk-tri_v29"><span>FIGMA</span></li>
                  <li className="sk-dis_v29"><span>CINEMA4D</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-pro_v29"><span>DREAMWEAVER</span></li>
                  <li className="sk-dtb_v29"><span>XD</span></li>
                  <li className="sk-gim_v29"><span>BALSAMIQ</span></li>
                  <li className="sk-cms_v29"><span>SONY VEGAS PRO</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Coding Assistant */}
        <div className="row skills_v29-row_v3">
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-not_v29"><span>GITHUB COPILOT</span></li>
                  <li className="sk-tre_v29"><span>Cursor</span></li>
                  <li className="sk-dtb_v29"><span>DeepSeek Harness</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-not_v29"><span>CLAUDE CODE</span></li>
                  <li className="sk-not_v29"><span>AntiGravity</span></li>
                  <li className="sk-dtb_v29"><span>Unsloth</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>CLINE</span></li>
                  <li className="sk-dtb_v29"><span>Devin</span></li>
                  <li className="sk-not_v29"><span>OmniRoute</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br /><br /><br />

      {/* Tag cloud */}
      <div className="container_cloud">
        <div id="cl" className="cloud" ref={cloudRef}>
          <div className="cloud-tooltip" ref={tooltipRef}></div>
          {[
            { name: 'React.js', src: 'react.png' },
            { name: 'Next.js', src: 'next.png' },
            { name: 'JavaScript', src: 'js.png' },
            { name: 'TypeScript', src: 'TS.png' },
            { name: 'HTML5', src: 'html.png' },
            { name: 'CSS3', src: 'css.png' },
            { name: 'Tailwind CSS', src: 'tailwind.png' },
            { name: 'Bootstrap', src: 'bootstrap.png' },
            { name: 'Material UI', src: 'material.png' },
            { name: 'Node.js', src: 'node.png' },
            { name: 'Express.js', src: 'express.png' },
            { name: 'NestJS', src: 'nest.png' },
            { name: 'Vue.js', src: 'Vue.png' },
            { name: 'Nuxt.js', src: 'nuxt.png' },
            { name: 'Angular', src: 'Angular.png' },
            { name: 'Astro', src: 'Astro.png' },
            { name: 'Vite', src: 'Vite.png' },
            { name: 'Webpack', src: 'webpack.png' },
            { name: 'Python', src: 'Python.png' },
            { name: 'Django', src: 'Django.png' },
            { name: 'Java', src: 'Java.png' },
            { name: 'Spring Boot', src: 'Springboot.png' },
            { name: 'PHP', src: 'php.png' },
            { name: 'Laravel', src: 'Laravel.png' },
            { name: 'MongoDB', src: 'MonggoDB.png' },
            { name: 'PostgreSQL', src: 'PostgreSQL.png' },
            { name: 'MySQL', src: 'Mysq.png' },
            { name: 'SQLite', src: 'SQLite.png' },
            { name: 'Prisma ORM', src: 'Prisma.png' },
            { name: 'Axios', src: 'Axios.png' },
            { name: 'Git', src: 'git.png' },
            { name: 'GitHub', src: 'github.png' },
            { name: 'GitHub Copilot', src: 'githu-copilot.png' },
            { name: 'Claude AI', src: 'claude.png' },
            { name: 'Cursor IDE', src: 'cursor.png' },
            { name: 'Cline AI', src: 'cline.png' },
            { name: 'OpenAI Codex', src: 'codex-openai.png' },
            { name: 'Anti-Gravity AI', src: 'Anti-gravity.png' },
            { name: 'Figma', src: 'figma.png' },
            { name: 'Photoshop', src: 'ps.png' },
            { name: 'Illustrator', src: 'ai.png' },
            { name: 'Adobe XD', src: 'xd.png' },
            { name: 'After Effects', src: 'Ae.png' },
            { name: 'Premiere Pro', src: 'PR.png' },
            { name: 'Lightroom', src: 'lr.png' },
            { name: 'InDesign', src: 'Id.png' },
            { name: 'Dreamweaver', src: 'dw.png' },
            { name: 'WordPress', src: 'wordpress.png' },
            { name: 'Elementor', src: 'elementor.png' },
            { name: 'WooCommerce', src: 'woo.png' },
            { name: 'SharePoint', src: 'sharepoint.png' },
            { name: 'Sitefinity', src: 'sitefinity.png' },
            { name: 'Adobe AEM', src: 'aem.png' },
            { name: 'Vercel', src: 'Vercel.png' },
            { name: 'Netlify', src: 'netlify.png' },
            { name: 'npm', src: 'npm.png' },
            { name: 'Composer', src: 'composer.png' },
            { name: 'Bash Shell', src: 'bash.png' },
            { name: 'PowerShell', src: 'powershell.png' },
            { name: 'Jira', src: 'jira.png' },
            { name: 'Sourcetree', src: 'sourcetree.png' },
            { name: 'jQuery', src: 'jquery.png' },
            { name: 'Filmora', src: 'filmora.png' },
            { name: 'Photodex', src: 'photodex.png' },
          ].map((item, i) => (
            <div className="cloud-element" key={i}>
              <img
                src={`/assets/img/skills/${item.src}`}
                alt={item.name}
                title={item.name}
                data-name={item.name}
                width="50"
                height="50"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
      <div className="group">
        <div className="is-floated"></div>
        <div className="is-floated"></div>
        <div className="is-floated"></div>
      </div>
    </section>
  )
}