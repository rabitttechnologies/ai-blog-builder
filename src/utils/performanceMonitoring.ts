
/**
 * Enhanced utility for monitoring and reporting web performance metrics
 */

// Report performance metrics to console and potentially analytics
export const reportWebVitals = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    // Get navigation timing
    const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navEntry) {
      const metrics = {
        TTFB: Math.round(navEntry.responseStart),
        DOMContentLoaded: Math.round(navEntry.domContentLoadedEventEnd),
        WindowLoad: Math.round(navEntry.loadEventEnd),
        FirstPaint: getPaintMetrics().FP,
        FirstContentfulPaint: getPaintMetrics().FCP,
      };
      
      console.log('Navigation Performance Metrics:', metrics);
      
      // Store metrics for potential analytics submission
      window.__PERFORMANCE_METRICS = {
        ...window.__PERFORMANCE_METRICS,
        navigation: metrics
      };
    }

    // Get resource timing for critical resources
    const resources = window.performance.getEntriesByType('resource');
    const cssResources = resources.filter(resource => resource.name.includes('.css'));
    const jsResources = resources.filter(resource => resource.name.includes('.js'));
    const fontResources = resources.filter(resource => 
      resource.name.includes('fonts.googleapis.com') || 
      resource.name.includes('fonts.gstatic.com')
    );
    const apiResources = resources.filter(resource => 
      resource.name.includes('/api/') || 
      resource.name.includes('supabase')
    );

    console.log('CSS Resources:', cssResources.map(formatResourceTiming));
    console.log('JS Resources:', jsResources.map(formatResourceTiming));
    console.log('Font Resources:', fontResources.map(formatResourceTiming));
    
    if (apiResources.length > 0) {
      console.log('API Resources:', apiResources.map(formatResourceTiming));
    }
    
    // Store resource timing data
    window.__PERFORMANCE_METRICS = {
      ...window.__PERFORMANCE_METRICS,
      resources: {
        css: cssResources.map(formatResourceTiming),
        js: jsResources.map(formatResourceTiming),
        fonts: fontResources.map(formatResourceTiming),
        api: apiResources.map(formatResourceTiming)
      }
    };
  }

  // Monitor LCP if supported
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpData = {
          value: Math.round(lastEntry.startTime),
          element: (lastEntry as any).element?.tagName || 'Unknown',
          url: (lastEntry as any).url || 'N/A'
        };
        
        console.log('Largest Contentful Paint:', lcpData);
        
        // Store LCP data
        window.__PERFORMANCE_METRICS = {
          ...window.__PERFORMANCE_METRICS,
          lcp: lcpData
        };
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Monitor CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        console.log('Cumulative Layout Shift:', { value: clsValue.toFixed(3) });
        
        // Store CLS data
        window.__PERFORMANCE_METRICS = {
          ...window.__PERFORMANCE_METRICS,
          cls: { value: parseFloat(clsValue.toFixed(3)) }
        };
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Monitor FID/INP
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidData = {
            value: Math.round((entry as any).processingStart - (entry as any).startTime),
            name: (entry as any).name,
            target: (entry as any).target?.tagName || 'Unknown'
          };
          
          console.log('First Input Delay / Interaction:', fidData);
          
          // Store FID data
          window.__PERFORMANCE_METRICS = {
            ...window.__PERFORMANCE_METRICS,
            interactions: [...(window.__PERFORMANCE_METRICS?.interactions || []), fidData]
          };
        }
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
      
    } catch (e) {
      console.error('Performance measurement error:', e);
    }
  }
};

// Helper to format resource timing data
const formatResourceTiming = (resource: PerformanceResourceTiming) => {
  return {
    name: resource.name.split('/').pop(),
    url: resource.name,
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

// Send performance data to analytics
const sendPerformanceDataToAnalytics = (metrics: any) => {
  // This would be implemented to send data to your analytics platform
  // For now, we'll just store it in the window object
  console.log('Performance data ready for analytics:', metrics);
};

// Initialize monitoring by adding this to main.tsx
export const initPerformanceMonitoring = () => {
  // Initialize storage for metrics
  window.__PERFORMANCE_METRICS = {};
  
  // Report metrics after load
  window.addEventListener('load', () => {
    // Use requestIdleCallback or setTimeout to avoid competing with critical rendering
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
  });
};

// Add to window for TypeScript
declare global {
  interface Window {
    __PERFORMANCE_METRICS?: any;
  }
}
