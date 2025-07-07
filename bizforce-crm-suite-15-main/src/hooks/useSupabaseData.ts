import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Account, Contact, Opportunity, Activity } from '@/types';

export const useSupabaseData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [accountsData, contactsData, opportunitiesData] = await Promise.all([
        searchAccounts(),
        searchContacts(), 
        searchOpportunities()
      ]);
      
      setAccounts(accountsData);
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchAccounts = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from('accounts')
        .select(`
          *,
          contacts(count),
          opportunities(count, amount.sum()),
          profiles!accounts_owner_id_fkey(name)
        `);

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,industry.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return data?.map(account => ({
        ...account,
        created_at: account.created_at ? new Date(account.created_at) : new Date(),
        owner_name: account.profiles?.name || 'Não atribuído'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      toast.error('Erro ao carregar contas');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchContacts = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from('contacts')
        .select(`
          *,
          accounts(name),
          profiles!contacts_owner_id_fkey(name)
        `);

      if (query) {
        queryBuilder = queryBuilder.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return data?.map(contact => ({
        ...contact,
        created_at: contact.created_at ? new Date(contact.created_at) : new Date(),
        account_name: contact.accounts?.name || 'Sem conta',
        owner_name: contact.profiles?.name || 'Não atribuído'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      toast.error('Erro ao carregar contatos');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchOpportunities = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from('opportunities')
        .select(`
          *,
          accounts(name),
          contacts(first_name, last_name),
          profiles!opportunities_owner_id_fkey(name)
        `);

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return data?.map(opportunity => ({
        ...opportunity,
        created_at: opportunity.created_at ? new Date(opportunity.created_at) : new Date(),
        close_date: opportunity.close_date ? new Date(opportunity.close_date) : null,
        stage: (opportunity.stage as 'qualified' | 'closed_won' | 'lead' | 'proposal' | 'negotiation' | 'closed_lost') || 'lead',
        account_name: opportunity.accounts?.name || 'Sem conta',
        contact_name: opportunity.contacts 
          ? `${opportunity.contacts.first_name} ${opportunity.contacts.last_name}`
          : 'Sem contato',
        owner_name: opportunity.profiles?.name || 'Não atribuído'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      toast.error('Erro ao carregar oportunidades');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchActivities = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from('activities')
        .select(`
          *,
          profiles!activities_owner_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return data?.map(activity => ({
        ...activity,
        owner_name: activity.profiles?.name || 'Não atribuído',
        related_name: 'Relacionado' // TODO: Implementar lookup dinâmico
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      toast.error('Erro ao carregar atividades');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAccountById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          *,
          profiles!accounts_owner_id_fkey(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        owner_name: data.profiles?.name || 'Não atribuído'
      };
    } catch (error) {
      console.error('Erro ao buscar conta:', error);
      return null;
    }
  }, []);

  const getContactById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          accounts(name),
          profiles!contacts_owner_id_fkey(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        account_name: data.accounts?.name || 'Sem conta',
        owner_name: data.profiles?.name || 'Não atribuído'
      };
    } catch (error) {
      console.error('Erro ao buscar contato:', error);
      return null;
    }
  }, []);

  const getOpportunityById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          accounts(name),
          contacts(first_name, last_name),
          profiles!opportunities_owner_id_fkey(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        account_name: data.accounts?.name || 'Sem conta',
        contact_name: data.contacts 
          ? `${data.contacts.first_name} ${data.contacts.last_name}`
          : 'Sem contato',
        owner_name: data.profiles?.name || 'Não atribuído'
      };
    } catch (error) {
      console.error('Erro ao buscar oportunidade:', error);
      return null;
    }
  }, []);

  const getRecentActivities = useCallback(async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          profiles!activities_owner_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data?.map(activity => ({
        ...activity,
        owner_name: activity.profiles?.name || 'Não atribuído',
        related_name: 'Relacionado'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      return [];
    }
  }, []);

  const getTopOpportunities = useCallback(async (limit: number = 5) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          accounts(name),
          profiles!opportunities_owner_id_fkey(name)
        `)
        .eq('stage', 'qualified')
        .order('amount', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data?.map(opportunity => ({
        ...opportunity,
        account_name: opportunity.accounts?.name || 'Sem conta',
        owner_name: opportunity.profiles?.name || 'Não atribuído'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar top oportunidades:', error);
      return [];
    }
  }, []);

  const getSalesMetrics = useCallback(async () => {
    try {
      const { data: opportunities, error } = await supabase
        .from('opportunities')
        .select('amount, stage');

      if (error) throw error;

      const totalOpportunities = opportunities?.length || 0;
      const wonDeals = opportunities?.filter(opp => opp.stage === 'closed_won').length || 0;
      const totalRevenue = opportunities
        ?.filter(opp => opp.stage === 'closed_won')
        .reduce((sum, opp) => sum + (opp.amount || 0), 0) || 0;
      const averageDealSize = wonDeals > 0 ? totalRevenue / wonDeals : 0;
      const winRate = totalOpportunities > 0 ? (wonDeals / totalOpportunities) * 100 : 0;

      return {
        totalOpportunities,
        wonDeals,
        totalRevenue,
        averageDealSize,
        winRate
      };
    } catch (error) {
      console.error('Erro ao calcular métricas:', error);
      return {
        totalOpportunities: 0,
        wonDeals: 0,
        totalRevenue: 0,
        averageDealSize: 0,
        winRate: 0
      };
    }
  }, []);

  return {
    isLoading,
    accounts,
    contacts,
    opportunities,
    loadInitialData,
    searchAccounts,
    searchContacts,
    searchOpportunities,
    searchActivities,
    getAccountById,
    getContactById,
    getOpportunityById,
    getRecentActivities,
    getTopOpportunities,
    getSalesMetrics
  };
};
