import { useTheme } from '../../context/ThemeContext'
import Icon from './Icon'
export default function ThemeToggleButton() {
  const { isLightMode, toggleTheme } = useTheme()
  const label = isLightMode ? 'Switch to dark mode' : 'Switch to light mode'
  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Icon name={isLightMode ? 'moon' : 'sun'} size={19} />
    </button>
  )
}
