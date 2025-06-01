import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Use empty string for GitHub Pages to resolve paths correctly
  base: '',
  build: {
    // Generate assets with hashed filenames for better caching
    assetsDir: 'assets',
    // Ensure index.html is at the root
    outDir: 'dist',
  }
});
