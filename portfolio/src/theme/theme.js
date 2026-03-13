export const THEME_STORAGE_KEY = 'portfolio-theme'

export const themePalettes = {
  dark: {
    canvas: {
      hero: {
        ambientIntensity: 0.5,
        directionalColor: '#ffffff',
        directionalIntensity: 1,
        primaryLightColor: '#61dafb',
        primaryLightIntensity: 0.6,
        secondaryLightColor: '#ffffff',
        secondaryLightIntensity: 0.4,
        orbitColor: '#61dafb',
      },
      about: {
        ambientIntensity: 0.4,
        keyLightColor: '#ffffff',
        keyLightIntensity: 0.8,
        fillLightColor: '#6366f1',
        fillLightIntensity: 0.4,
        starColor: '#ffffff',
        speedStarColor: '#ffffff',
        rocketBodyColor: '#e8e8e8',
        rocketAccentColor: '#6366f1',
        rocketWindowColor: '#61dafb',
        rocketRimColor: '#888888',
        rocketEngineColor: '#444444',
      },
      contact: {
        ambientIntensity: 0.25,
        primaryStarColor: '#ffffff',
        primaryStarOpacity: 0.7,
        accentStarColor: '#818cf8',
        accentStarOpacity: 0.6,
      },
    },
  },
  light: {
    canvas: {
      hero: {
        ambientIntensity: 0.8,
        directionalColor: '#ffffff',
        directionalIntensity: 1.1,
        primaryLightColor: '#4f46e5',
        primaryLightIntensity: 0.45,
        secondaryLightColor: '#f8fafc',
        secondaryLightIntensity: 0.6,
        orbitColor: '#4f46e5',
      },
      about: {
        ambientIntensity: 0.65,
        keyLightColor: '#ffffff',
        keyLightIntensity: 1,
        fillLightColor: '#818cf8',
        fillLightIntensity: 0.35,
        starColor: '#4f46e5',
        speedStarColor: '#3730a3',
        rocketBodyColor: '#f8fafc',
        rocketAccentColor: '#4f46e5',
        rocketWindowColor: '#93c5fd',
        rocketRimColor: '#cbd5e1',
        rocketEngineColor: '#94a3b8',
      },
      contact: {
        ambientIntensity: 0.35,
        primaryStarColor: '#94a3b8',
        primaryStarOpacity: 0.5,
        accentStarColor: '#6366f1',
        accentStarOpacity: 0.45,
      },
    },
  },
}
