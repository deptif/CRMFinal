
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { APIKeyManager } from './APIKeyManager';
import { ThemeSettings } from './ThemeSettings';
import { ProfileSection } from './ProfileSection';
import { NotificationsSection } from './NotificationsSection';
import { EmailConfigSection } from './EmailConfigSection';
import { SecuritySection } from './SecuritySection';
import { SystemInfoSection } from './SystemInfoSection';

export const SettingsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [userSettings, setUserSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    role: user?.role || '',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    taskReminders: true
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-3">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Configurações
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileSection 
              userSettings={userSettings}
              onUserSettingsChange={setUserSettings}
            />
            
            {/* Admin Only - Email Configuration */}
            {isAdmin && <EmailConfigSection />}
            
            {/* Admin Only - API Key Management */}
            {isAdmin && <APIKeyManager />}
            
            <NotificationsSection 
              notifications={notifications}
              onNotificationsChange={setNotifications}
            />
          </div>

          {/* Right Column - Side Settings */}
          <div className="space-y-6">
            <ThemeSettings />
            
            {/* Admin Only - Security Section */}
            {isAdmin && <SecuritySection />}
            
            {/* Admin Only - System Info */}
            {isAdmin && <SystemInfoSection />}
          </div>
        </div>
      </div>
    </div>
  );
};
