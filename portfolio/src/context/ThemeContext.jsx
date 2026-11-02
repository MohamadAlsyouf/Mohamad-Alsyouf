import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import {
  readPreference,
  savePreference,
  THEME_STORAGE_KEY,
} from '../theme/theme'

const ThemeContext = createContext(null)
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    readPreference(THEME_STORAGE_KEY, 'dark') === 'light' ? 'light' : 'dark',
  )
  const [motionPaused, setMotionPaused] = useState(
    () => readPreference('portfolio-motion', 'on') === 'off',
  )
  const systemReducedMotion = useReducedMotion()
  const reducedMotion = Boolean(systemReducedMotion || motionPaused)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#100d18' : '#f8f6ff')
    savePreference(THEME_STORAGE_KEY, theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full'
    savePreference('portfolio-motion', motionPaused ? 'off' : 'on')
  }, [reducedMotion, motionPaused])
  const toggleTheme = useCallback(
    (event) => {
      const change = () =>
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
      if (!document.startViewTransition || reducedMotion) {
        change()
        return
      }
      document.documentElement.style.setProperty(
        '--theme-x',
        `${event?.clientX || window.innerWidth / 2}px`,
      )
      document.documentElement.style.setProperty(
        '--theme-y',
        `${event?.clientY || 0}px`,
      )
      const transition = document.startViewTransition(() => flushSync(change))
      transition.ready.catch(() => {
        /* A superseded or hidden transition can be skipped. */
      })
    },
    [reducedMotion],
  )
  const value = useMemo(
    () => ({
      theme,
      isLightMode: theme === 'light',
      toggleTheme,
      reducedMotion,
      motionPaused,
      systemReducedMotion: Boolean(systemReducedMotion),
      toggleMotion: () => setMotionPaused((current) => !current),
    }),
    [theme, toggleTheme, reducedMotion, motionPaused, systemReducedMotion],
  )
  return (
    <ThemeContext.Provider value={value}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  )
}
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme requires ThemeProvider')
  return context
}
