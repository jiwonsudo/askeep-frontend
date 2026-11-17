import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  // 개발자마다 다른 .env 값이 테스트에 섞이지 않게 읽지 않는다
  envDir: false,
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    // API와 같은 출처로 맞춘다. 다르면 jsdom이 CORS로 응답을 막는다
    environmentOptions: { jsdom: { url: 'http://localhost' } },
    setupFiles: ['./src/test/setup.ts'],
    // 테스트는 실제 서버 대신 MSW가 이 주소로 오는 요청을 받는다
    env: { VITE_API_BASE_URL: 'http://localhost/api/v1' },
  },
})
