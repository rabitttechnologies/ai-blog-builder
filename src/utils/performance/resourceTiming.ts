
/**
 * Utilities for handling resource timing data
 */

export const formatResourceTiming = (resource: PerformanceResourceTiming) => {
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

export const getResourceMetrics = () => {
  if (!('performance' in window) || !('getEntriesByType' in window.performance)) {
    return {};
  }

  const resources = window.performance.getEntriesByType('resource');
  
  return {
    css: resources.filter(r => r.name.includes('.css')).map(formatResourceTiming),
    js: resources.filter(r => r.name.includes('.js')).map(formatResourceTiming),
    fonts: resources.filter(r => 
      r.name.includes('fonts.googleapis.com') || 
      r.name.includes('fonts.gstatic.com')
    ).map(formatResourceTiming),
    api: resources.filter(r => 
      r.name.includes('/api/') || 
      r.name.includes('supabase')
    ).map(formatResourceTiming)
  };
};

