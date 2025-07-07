
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Product } from '@/types';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!mountedRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching products...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar produtos:', error);
          setHasError(true);
          toast.error('Erro ao carregar produtos');
        }
        setProducts([]);
        return;
      }

      const mappedProducts: Product[] = (productsData || []).map(product => ({
        id: product.id,
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        cost: product.cost || 0,
        description: product.description || '',
        sku: product.sku || '',
        active: product.active ?? true,
        created_at: new Date(product.created_at)
      }));

      setProducts(mappedProducts);
      console.log('Products loaded:', mappedProducts.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar produtos:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar produtos');
      }
      setProducts([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // Empty dependency array

  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          category: productData.category,
          price: productData.price,
          cost: productData.cost,
          description: productData.description,
          sku: productData.sku,
          active: productData.active
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar produto:', error);
        toast.error('Erro ao criar produto');
        return { data: null, error };
      }

      toast.success('Produto criado com sucesso!');
      await fetchProducts();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto');
      return { data: null, error };
    }
  }, [fetchProducts]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Only fetch once when component mounts
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchProducts();
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array - only run once

  return {
    products,
    isLoading,
    hasError,
    createProduct,
    refetch: fetchProducts
  };
};
