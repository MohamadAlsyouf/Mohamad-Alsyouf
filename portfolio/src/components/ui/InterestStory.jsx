import { useLayoutEffect, useState } from 'react'
import Icon from './Icon'

export default function InterestStory({
  interest,
  anchor,
  scene,
  panel,
  id,
  onClose,
}) {
  const [position, setPosition] = useState({ left: 12, top: 60 })

  useLayoutEffect(() => {
    function place() {
      if (!anchor || !panel.current || !scene.current) return
      const bounds = scene.current.getBoundingClientRect()
      const target = anchor.getBoundingClientRect()
      const { width, height } = panel.current.getBoundingClientRect()
      const gap = 14
      const minLeft = bounds.left + 12
      const maxLeft = Math.max(minLeft, bounds.right - width - 12)
      let left = target.right + gap
      let top = target.top + (target.height - height) / 2

      if (left + width > bounds.right - 12) {
        left = target.left - width - gap
        if (left < minLeft) {
          left = target.left + (target.width - width) / 2
          top = target.top - height - gap
          if (top < 106) top = target.bottom + gap
        }
      }

      // Keep the whole card in the viewport, including below the sticky nav.
      left = Math.max(minLeft, Math.min(left, maxLeft))
      top = Math.max(106, Math.min(top, window.innerHeight - height - 16))
      setPosition({ left: left - bounds.left, top: top - bounds.top })
    }

    function followScroll() {
      const bounds = scene.current?.getBoundingClientRect()
      if (!bounds || bounds.bottom < 106 || bounds.top > window.innerHeight) {
        onClose()
        return
      }
      place()
    }

    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', followScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', followScroll)
    }
  }, [interest.kind, anchor, panel, scene, onClose])

  return (
    <aside
      ref={panel}
      id={id}
      className="interest-story"
      style={position}
      role="region"
      aria-labelledby={`${id}-title`}
      data-interest={interest.kind}
    >
      <div className="interest-story-heading">
        <h3 id={`${id}-title`}>{interest.name}</h3>
        <button
          type="button"
          className="interest-story-close"
          aria-label="Close interest details"
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <p className="interest-story-description">{interest.detail}</p>
      {interest.background && (
        <p className="interest-story-fact">{interest.background}</p>
      )}
      {interest.link && (
        <a
          className="text-link interest-story-link"
          href={interest.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {interest.link.label}
          <Icon size={17} />
        </a>
      )}
    </aside>
  )
}
