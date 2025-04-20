
/**
 * Type definitions for performance monitoring
 */

interface PerformanceMetrics {
  navigation?: {
    TTFB: number;
    DOMContentLoaded: number;
    WindowLoad: number;
    FirstPaint: number;
    FirstContentfulPaint: number;
  };
  resources?: {
    css: ResourceTiming[];
    js: ResourceTiming[];
    fonts: ResourceTiming[];
    api: ResourceTiming[];
  };
  lcp?: {
    value: number;
    element: string;
    url: string;
  };
  cls?: {
    value: number;
  };
  interactions?: Array<{
    value: number;
    name: string;
    target: string;
  }>;
}

interface ResourceTiming {
  name: string | undefined;
  url: string;
  transferSize: string;
  duration: string;
  timing: {
    redirect: number;
    dns: number;
    connect: number;
    request: number;
    response: number;
  };
}

interface Window {
  __PERFORMANCE_METRICS?: PerformanceMetrics;
  lcpElementMarked?: boolean;
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
}
