'use client'

import { useEffect, useRef } from 'react'

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

interface UseCloudTagAnimationOptions {
  basePitchVel?: number
  baseYawVel?: number
  maxDragSpeed?: number
  damping?: number
  minScale?: number
  maxScale?: number
  minOpacity?: number
  maxOpacity?: number
  maxBlur?: number
}

export function useCloudTagAnimation(
  cloudRef: React.RefObject<HTMLDivElement | null>,
  tooltipRef: React.RefObject<HTMLDivElement | null>,
  options: UseCloudTagAnimationOptions = {}
) {
  const animationFrameIdRef = useRef<number | null>(null)
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    basePitchVel = 0.0018,
    baseYawVel = 0.0022,
    maxDragSpeed = 0.045,
    damping = 0.93,
    minScale = 0.45,
    maxScale = 1.15,
    minOpacity = 0.35,
    maxOpacity = 1.0,
    maxBlur = 2.0,
  } = options

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
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => {
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
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
    }
  }, [
    cloudRef,
    tooltipRef,
    basePitchVel,
    baseYawVel,
    maxDragSpeed,
    damping,
    minScale,
    maxScale,
    minOpacity,
    maxOpacity,
    maxBlur,
  ])
}
