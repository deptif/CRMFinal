
import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, User, Building2, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useClickOutside(() => setIsOpen(false));
  const { accounts, contacts, opportunities, loadInitialData } = useSupabaseData();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    const searchResults: any[] = [];
    const searchQuery = query.toLowerCase();

    // Search accounts
    accounts.forEach(account => {
      if (account.name?.toLowerCase().includes(searchQuery) ||
          account.email?.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          ...account,
          type: 'account',
          title: account.name,
          subtitle: account.email,
          icon: Building2
        });
      }
    });

    // Search contacts
    contacts.forEach(contact => {
      const fullName = `${contact.first_name} ${contact.last_name}`;
      if (fullName.toLowerCase().includes(searchQuery) ||
          contact.email?.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          ...contact,
          type: 'contact',
          title: fullName,
          subtitle: contact.email,
          icon: User
        });
      }
    });

    // Search opportunities
    opportunities.forEach(opportunity => {
      if (opportunity.name?.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          ...opportunity,
          type: 'opportunity',
          title: opportunity.name,
          subtitle: `$${opportunity.amount?.toLocaleString() || '0'}`,
          icon: Target
        });
      }
    });

    setResults(searchResults.slice(0, 10));
    setIsLoading(false);
  }, [query, accounts, contacts, opportunities]);

  const getResultDate = (result: any) => {
    return result.created_at ? new Date(result.created_at).toLocaleDateString() : '';
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar contas, contatos, oportunidades..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Buscando...
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                      onClick={() => {
                        setIsOpen(false);
                        setQuery('');
                      }}
                    >
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {getResultDate(result)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhum resultado encontrado para "{query}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
