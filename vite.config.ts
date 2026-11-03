import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages ではリポジトリ名のサブパスで公開される
export default defineConfig({
  plugins: [react()],
  base: '/ai-callcenter-site/',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: { output: { manualChunks: { recharts: ['recharts'], react: ['react', 'react-dom'] } } },
  },
});
