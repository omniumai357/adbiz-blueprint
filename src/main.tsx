
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ReactQueryProvider>
  </React.StrictMode>,
)
