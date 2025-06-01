import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // For GitHub Pages deployment
  base: '',
  build: {
    // Ensure CSS and other assets use relative paths
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Ensure assets use relative paths
        assetFileNames: (assetInfo) => {
          // Keep the original path for font files
          if (assetInfo.name && /\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    }
  }
});
