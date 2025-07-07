import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Plus, 
  Edit3, 
  Trash2,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { RoleFormModal } from './RoleFormModal';
import { DeleteRoleModal } from './DeleteRoleModal';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users_count: number;
  created_at: Date;
}

export const RolesManager = () => {
  // TODO: Replace with actual data from database
  const [roles, setRoles] = useState<Role[]>([]);

  // System permissions - basic permissions structure
  const [permissions] = useState<Permission[]>([
    // Dashboard permissions
    { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to dashboard', module: 'Dashboard' },
    { id: 'dashboard.edit', name: 'Edit Dashboard', description: 'Modify dashboard layout', module: 'Dashboard' },
    { id: 'dashboard.create', name: 'Create Dashboard', description: 'Create new dashboards', module: 'Dashboard' },
    
    // Accounts permissions
    { id: 'accounts.view', name: 'View Accounts', description: 'View account records', module: 'Accounts' },
    { id: 'accounts.create', name: 'Create Accounts', description: 'Create new accounts', module: 'Accounts' },
    { id: 'accounts.edit', name: 'Edit Accounts', description: 'Modify account records', module: 'Accounts' },
    { id: 'accounts.delete', name: 'Delete Accounts', description: 'Delete account records', module: 'Accounts' },
    
    // Contacts permissions
    { id: 'contacts.view', name: 'View Contacts', description: 'View contact records', module: 'Contacts' },
    { id: 'contacts.create', name: 'Create Contacts', description: 'Create new contacts', module: 'Contacts' },
    { id: 'contacts.edit', name: 'Edit Contacts', description: 'Modify contact records', module: 'Contacts' },
    { id: 'contacts.delete', name: 'Delete Contacts', description: 'Delete contact records', module: 'Contacts' },
    
    // Opportunities permissions
    { id: 'opportunities.view', name: 'View Opportunities', description: 'View opportunity records', module: 'Opportunities' },
    { id: 'opportunities.create', name: 'Create Opportunities', description: 'Create new opportunities', module: 'Opportunities' },
    { id: 'opportunities.edit', name: 'Edit Opportunities', description: 'Modify opportunity records', module: 'Opportunities' },
    { id: 'opportunities.delete', name: 'Delete Opportunities', description: 'Delete opportunity records', module: 'Opportunities' },
    
    // Sales permissions
    { id: 'sales.view', name: 'View Sales', description: 'Access sales information', module: 'Sales' },
    { id: 'sales.manage', name: 'Manage Sales', description: 'Manage sales processes', module: 'Sales' },
    { id: 'sales.forecasting', name: 'Sales Forecasting', description: 'Access forecasting tools', module: 'Sales' },
    
    // Reports permissions
    { id: 'reports.view', name: 'View Reports', description: 'Access reports', module: 'Reports' },
    { id: 'reports.create', name: 'Create Reports', description: 'Create custom reports', module: 'Reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Export report data', module: 'Reports' },
    
    // Administration permissions
    { id: 'admin.users.view', name: 'View Users', description: 'View user management', module: 'Administration' },
    { id: 'admin.users.create', name: 'Create Users', description: 'Create new users', module: 'Administration' },
    { id: 'admin.users.edit', name: 'Edit Users', description: 'Modify user accounts', module: 'Administration' },
    { id: 'admin.users.delete', name: 'Delete Users', description: 'Delete user accounts', module: 'Administration' },
    { id: 'admin.roles.view', name: 'View Roles', description: 'View roles and permissions', module: 'Administration' },
    { id: 'admin.roles.create', name: 'Create Roles', description: 'Create new roles', module: 'Administration' },
    { id: 'admin.roles.edit', name: 'Edit Roles', description: 'Modify roles', module: 'Administration' },
    { id: 'admin.roles.delete', name: 'Delete Roles', description: 'Delete roles', module: 'Administration' },
    { id: 'admin.system.settings', name: 'System Settings', description: 'Access system settings', module: 'Administration' },
    
    // Integration permissions
    { id: 'integrations.view', name: 'View Integrations', description: 'View integration settings', module: 'Integrations' },
    { id: 'integrations.manage', name: 'Manage Integrations', description: 'Configure integrations', module: 'Integrations' },
    { id: 'integrations.api', name: 'API Access', description: 'Access API management', module: 'Integrations' },
    
    // AI permissions
    { id: 'ai.assistant', name: 'AI Assistant', description: 'Access AI assistant features', module: 'AI Tools' },
    { id: 'ai.analytics', name: 'AI Analytics', description: 'Access AI analytics', module: 'AI Tools' },
    { id: 'ai.scoring', name: 'AI Scoring', description: 'Access AI lead scoring', module: 'AI Tools' }
  ]);

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRole = (roleData: Omit<Role, 'id' | 'users_count' | 'created_at'>) => {
    if (selectedRole) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === selectedRole.id 
          ? { ...role, ...roleData }
          : role
      ));
      // TODO: Update role in database
    } else {
      // Create new role
      const newRole: Role = {
        id: Date.now().toString(),
        ...roleData,
        users_count: 0,
        created_at: new Date()
      };
      setRoles(prev => [...prev, newRole]);
      // TODO: Save new role to database
    }
  };

  const handleConfirmDelete = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    // TODO: Delete role from database
  };

  const getRolePermissionCount = (role: Role) => {
    if (role.permissions.includes('all')) return permissions.length;
    return role.permissions.length;
  };

  const groupPermissionsByModule = () => {
    const grouped: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    return grouped;
  };

  // TODO: Add useEffect to load roles and permissions from database
  // useEffect(() => {
  //   const loadRolesAndPermissions = async () => {
  //     try {
  //       const [rolesData, permissionsData] = await Promise.all([
  //         fetchRoles(),
  //         fetchPermissions()
  //       ]);
  //       setRoles(rolesData);
  //       setPermissions(permissionsData);
  //     } catch (error) {
  //       console.error('Failed to load roles and permissions:', error);
  //       toast.error('Failed to load roles and permissions');
  //     }
  //   };
  //   
  //   loadRolesAndPermissions();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions Management</h1>
          <p className="text-gray-600">Granular system access control</p>
        </div>
        <Button onClick={handleCreateRole} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roles.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new role.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleCreateRole} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-lg">{role.name}</h3>
                            <Badge variant="secondary">
                              {getRolePermissionCount(role)} permissions
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              {role.users_count} users
                            </Badge>
                          </div>
                          <p className="text-gray-600">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.includes('all') ? (
                              <Badge className="bg-green-100 text-green-800">
                                Full Access
                              </Badge>
                            ) : (
                              role.permissions.slice(0, 3).map((permission) => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permissions.find(p => p.id === permission)?.name}
                                </Badge>
                              ))
                            )}
                            {role.permissions.length > 3 && !role.permissions.includes('all') && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteRole(role)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permissions Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Available Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {permissions.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No permissions configured
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupPermissionsByModule()).map(([module, modulePermissions]) => (
                    <div key={module} className="space-y-2">
                      <h4 className="font-medium text-gray-900">{module}</h4>
                      <div className="space-y-1">
                        {modulePermissions.map((permission) => (
                          <div key={permission.id} className="text-sm">
                            <span className="font-medium">{permission.name}</span>
                            <p className="text-gray-500 text-xs">{permission.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <RoleFormModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={selectedRole}
        permissions={permissions}
        onSave={handleSaveRole}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        role={selectedRole}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};
