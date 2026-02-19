# Mohamad Alsyouf | Developer Portfolio

A modern, interactive developer portfolio built with React, Three.js, and Framer Motion. Features 3D elements, smooth animations, and a clean dark theme.

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r158-000000?style=flat-square&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)

---

## Features

### Interactive 3D Elements

- **Hero Section** - React logo with BMW roundel nucleus, spinning animation
- **About Section** - Rocket ship that follows cursor with acceleration star trails
- **Contact Section** - Floating particle field background

### Smooth Animations

- Scroll-triggered fade-in animations
- 3D tilt effect on project cards
- Animated scroll indicator
- Framer Motion page transitions

### Modern Design

- Dark theme with indigo accent (#6366f1)
- Clean typography with Inter font
- Responsive layout for all devices
- Generous whitespace and minimal UI

---

## Tech Stack

| Category        | Technologies                      |
| --------------- | --------------------------------- |
| **Framework**   | React 18, Vite                    |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **Styling**     | Tailwind CSS                      |
| **Animation**   | Framer Motion                     |
| **Language**    | JavaScript (ES6+)                 |

---

## Project Structure

```
portfolio/
├── src/
│   ├── assets/              # Images and static files
│   ├── components/
│   │   ├── layout/          # Navbar
│   │   ├── sections/        # Hero, About, Skills, Projects, Contact
│   │   ├── three/           # 3D scenes and components
│   │   └── ui/              # Reusable UI components
│   ├── data/
│   │   └── content.js       # Portfolio content (edit this!)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MohamadAlsyouf/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Customization

### Personal Information

Edit `src/data/content.js` to update:

- Name, title, tagline
- Social links (GitHub, LinkedIn, Email)
- About text and stats
- Skills list
- Project details

### Styling

- Colors: `tailwind.config.js`
- Global styles: `src/index.css`

### 3D Elements

- Hero scene: `src/components/three/HeroScene.jsx`
- About rocket: `src/components/three/AboutScene.jsx`
- Contact particles: `src/components/three/ContactScene.jsx`

---

## Performance

- Lazy-loaded 3D scenes with Suspense boundaries
- Optimized procedural geometry (no heavy 3D models)
- Responsive 3D - simplified on mobile devices
- Vite for fast builds and HMR

---

If you're reading this, thank you for being super cool :D
