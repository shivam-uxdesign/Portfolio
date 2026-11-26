import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { PAGES, SITE_TITLE } from './src/lib/pages'

// After the build, write a static copy of index.html for every page with that page's own title,
// description, canonical URL and share image (link previews and search engines don't run JavaScript),
// plus sitemap.xml. Vercel serves these files before the catch-all rewrite to the app.
const SITE = 'https://shivamdesign.in'
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
function staticPages() {
  return {
    name: 'static-pages',
    apply: 'build' as const,
    closeBundle() {
      const out = path.resolve(__dirname, 'dist')
      const base = fs.readFileSync(path.join(out, 'index.html'), 'utf8')
      for (const [route, m] of Object.entries(PAGES)) {
        const title = `${m.name} · Shivam Sehgal`
        const desc = m.description ?? 'A product designer who works from strategy to pixel.'
        const img = SITE + (m.image ?? '/og.jpg')
        const html = base
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(desc)}`)
          .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
          .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(desc)}`)
          .replace(/(<meta property="og:image" content=")[^"]*/, `$1${img}`)
          .replace(/(<meta property="og:url" content=")[^"]*/, `$1${SITE}${route}`)
          .replace(/(<link rel="canonical" href=")[^"]*/, `$1${SITE}${route}`)
          .replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />')
        const dir = path.join(out, route)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), html)
      }
      const urls = ['/', ...Object.keys(PAGES)].map(r => `  <url><loc>${SITE}${r}</loc></url>`).join('\n')
      fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      void SITE_TITLE
      // Every page needs its own rewrite in vercel.json, or its static file is never served.
      const vercel = fs.readFileSync(path.resolve(__dirname, 'vercel.json'), 'utf8')
      const missing = Object.keys(PAGES).filter(r => !vercel.includes(r.slice(1)))
      if (missing.length) throw new Error(`vercel.json has no rewrite for: ${missing.join(', ')}`)
    },
  }
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    staticPages(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
