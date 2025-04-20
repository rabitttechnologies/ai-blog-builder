
/**
 * Utility for monitoring and reporting web performance metrics
 */

// Report performance metrics to console and potentially analytics
export const reportWebVitals = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    // Get navigation timing
    const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navEntry) {
      console.log('Navigation Performance Metrics:', {
        TTFB: Math.round(navEntry.responseStart),
        DOMContentLoaded: Math.round(navEntry.domContentLoadedEventEnd),
        WindowLoad: Math.round(navEntry.loadEventEnd),
        FirstPaint: getPaintMetrics().FP,
        FirstContentfulPaint: getPaintMetrics().FCP,
      });
    }

    // Get resource timing for critical resources
    const resources = window.performance.getEntriesByType('resource');
    const cssResources = resources.filter(resource => resource.name.includes('.css'));
    const jsResources = resources.filter(resource => resource.name.includes('.js'));
    const fontResources = resources.filter(resource => 
      resource.name.includes('fonts.googleapis.com') || 
      resource.name.includes('fonts.gstatic.com')
    );

    console.log('CSS Resources:', cssResources.map(formatResourceTiming));
    console.log('JS Resources:', jsResources.map(formatResourceTiming));
    console.log('Font Resources:', fontResources.map(formatResourceTiming));
  }

  // Monitor LCP if supported
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('Largest Contentful Paint:', {
          value: Math.round(lastEntry.startTime),
          element: (lastEntry as any).element?.tagName || 'Unknown',
          url: (lastEntry as any).url || 'N/A'
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP measurement error:', e);
    }
  }
};

// Helper to format resource timing data
const formatResourceTiming = (resource: PerformanceResourceTiming) => {
  return {
    name: resource.name.split('/').pop(),
    transferSize: `${Math.round(resource.transferSize / 1024 * 10) / 10} KB`,
    duration: `${Math.round(resource.duration)}ms`,
    timing: {
      redirect: Math.round(resource.redirectEnd - resource.redirectStart),
      dns: Math.round(resource.domainLookupEnd - resource.domainLookupStart),
      connect: Math.round(resource.connectEnd - resource.connectStart),
      request: Math.round(resource.responseStart - resource.requestStart),
      response: Math.round(resource.responseEnd - resource.responseStart),
    }
  };
};

// Get paint metrics from Performance API
const getPaintMetrics = () => {
  const paintMetrics = {
    FP: 0,
    FCP: 0
  };

  if ('performance' in window && 'getEntriesByType' in window.performance) {
    const paintEntries = window.performance.getEntriesByType('paint');
    
    for (const entry of paintEntries) {
      if (entry.name === 'first-paint') {
        paintMetrics.FP = Math.round(entry.startTime);
      } else if (entry.name === 'first-contentful-paint') {
        paintMetrics.FCP = Math.round(entry.startTime);
      }
    }
  }

  return paintMetrics;
};

// Initialize monitoring by adding this to main.tsx
export const initPerformanceMonitoring = () => {
  // Report metrics after load
  window.addEventListener('load', () => {
    // Use requestIdleCallback or setTimeout to avoid competing with critical rendering
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => reportWebVitals());
    } else {
      setTimeout(() => reportWebVitals(), 3000);
    }
  });
};
