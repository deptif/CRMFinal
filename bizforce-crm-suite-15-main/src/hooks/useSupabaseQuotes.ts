
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Quote } from '@/types';

export const useSupabaseQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (!mountedRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching quotes...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setQuotes([]);
        setIsLoading(false);
        return;
      }

      const { data: quotesData, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_line_items(*)
        `)
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar propostas:', error);
          setHasError(true);
          toast.error('Erro ao carregar propostas');
        }
        setQuotes([]);
        return;
      }

      const mappedQuotes: Quote[] = (quotesData || []).map(quote => ({
        id: quote.id,
        opportunity_id: quote.opportunity_id || '',
        opportunity_name: quote.opportunity_name || 'Sem oportunidade',
        quote_number: quote.quote_number || '',
        status: (quote.status || 'draft') as Quote['status'],
        total_amount: quote.total_amount || 0,
        valid_until: new Date(quote.valid_until || new Date()),
        products: (quote.quote_line_items || []).map(item => ({
          id: item.id,
          product_id: item.product_id || '',
          product_name: item.product_name || '',
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          discount: item.discount || 0,
          total: item.total || 0
        })),
        owner_id: quote.owner_id || session.user.id,
        owner_name: 'Utilizador',
        created_at: new Date(quote.created_at)
      }));

      setQuotes(mappedQuotes);
      console.log('Quotes loaded:', mappedQuotes.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar propostas:', error);
      
      if ((error as any).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar propostas');
      }
      setQuotes([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // Empty dependency array

  const createQuote = useCallback(async (quoteData: Omit<Quote, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar propostas');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          opportunity_id: quoteData.opportunity_id,
          opportunity_name: quoteData.opportunity_name,
          quote_number: quoteData.quote_number,
          status: quoteData.status,
          total_amount: quoteData.total_amount,
          valid_until: typeof quoteData.valid_until === 'string' ? quoteData.valid_until : quoteData.valid_until.toISOString().split('T')[0],
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar proposta:', error);
        toast.error('Erro ao criar proposta');
        return { data: null, error };
      }

      toast.success('Proposta criada com sucesso!');
      await fetchQuotes();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast.error('Erro ao criar proposta');
      return { data: null, error };
    }
  }, [fetchQuotes]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Only fetch once when component mounts
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchQuotes();
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
    quotes,
    isLoading,
    hasError,
    createQuote,
    refetch: fetchQuotes
  };
};
