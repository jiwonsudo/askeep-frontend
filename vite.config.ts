import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * 개발 서버(백엔드)가 허용하는 출처. 프록시가 서버로 보내는 요청의 Origin을 이 값으로 바꿔서,
 * 폰이나 다른 PC처럼 `http://IP:5173`으로 접속해도 CORS에 막히지 않게 한다.
 */
const ALLOWED_ORIGIN = 'http://localhost:5173'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 값이 있을 때만 프록시를 켠다. (.env.example 참고)
  const proxyTarget = loadEnv(mode, process.cwd(), '').VITE_DEV_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  proxyReq.setHeader('origin', ALLOWED_ORIGIN)
                })
              },
            },
            '/ws': {
              target: proxyTarget,
              changeOrigin: true,
              ws: true,
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  proxyReq.setHeader('origin', ALLOWED_ORIGIN)
                })
                proxy.on('proxyReqWs', (proxyReq) => {
                  proxyReq.setHeader('origin', ALLOWED_ORIGIN)
                })
              },
            },
          },
        }
      : undefined,
  }
})
