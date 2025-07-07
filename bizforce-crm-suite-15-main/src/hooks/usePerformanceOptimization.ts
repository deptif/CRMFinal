
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { performanceMonitor, globalCache } from '@/utils/lazyLoader';

interface PerformanceConfig {
  enableCaching?: boolean;
  cacheTimeout?: number;
  enableLazyLoading?: boolean;
  enableVirtualization?: boolean;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    enableCaching = true,
    cacheTimeout = 300000, // 5 minutes
    enableLazyLoading = true,
    enableVirtualization = false
  } = config;

  const componentRef = useRef<string>(`component-${Date.now()}-${Math.random()}`);
  const renderStartTime = useRef<number>(0);

  // Performance monitoring
  useEffect(() => {
    renderStartTime.current = performance.now();
    performanceMonitor.startTiming(componentRef.current);

    return () => {
      performanceMonitor.endTiming(componentRef.current);
    };
  }, []);

  // Debounced function for expensive operations
  const useDebounced = useCallback((callback: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback((...args: any[]) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
  }, []);

  // Memoized cache operations
  const cachedFetch = useCallback(async (key: string, fetchFn: () => Promise<any>) => {
    if (!enableCaching) {
      return await fetchFn();
    }

    const cached = globalCache.get(key);
    if (cached) {
      console.log(`Cache hit for key: ${key}`);
      return cached;
    }

    console.log(`Cache miss for key: ${key}`);
    const data = await fetchFn();
    globalCache.set(key, data, cacheTimeout);
    return data;
  }, [enableCaching, cacheTimeout]);

  // Batch operations for better performance
  const batchOperations = useCallback((operations: Function[], batchSize: number = 10) => {
    return new Promise((resolve) => {
      let currentIndex = 0;
      const results: any[] = [];

      const processBatch = () => {
        const endIndex = Math.min(currentIndex + batchSize, operations.length);
        
        for (let i = currentIndex; i < endIndex; i++) {
          results[i] = operations[i]();
        }

        currentIndex = endIndex;

        if (currentIndex < operations.length) {
          requestAnimationFrame(processBatch);
        } else {
          resolve(results);
        }
      };

      processBatch();
    });
  }, []);

  // Image lazy loading
  const lazyLoadImage = useCallback((imgElement: HTMLImageElement, src: string) => {
    if (!enableLazyLoading) {
      imgElement.src = src;
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
        }
      });
    });

    observer.observe(imgElement);
  }, [enableLazyLoading]);

  // Memory usage monitoring
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }, []);

  // Virtual scrolling helper
  const calculateVirtualItems = useCallback((
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    scrollTop: number
  ) => {
    if (!enableVirtualization) {
      return { startIndex: 0, endIndex: totalItems - 1, visibleItems: totalItems };
    }

    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItems + 5, totalItems - 1); // Buffer of 5 items

    return { startIndex, endIndex, visibleItems };
  }, [enableVirtualization]);

  return {
    cachedFetch,
    useDebounced,
    batchOperations,
    lazyLoadImage,
    getMemoryUsage,
    calculateVirtualItems,
    componentId: componentRef.current
  };
};

// Custom hook for data fetching with caching
export const useCachedData = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { cachedFetch } = usePerformanceOptimization();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cachedFetch(key, fetchFn);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, ...dependencies]);

  return { data, loading, error };
};
