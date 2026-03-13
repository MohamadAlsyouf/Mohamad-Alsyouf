import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ThemeIcon = ({ isLightMode }) => {
  return (
    <motion.svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: isLightMode ? 0 : -24 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <motion.g
        initial={false}
        animate={{
          opacity: isLightMode ? 1 : 0,
          scale: isLightMode ? 1 : 0.6,
          rotate: isLightMode ? 0 : 60,
        }}
        transition={{ duration: 0.25 }}
      >
        <circle
          cx="12"
          cy="12"
          r="4.2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: isLightMode ? 0 : 1,
          scale: isLightMode ? 0.6 : 1,
          rotate: isLightMode ? -40 : 0,
        }}
        transition={{ duration: 0.25 }}
      >
        <path
          d="M15.8 3.6a7.8 7.8 0 1 0 4.6 14.2A8.9 8.9 0 1 1 15.8 3.6Z"
          fill="currentColor"
        />
        <path
          d="m17.4 6.1.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2ZM18.5 11.4l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3.3-.8Z"
          fill="currentColor"
        />
      </motion.g>
    </motion.svg>
  );
};

export default function ThemeToggleButton() {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-surface/90 text-foreground shadow-lg shadow-accent/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      whileTap={{ scale: 0.94 }}
      aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLightMode}
      title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
    >
      <ThemeIcon isLightMode={isLightMode} />
    </motion.button>
  );
}
