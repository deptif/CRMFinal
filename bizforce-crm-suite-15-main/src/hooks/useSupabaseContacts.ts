import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Contact } from '@/types';

export const useSupabaseContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  const fetchContacts = useCallback(async () => {
    if (!mountedRef.current) return;

    const now = Date.now();
    if (now - lastFetchRef.current < 1000) {
      console.log('Skipping fetch - too soon');
      return;
    }
    lastFetchRef.current = now;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching contacts...');
      setIsLoading(true);
      setHasError(false);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !mountedRef.current) {
        console.log('No session or component unmounted');
        setContacts([]);
        setIsLoading(false);
        return;
      }

      const { data: contactsData, error } = await supabase
        .from('contacts')
        .select(`
          *,
          accounts(name),
          profiles!contacts_owner_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (!mountedRef.current) return;

      if (error) {
        if (error.code !== 'PGRST301') {
          console.error('Erro ao buscar contactos:', error);
          setHasError(true);
          toast.error('Erro ao carregar contactos');
        }
        setContacts([]);
        return;
      }

      const mappedContacts: Contact[] = (contactsData || []).map(contact => ({
        id: contact.id,
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        title: contact.title || '',
        account_id: contact.account_id || '',
        account_name: contact.accounts?.name || 'Sem conta',
        tags: contact.tags || [],
        owner_id: contact.owner_id || session.user.id,
        owner_name: contact.profiles?.name || 'Não atribuído',
        created_at: new Date(contact.created_at)
      }));

      setContacts(mappedContacts);
      console.log('Contacts loaded:', mappedContacts.length);
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Erro ao buscar contactos:', error);
      
      if ((error as Error).name !== 'AbortError') {
        setHasError(true);
        toast.error('Erro ao carregar contactos');
      }
      setContacts([]);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const createContact = useCallback(async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar contactos');
        return { data: null, error: new Error('Not authenticated') };
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          first_name: contactData.first_name,
          last_name: contactData.last_name,
          email: contactData.email,
          phone: contactData.phone,
          title: contactData.title,
          account_id: contactData.account_id,
          tags: contactData.tags,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar contacto:', error);
        toast.error('Erro ao criar contacto');
        return { data: null, error };
      }

      toast.success('Contacto criado com sucesso!');
      setTimeout(() => fetchContacts(), 100);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar contacto:', error);
      toast.error('Erro ao criar contacto');
      return { data: null, error };
    }
  }, [fetchContacts]);

  const updateContact = useCallback(async (contactId: string, updates: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          email: updates.email,
          phone: updates.phone,
          title: updates.title,
          account_id: updates.account_id,
          tags: updates.tags
        })
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar contacto:', error);
        toast.error('Erro ao atualizar contacto');
        return { data: null, error };
      }

      toast.success('Contacto atualizado com sucesso!');
      setTimeout(() => fetchContacts(), 100);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar contacto:', error);
      toast.error('Erro ao atualizar contacto');
      return { data: null, error };
    }
  }, [fetchContacts]);

  const deleteContact = useCallback(async (contactId: string) => {
    try {
      console.log('Iniciando exclusão do contato:', contactId);
      
      if (!contactId || typeof contactId !== 'string') {
        toast.error('ID do contato inválido');
        return { error: new Error('ID inválido') };
      }
      
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        console.error('Erro ao eliminar contacto:', error);
        toast.error(`Erro ao eliminar contacto: ${error.message}`);
        return { error };
      }

      toast.success('Contacto eliminado com sucesso!');
      
      await fetchContacts();
      
      return { error: null };
    } catch (error: unknown) {
      console.error('Erro ao eliminar contacto:', error);
      toast.error(`Erro ao eliminar contacto: ${error instanceof Error ? error.message : String(error)}`);
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  }, [fetchContacts]);

  const refetch = useCallback(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    mountedRef.current = true;
    isInitializedRef.current = true;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchContacts();
      }
    }, 200);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    hasError,
    createContact,
    updateContact,
    deleteContact,
    refetch
  };
};
