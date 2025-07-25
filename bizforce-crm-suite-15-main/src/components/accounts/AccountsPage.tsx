import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Euro,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AccountModal } from './AccountModal';
import { useSupabaseAccounts } from '@/hooks/useSupabaseAccounts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Account } from '@/types';

export const AccountsPage = () => {
  const { accounts, isLoading, createAccount, updateAccount, deleteAccount, refetch } = useSupabaseAccounts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAccount = async (accountData: Omit<Account, 'id' | 'created_at'>) => {
    try {
      await createAccount(accountData);
      setIsModalOpen(false);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleUpdateAccount = async (accountData: Omit<Account, 'id' | 'created_at'>) => {
    if (!editingAccount) return;
    
    try {
      await updateAccount(editingAccount.id, accountData);
      setEditingAccount(null);
      setIsModalOpen(false);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleDeleteConfirm = (account: Account) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    
    try {
      console.log('Chamando deleteAccount para:', accountToDelete.id);
      const result = await deleteAccount(accountToDelete.id);
      
      if (result.hasRelatedRecords) {
        console.log('Conta tem registros relacionados, exibindo mensagem de erro');
        setDeleteErrorMessage(result.message || 'Não é possível eliminar esta conta pois tem registros associados.');
      } else {
        console.log('Exclusão bem-sucedida, fechando diálogo');
        setIsDeleteDialogOpen(false);
        setAccountToDelete(null);
        setDeleteErrorMessage('');
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      // Error já tratado no hook
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
      setDeleteErrorMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando contas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600">Gerir empresas e organizações</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar contas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      {filteredAccounts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhuma conta encontrada' : 'Nenhuma conta cadastrada'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Crie uma nova conta para começar'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <p className="text-sm text-gray-600">{account.industry}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {account.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {account.phone}
                  </div>
                  {account.website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      {account.website}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {account.address}
                  </div>
                </div>

                {account.annual_revenue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Euro className="h-4 w-4 mr-1" />
                      Receita Anual:
                    </span>
                    <span className="font-semibold">€{account.annual_revenue.toLocaleString()}</span>
                  </div>
                )}

                {account.employees && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      Funcionários:
                    </span>
                    <span className="font-semibold">{account.employees}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {account.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Responsável: {account.owner_name}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAccount(account)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteConfirm(account)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}
        editingAccount={editingAccount}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setDeleteErrorMessage('');
          setAccountToDelete(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {deleteErrorMessage ? (
              <>
                <AlertDialogTitle className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Não é possível excluir
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>{deleteErrorMessage}</p>
                  <p className="text-sm text-gray-600">
                    Você precisa primeiro remover todos os contatos associados a esta conta.
                  </p>
                </AlertDialogDescription>
              </>
            ) : (
              <>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza de que deseja excluir a conta "{accountToDelete?.name}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {!deleteErrorMessage && (
              <AlertDialogAction 
                onClick={() => handleDeleteAccount()}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
