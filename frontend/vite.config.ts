import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      visualizer({
        open: true,
        filename: 'bundle-stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    server: {
      host: true,
      proxy: {
        '/api': {
          // /api로 시작되는 주소 가로챔
          target: env.VITE_DOCKER_NET_URL, // 서버가 실행되는 주소
          changeOrigin: true, // CORS 문제 해결을 위해 Origin을 바꿔줌.
        },
      },
    },
    define: {
      global: 'window',
    },
  };
});
