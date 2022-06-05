import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import antdDayjs from 'antd-dayjs-vite-plugin';
import visualizer from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    antdDayjs(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
  server: {
    port: 3300,
  },
});
