// vite.config.js
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
	  autoInstall: true,
    })
  ],
})