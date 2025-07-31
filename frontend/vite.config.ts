import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // /api로 시작되는 주소 가로챔
        target: 'http://localhost:4000', // 서버가 실행되는 주소
        changeOrigin: true, // CORS 문제 해결을 위해 Origin을 바꿔줌.
      },
    },
  },
  define: {
    global: 'window',
  },
});
