import { useEffect } from 'react'

// CSS motion only runs when the scene can actually be seen.
export default function useSceneActivity(ref) {
  useEffect(() => {
    const element = ref.current
    let inView = false
    const update = () => {
      element.dataset.active = String(inView && !document.hidden)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        update()
      },
      { rootMargin: '60px' },
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [ref])
}
