'use client'

import { useEffect, useState, useRef } from 'react'

export default function SoundToggle() {
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const storageKey = 'sectionSfxEnabled'
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === '0' || stored === 'false') {
        setSfxEnabled(false)
      }
    } catch {}

    const initAudio = () => {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx || audioCtxRef.current) return
      audioCtxRef.current = new AudioCtx()
    }

    const unlockAudio = () => {
      initAudio()
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }
    }

    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  const toggleSound = () => {
    const nextState = !sfxEnabled
    setSfxEnabled(nextState)
    try {
      localStorage.setItem('sectionSfxEnabled', nextState ? '1' : '0')
    } catch {}

    if (nextState && audioCtxRef.current && audioCtxRef.current.state === 'running') {
      try {
        const ctx = audioCtxRef.current
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, now)
        gain.gain.setValueAtTime(0.001, now)
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
      } catch {}
    }
  }

  return (
    <button
      id="sfx-toggle"
      className={`sfx-toggle ${!sfxEnabled ? 'is-off' : ''}`}
      type="button"
      aria-pressed={sfxEnabled}
      onClick={toggleSound}
      aria-label={sfxEnabled ? 'Turn sound effects off' : 'Turn sound effects on'}
      title={sfxEnabled ? 'Sound effects on' : 'Sound effects off'}
    >
      <i className={`bi ${sfxEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}`} aria-hidden="true"></i>
    </button>
  )
}