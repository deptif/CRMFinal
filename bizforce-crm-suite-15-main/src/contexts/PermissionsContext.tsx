
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface PermissionsContextType {
  user: User | null;
  userPermissions: string[];
  hasPermission: (permission: string) => boolean;
  hasModule: (module: string) => boolean;
  setUser: (user: User) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// TODO: Replace with actual role permissions from database
const rolePermissions: Record<string, string[]> = {};

// System permissions - basic permissions that should exist in the system
const allPermissions: string[] = [
  // Dashboard permissions
  'dashboard.view',
  'dashboard.edit',
  'dashboard.create',
  
  // Accounts permissions
  'accounts.view',
  'accounts.create',
  'accounts.edit',
  'accounts.delete',
  
  // Contacts permissions
  'contacts.view',
  'contacts.create',
  'contacts.edit',
  'contacts.delete',
  
  // Opportunities permissions
  'opportunities.view',
  'opportunities.create',
  'opportunities.edit',
  'opportunities.delete',
  
  // Activities permissions
  'activities.view',
  'activities.create',
  'activities.edit',
  'activities.delete',
  
  // Sales permissions
  'sales.view',
  'sales.manage',
  'sales.forecasting',
  
  // Campaigns permissions
  'campaigns.view',
  'campaigns.create',
  'campaigns.edit',
  'campaigns.delete',
  
  // Products permissions
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  
  // Reports permissions
  'reports.view',
  'reports.create',
  'reports.export',
  
  // Analytics permissions
  'analytics.view',
  'analytics.advanced',
  
  // Administration permissions
  'admin.users.view',
  'admin.users.create',
  'admin.users.edit',
  'admin.users.delete',
  'admin.roles.view',
  'admin.roles.create',
  'admin.roles.edit',
  'admin.roles.delete',
  'admin.system.settings',
  
  // Integration permissions
  'integrations.view',
  'integrations.manage',
  'integrations.api',
  
  // Automation permissions
  'automation.view',
  'automation.create',
  'automation.edit',
  
  // AI permissions
  'ai.assistant',
  'ai.analytics',
  'ai.scoring'
];

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TODO: Replace with actual user from authentication
  const [user, setUser] = useState<User | null>(null);

  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const permissions = rolePermissions[user.role] || [];
      if (permissions.includes('all')) {
        setUserPermissions(allPermissions);
      } else {
        setUserPermissions(permissions);
      }
    }
  }, [user]);

  // TODO: Add useEffect to load user and permissions from database
  // useEffect(() => {
  //   const loadUserData = async () => {
  //     try {
  //       const userData = await getCurrentUser();
  //       setUser(userData);
  //     } catch (error) {
  //       console.error('Failed to load user data:', error);
  //     }
  //   };
  //   
  //   loadUserData();
  // }, []);

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission) || userPermissions.includes('all');
  };

  const hasModule = (module: string): boolean => {
    return userPermissions.some(p => p.startsWith(module)) || userPermissions.includes('all');
  };

  return (
    <PermissionsContext.Provider value={{
      user,
      userPermissions,
      hasPermission,
      hasModule,
      setUser
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
