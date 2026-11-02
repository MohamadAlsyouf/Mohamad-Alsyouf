# Mohamad Alsyouf

Personal portfolio for Mohamad Alsyouf, senior full stack engineer and AI-native builder. Built to connect the work, the engineering decisions, and the people behind meaningful product outcomes.

**Website:** https://mohamadalsyouf.com/

The redesign pairs graphite and electric lime with oversized editorial typography, a rotating navy-blue E30 convertible, interactive project stories, and a complete light theme. The hiring story highlights enterprise delivery, cross-department collaboration, Scrum Master responsibilities, and AI-assisted engineering, grounded in the supplied October 2026 résumé.

## Run locally

Use Node.js 20.19+ or a current LTS release and npm.

```sh
cd portfolio
npm ci
npm run dev
```

Open the local URL printed by Vite. The application has no backend, API credentials, or required environment variables.

## Production build

```sh
cd portfolio
npm run build
npm run preview -- --host 127.0.0.1
```

The production output is `portfolio/dist/`. Vite's preview server normally runs at `http://127.0.0.1:4173`.

## Browser checks

With the production preview running in another terminal:

```sh
cd portfolio
npm run test:browser
```

The browser suite verifies the actual rendered site and its key interactions. It targets the preview at port 4173 by default. Use the test script's configuration for a different preview address or browser executable when needed. Generated screenshots and browser-test artifacts are ignored by Git.

The suite uses an installed Chrome or Edge browser and Node's built-in browser protocol support, without a browser-testing dependency. Set `CHROME_PATH` if the browser is installed outside the usual locations. A different preview address can be supplied with `node scripts/browser-check.mjs http://127.0.0.1:4173`.

## Architecture

| Location                                 | Purpose                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `portfolio/src/data/content.js`          | Personal details, résumé-backed metrics, project stories, experience, capabilities, workflow, and stack |
| `portfolio/src/components/sections/`     | Hero, selected work, engineering approach, capabilities, and contact                                    |
| `portfolio/src/components/layout/`       | Responsive navigation and global controls                                                               |
| `portfolio/src/components/three/`        | Procedural React Three Fiber scenes and canvas handling                                                 |
| `portfolio/src/components/ui/`           | Shared motion, icon, and interaction components                                                         |
| `portfolio/src/context/ThemeContext.jsx` | Theme persistence, view transitions, and motion preferences                                             |
| `portfolio/src/theme/theme.js`           | Safe preference storage helpers                                                                         |
| `portfolio/src/index.css`                | Design tokens, layout, responsive behavior, and animation                                               |
| `portfolio/index.html`                   | Font loading, initial theme, SEO metadata, and Person structured data                                   |
| `portfolio/public/`                      | Downloadable résumé, favicon, social preview, robots, and sitemap                                       |

The app uses React 18, Vite, Three.js, React Three Fiber, and Framer Motion. The hero loads its optimized 3D model from this site's own static assets; it does not make third-party runtime requests.

## E30 hero

The hero combines a licensed, textured E30 M3 exterior with an original four-seat black-leather cabin, dashboard, steering wheel, and controls. The roof, rear and side windows, pillars, and wing are removed from the source coupe. The result is a 1989-inspired convertible adaptation rather than a factory-exact digital twin.

The navy metallic finish is inspired by **Macao Blue metallic (Macaoblau, BMW code 250)**, referenced against [BMW's E30 M3 Convertible photographs](https://www.bmw-m.com/en/topics/magazine-article-pool/classic-bmw-m-paint-finishes.html). The shared palette in `e30Paint.js` keeps the body, painted cabin trim, rear cover, and fallback illustration consistent. Its screen colour is an artistic approximation under the site's studio lighting.

The exterior is adapted from **[FREE] BMW M3 E30** by **Martin Trafas**, licensed under **CC BY 4.0**. The hero displays the required credit; full source and license details are in `portfolio/public/models/LICENSE-E30.txt`. Preserve both when reusing the model. The self-contained `bmw-e30.glb` is approximately 3.6 MB, with compressed embedded textures and meshopt geometry. Attribution metadata remains embedded.

`HeroScene.jsx` provides a slow, frame-rate-independent turntable, studio reflections, responsive camera framing, and a static illustrated car fallback. Rendering pauses offscreen, when the tab is hidden, and when motion is disabled. `ImportedE30.jsx` preserves texture coordinates and smooth normals during the convertible conversion. `E30Interior.jsx` supplies the original cabin.

The black cabin is shaped from [BMW's E30 M3 Convertible reference](https://www.bmw-m.com/en/topics/magazine-article-pool/bmw-m3-e30-convertible.html) and photographs of original E30 sport upholstery. Continuous seat surfaces, broad horizontal leather panels, separate squat headrests, and a sculpted rear bench replace the earlier block construction. The low dashboard, driver-facing controls, and M Tech I steering wheel follow the period layout. Subtle grain, satin vinyl, and roughness variation distinguish leather, trim, and carpet. These are authored reference-based meshes, not a scan of a factory interior.

`e30/seatGeometry.js` and `e30/cockpitGeometry.js` build the cabin meshes; `e30/interiorMaterials.js` supplies the surface materials and instrument textures. `npm run test:interior` verifies matching vertex, normal, and UV counts, finite data, valid indices, material-batch merging, and body clearance. This guards against the missing cap normals that previously made closed headrest surfaces look hollow.

With the production preview running, `npm run test:car` verifies actual car loading, changing rotation frames, pixel-identical reduced-motion frames, both themes, mobile layout, asset loading, and WebGL failure fallback. Screenshots and diagnostics go to the ignored `portfolio/.qa/` directory.

Space Grotesk, DM Sans, and IBM Plex Mono are self-hosted in `portfolio/public/fonts/`, so typography does not depend on a third-party font CDN. The fonts come from the official Google Fonts repository; each family's SIL Open Font License is included beside its font file. Preserve those licenses when updating or redistributing the assets.

## Content and assets

Edit `portfolio/src/data/content.js` to update portfolio content. Professional titles, dates, and impact figures are sourced from the supplied résumé. Keep new claims supported by actual experience. Project illustrations are visual interpretations rather than screenshots of proprietary production systems.

The downloadable résumé is `portfolio/public/Mohamad-Alsyouf-Resume.pdf`. Replace that file when publishing an updated version. Its stable public URL is `/Mohamad-Alsyouf-Resume.pdf`.

`social-card.svg` is the editable 1200 × 630 source for the share image; `social-card.png` is the crawler-compatible output referenced by Open Graph and Twitter metadata. Re-export the PNG after changing its SVG source.

To regenerate the social PNG and the legacy ICO favicon with the preview server running, use `node scripts/browser-check.mjs --render-assets`, then rebuild. Routine browser tests only write ignored artifacts.

## Theme, motion, and accessibility

Dark mode is the default. The selected theme is stored under `portfolio-theme` and applied before React renders to avoid a flash of the wrong theme. Browsers with View Transitions animate the change from the toggle position; other browsers use the regular theme transition.

The motion control persists the visitor's animation preference. The application also respects the operating system's reduced-motion preference. Keyboard navigation, visible focus states, a skip link, semantic sections, and accessible controls support visitors using different input methods.

## Hosting

This repository is the source for the existing `mohamadalsyouf.com` website. Publish the contents of `portfolio/dist/` through the site's existing hosting setup, using `portfolio` as the build root and `npm run build` as the build command. Keep the existing domain and DNS configuration.

Vite copies everything in `portfolio/public/` into the build output, including the résumé and social preview. No Sites hosting registration or alternate domain is required. Local commits do not publish the website; deployment depends on the repository's existing hosting integration.
