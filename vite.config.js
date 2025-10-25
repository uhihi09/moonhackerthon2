import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ✅ 수정: -swc 제거
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // ✅ 수정: SWC 대신 기본 React 플러그인
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
      include: '**/*.svg',
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/',
});