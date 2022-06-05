import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import antdDayjs from 'antd-dayjs-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), antdDayjs()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@/':'/src/',
    }
  },
  server: {
    port: 3300,
  },
});
