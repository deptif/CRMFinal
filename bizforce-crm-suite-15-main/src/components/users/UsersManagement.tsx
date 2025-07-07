import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { InviteUserModal } from './InviteUserModal';
import { EditUserModal } from './EditUserModal';
import { ViewUserModal } from './ViewUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { UsersStats } from './UsersStats';
import { UsersFilters } from './UsersFilters';
import { UsersTable } from './UsersTable';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';

// Updated User interface to match what components expect
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  company: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  avatar?: string;
  created_at: Date;
  last_login?: Date;
  invited_at?: Date;
}

export const UsersManagement = () => {
  const { users, loading, createUser, updateUser, deleteUser, resendInvite, toggleUserStatus } = useSupabaseUsers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, {
        name: userData.name,
        email: userData.email,
        status: userData.status,
        phone: userData.phone,
        position: userData.position,
        department: userData.department,
        address: userData.address
      });
    }
  };

  const handleAddUser = async (userData: Omit<User, 'password'>) => {
    await createUser({
      name: userData.name,
      email: userData.email,
      status: userData.status || 'pending',
      phone: userData.phone,
      position: userData.position,
      department: userData.department,
      address: userData.address
    });
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando utilizadores...</p>
        </div>
      </div>
    );
  }

  // Convert UserProfile to User format for components
  const convertedUsers: User[] = users.map(user => ({
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    position: user.position || '',
    department: user.department || '',
    company: user.company_id || 'default-company',
    address: user.address || '',
    status: user.status,
    avatar: user.avatar || undefined,
    created_at: user.created_at,
    last_login: user.last_login || undefined,
    invited_at: user.invited_at || undefined
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Utilizadores</h1>
          <p className="text-gray-600">Gerir trabalhadores e suas permissões de acesso</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsInviteModalOpen(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Convite
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Trabalhador
          </Button>
        </div>
      </div>

      <UsersStats users={convertedUsers} />

      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        departments={departments}
      />

      <UsersTable
        users={convertedUsers}
        onViewUser={(user) => {
          setSelectedUser(user);
          setIsViewModalOpen(true);
        }}
        onEditUser={(user) => {
          setSelectedUser(user);
          setIsEditModalOpen(true);
        }}
        onDeleteUser={(user) => {
          setSelectedUser(user);
          setIsDeleteModalOpen(true);
        }}
        onResendInvite={(user) => resendInvite(user.id)}
        onSuspendUser={(user) => toggleUserStatus(user.id)}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
      />

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={() => {
          // Opcional: recarregar lista de usuários ou fazer outra ação
        }}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleEditUser}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};
