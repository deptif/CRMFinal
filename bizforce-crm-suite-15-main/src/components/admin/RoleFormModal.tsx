
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

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

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  permissions: Permission[];
  onSave: (roleData: Omit<Role, 'id' | 'users_count' | 'created_at'>) => void;
}

export const RoleFormModal = ({ isOpen, onClose, role, permissions, onSave }: RoleFormModalProps) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });

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

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Role description is required');
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error('Select at least one permission');
      return;
    }

    onSave(formData);
    onClose();
    
    const action = role ? 'updated' : 'created';
    toast.success(`Role ${action} successfully!`);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Edit Role' : 'New Role'}
          </DialogTitle>
          <DialogDescription>
            {role ? 'Update role information' : 'Create a new role with specific permissions'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Sales Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g. Sales and team management"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Permissions</Label>
            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
              {Object.entries(groupPermissionsByModule()).map(([module, modulePermissions]) => (
                <div key={module} className="space-y-3">
                  <h4 className="font-medium text-gray-900 border-b pb-1">{module}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-3">
                        <Switch
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={permission.id} className="text-sm font-medium">
                            {permission.name}
                          </Label>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {role ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
