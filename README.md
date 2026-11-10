# Mohamad Alsyouf

Personal portfolio for Mohamad Alsyouf, senior full stack engineer and AI-native builder. Built to connect the work, the engineering decisions, and the people behind meaningful product outcomes.

**Website:** https://mohamadalsyouf.com/

The redesign pairs near-black and phosphor green with oversized typography, a floating collection of realistic personal-interest visuals, interactive project stories, and a complete light theme. The hero artwork and floating technical diagrams connect software, hardware, automotive engineering, gaming, and bass fishing. The photo/about section follows the hero, ahead of selected projects. The hiring story highlights enterprise delivery, cross-department collaboration, Scrum Master responsibilities, and AI-assisted engineering, grounded in the supplied October 2026 résumé.

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
| `portfolio/src/data/interests.js`        | Artwork and accessible descriptions for the hero                                                        |
| `portfolio/src/components/ui/`           | Shared motion, icon, and interaction components                                                         |
| `portfolio/src/context/ThemeContext.jsx` | Theme persistence, view transitions, and motion preferences                                             |
| `portfolio/src/theme/theme.js`           | Safe preference storage helpers                                                                         |
| `portfolio/src/index.css`                | Design tokens, layout, responsive behavior, and animation                                               |
| `portfolio/index.html`                   | Font loading, initial theme, SEO metadata, and Person structured data                                   |
| `portfolio/public/`                      | Downloadable résumé, favicon, social preview, robots, and sitemap                                       |

The app uses React 18, Vite, and Framer Motion. All artwork and fonts are served locally; the page makes no third-party runtime image requests.

## Personal-interest showcase

The hero features seven transparent, photorealistic renders: a dark-blue 1988 BMW E30 325i convertible with black leather and chrome bumpers, an exploded three-piece BBS-style wheel, Raspberry Pi 5, overhead BMW M50 with visible BMW lettering, fishing rod and largemouth bass, an Aion 2-inspired fantasy sword, and an iPhone representing mobile app development. The artwork stays in the hero, whose down arrow leads into the photo/about section. Mouse movement adds subtle perspective; the objects float independently. All seven remain visible when motion is disabled, with no WebGL dependency.

Each item reveals a short personal story on hover, keyboard focus, or tap. Edit the stories in `portfolio/src/data/interests.js`; `funFact` adds a separate paragraph and `link` adds an external link, used for Arkan. `InterestStory.jsx` positions the readable card within the viewport. Cards remain open while the pointer moves onto their content, support Escape and outside-click dismissal, and close when the hero scrolls out of view. The mobile-app review status comes from the owner's supplied copy and should be updated when Arkan's status changes.

The artwork was created with the built-in image generation tool. Original transparent PNGs are preserved in `portfolio/artwork/interests/` outside the deployed public directory. Alpha WebP variants at 480px and 960px live in `portfolio/public/interests/`. The browser selects an appropriate size; the smaller variants keep the collection lightweight. These are illustrative renders, not official product photographs or exact engineering models. [References](portfolio/docs/visual-references.md) and the complete [generation prompt set](portfolio/docs/interest-asset-prompts.json) document the assets.

To re-encode responsive WebP files after replacing the PNG originals, run `npm run assets:interests` from `portfolio`. It uses the installed browser's image encoder, preserves transparency, and does not need a preview server or external credentials. Rebuild afterward.

`InterestShowcase.jsx` handles the hero composition. `useSceneActivity.js` pauses CSS animation offscreen and in hidden tabs. ThemeContext handles OS and manual reduced-motion preferences. Browser checks cover image loading, both themes, responsive layouts, pointer depth, offscreen pausing, motion controls, accessible links, and existing portfolio interactions. The superseded E30 scene, model, tests, and Three.js dependencies have been removed.

Space Grotesk, DM Sans, and IBM Plex Mono are self-hosted in `portfolio/public/fonts/`, so typography does not depend on a third-party font CDN. The fonts come from the official Google Fonts repository; each family's SIL Open Font License is included beside its font file. Preserve those licenses when updating or redistributing the assets.

## Content and assets

Edit `portfolio/src/data/content.js` to update portfolio content. Professional titles, dates, and impact figures are sourced from the supplied résumé. Keep new claims supported by actual experience. Project illustrations are visual interpretations rather than screenshots of proprietary production systems.

The downloadable résumé is `portfolio/public/Mohamad-Alsyouf-Resume.pdf`. Replace that file when publishing an updated version. Its stable public URL is `/Mohamad-Alsyouf-Resume.pdf`.

`social-card.svg` is the editable 1200 × 630 source for the share image; `social-card.png` is the crawler-compatible output referenced by Open Graph and Twitter metadata. Re-export the PNG after changing its SVG source.

To regenerate the social PNG and the legacy ICO favicon with the preview server running, use `node scripts/browser-check.mjs --render-assets`, then rebuild. Routine browser tests only write ignored artifacts.

## Theme, motion, and accessibility

The Matrix-inspired palette uses phosphor green (`#58FF93`) over near-black, with deep green accents on the light theme. Body text is 16–18px, and supporting labels are at least 14px. The hero uses realistic artwork; the background uses quiet SVG line studies of hardware, wheels, fishing, and gaming. Decorative background graphics are hidden from assistive technology, while hero images have descriptive alternatives.

Dark mode is the default. The selected theme is stored under `portfolio-theme` and applied before React renders to avoid a flash of the wrong theme. Browsers with View Transitions animate the change from the toggle position; other browsers use the regular theme transition.

The motion control persists the visitor's animation preference. The application also respects the operating system's reduced-motion preference. Keyboard navigation, visible focus states, a skip link, semantic sections, and accessible controls support visitors using different input methods.

## Hosting

This repository is the source for the existing `mohamadalsyouf.com` website. Publish the contents of `portfolio/dist/` through the site's existing hosting setup, using `portfolio` as the build root and `npm run build` as the build command. Keep the existing domain and DNS configuration.

Vite copies everything in `portfolio/public/` into the build output, including the résumé and social preview. No Sites hosting registration or alternate domain is required. Local commits do not publish the website; deployment depends on the repository's existing hosting integration.
