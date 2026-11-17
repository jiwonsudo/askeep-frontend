import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { queryClient } from '@/api/queryClient'

import './index.css'
import App from './App.tsx'

// 시연용 서버는 쉬고 있으면 잠들어서 첫 요청이 오래 걸린다. 화면을 여는 즉시 깨워 두고, 결과는 쓰지 않는다
fetch(new URL(import.meta.env.VITE_API_BASE_URL, window.location.origin), {
  method: 'HEAD',
  mode: 'no-cors',
}).catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
