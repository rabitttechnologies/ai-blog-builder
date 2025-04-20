import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';

// Initialize performance monitoring
initPerformanceMonitoring();

// Create a function to defer non-critical initialization
const startApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  // Measure initial render time
  const startTime = performance.now();
  
  const appRoot = createRoot(rootElement);
  
  // Use requestIdleCallback for non-critical rendering if available
  const renderApp = () => {
    appRoot.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    // Log render timing for performance analysis
    console.log(`App render time: ${Math.round(performance.now() - startTime)}ms`);
  };
  
  if ('requestIdleCallback' in window) {
    // Render when browser is idle, but with a timeout to ensure it happens
    (window as any).requestIdleCallback(renderApp, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    renderApp();
  }
};

// Check if the document is already interactive or complete
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  startApp();
} else {
  // Otherwise, defer the app initialization to DOMContentLoaded
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
}
