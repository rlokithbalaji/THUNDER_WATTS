import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative asset paths so it never breaks on subpaths
  server: {
    port: 3000,
    host: true,
  },
});
