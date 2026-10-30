import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vercel, Netlify and local dev serve the site from "/".
// GitHub Pages serves it from "/<repo-name>/", so the base must match the repo name.
//  - GitHub Actions builds: the repo name is picked up automatically.
//  - Local `npm run deploy`: the --base flag in package.json is used instead.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/',
})