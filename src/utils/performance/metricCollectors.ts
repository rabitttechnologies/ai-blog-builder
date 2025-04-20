
/**
 * Utilities for collecting different types of performance metrics
 */

export const getPaintMetrics = () => {
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

export const getNavigationMetrics = (): Partial<PerformanceMetrics['navigation']> => {
  if (!('performance' in window) || !('getEntriesByType' in window.performance)) {
    return {};
  }

  const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navEntry) return {};

  return {
    TTFB: Math.round(navEntry.responseStart),
    DOMContentLoaded: Math.round(navEntry.domContentLoadedEventEnd),
    WindowLoad: Math.round(navEntry.loadEventEnd),
    FirstPaint: getPaintMetrics().FP,
    FirstContentfulPaint: getPaintMetrics().FCP,
  };
};

