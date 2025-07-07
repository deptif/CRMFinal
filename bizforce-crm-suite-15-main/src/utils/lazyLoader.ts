
import React, { lazy } from 'react';

// Lazy loading utility with error boundary support
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().catch((error) => {
      console.error('Error loading component:', error);
      return { 
        default: () => {
          return React.createElement('div', null, 'Erro ao carregar componente');
        }
      };
    })
  );
};

// Performance monitoring
export const performanceMonitor = {
  startTiming: (label: string) => {
    performance.mark(`${label}-start`);
  },
  
  endTiming: (label: string) => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    console.log(`Performance - ${label}: ${measure.duration.toFixed(2)}ms`);
  }
};

// Cache management
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

export const globalCache = new CacheManager();
