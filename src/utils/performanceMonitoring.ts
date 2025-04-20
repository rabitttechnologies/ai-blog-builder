
/**
 * Main performance monitoring module
 */

import { getNavigationMetrics } from './performance/metricCollectors';
import { getResourceMetrics } from './performance/resourceTiming';
import { setupPerformanceObservers } from './performance/observers';

const updatePerformanceMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
  if (!window.__PERFORMANCE_METRICS) {
    window.__PERFORMANCE_METRICS = {};
  }
  
  window.__PERFORMANCE_METRICS = {
    ...window.__PERFORMANCE_METRICS,
    ...newMetrics
  };
  
  console.log('Performance metrics updated:', newMetrics);
};

// Report performance metrics to console and potentially analytics
export const reportWebVitals = () => {
  // Get navigation timing
  const navigationMetrics = getNavigationMetrics();
  if (Object.keys(navigationMetrics).length > 0) {
    console.log('Navigation Performance Metrics:', navigationMetrics);
    updatePerformanceMetrics({ navigation: navigationMetrics as PerformanceMetrics['navigation'] });
  }

  // Get resource timing
  const resourceMetrics = getResourceMetrics();
  if (Object.keys(resourceMetrics).length > 0) {
    console.log('Resource Timing:', resourceMetrics);
    updatePerformanceMetrics({ resources: resourceMetrics as PerformanceMetrics['resources'] });
  }
};

// Send performance data to analytics
const sendPerformanceDataToAnalytics = (metrics: PerformanceMetrics) => {
  console.log('Performance data ready for analytics:', metrics);
};

// Initialize monitoring
export const initPerformanceMonitoring = () => {
  // Initialize storage for metrics
  window.__PERFORMANCE_METRICS = {};
  
  // Setup performance observers
  const cleanupObservers = setupPerformanceObservers(updatePerformanceMetrics);
  
  // Report metrics after load
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => reportWebVitals());
    } else {
      setTimeout(() => reportWebVitals(), 3000);
    }
  });
  
  // Report metrics before unload
  window.addEventListener('beforeunload', () => {
    if (window.__PERFORMANCE_METRICS) {
      sendPerformanceDataToAnalytics(window.__PERFORMANCE_METRICS);
    }
    cleanupObservers();
  });
};
