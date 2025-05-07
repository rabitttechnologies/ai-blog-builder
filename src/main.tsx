
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/article.css'
import { initPerformanceMonitoring } from './utils/performanceMonitoring.ts'

// Initialize performance monitoring
initPerformanceMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
