
/**
 * Performance observer setup utilities
 */

export const setupPerformanceObservers = (onMetricUpdate: (metrics: Partial<PerformanceMetrics>) => void) => {
  if (!('PerformanceObserver' in window)) return;

  try {
    // LCP Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcpData = {
        value: Math.round(lastEntry.startTime),
        element: (lastEntry as any).element?.tagName || 'Unknown',
        url: (lastEntry as any).url || 'N/A'
      };
      
      onMetricUpdate({ lcp: lcpData });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS Observer
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      onMetricUpdate({ cls: { value: parseFloat(clsValue.toFixed(3)) } });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // FID Observer
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidData = {
          value: Math.round((entry as any).processingStart - (entry as any).startTime),
          name: (entry as any).name,
          target: (entry as any).target?.tagName || 'Unknown'
        };
        
        onMetricUpdate({
          interactions: [fidData]
        });
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  } catch (e) {
    console.error('Performance measurement error:', e);
    return () => {};
  }
};

