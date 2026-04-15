// Prefix public-folder paths with Vite's base URL so they work on
// GitHub Pages sub-path deployments (e.g. /Portfolio_LighterVersion_V2/).
// In dev, import.meta.env.BASE_URL === '/', so nothing changes.
const BASE = import.meta.env.BASE_URL   // always has a trailing slash

export const asset = (path) =>
  `${BASE}${path.replace(/^\//, '')}`
