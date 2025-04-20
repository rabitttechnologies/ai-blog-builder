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
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Check if the document is already interactive or complete
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  startApp();
} else {
  // Otherwise, defer the app initialization to DOMContentLoaded
  document.addEventListener('DOMContentLoaded', startApp);
}
