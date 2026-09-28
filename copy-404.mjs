// GitHub Pages has no server-side routing: refreshing /examhub/dashboard would
// show GitHub's 404. Serving index.html as 404.html lets the React app load and
// handle the route itself. Harmless on Vercel/Netlify.
import { copyFileSync, existsSync } from 'node:fs'

if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html')
  console.log('Created dist/404.html for GitHub Pages deep links')
}
