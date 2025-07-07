
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Building, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { ChangeAvatarModal } from './ChangeAvatarModal';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar: string;
}

interface ProfileSectionProps {
  userSettings: UserSettings;
  onUserSettingsChange: (settings: UserSettings) => void;
}

export const ProfileSection = ({ userSettings, onUserSettingsChange }: ProfileSectionProps) => {
  const [changeAvatarOpen, setChangeAvatarOpen] = useState(false);

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    onUserSettingsChange({ ...userSettings, avatar: newAvatarUrl });
  };

  return (
    <>
      <Card className="border border-gray-200 hover:border-blue-200 transition-colors">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-2">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Perfil do Utilizador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src={userSettings.avatar} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userSettings.name ? userSettings.name.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {userSettings.name || 'Nome do Utilizador'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {userSettings.role || 'Função não definida'}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setChangeAvatarOpen(true)}
                className="text-xs h-7"
              >
                Alterar Foto
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <User className="h-3 w-3 mr-1 text-gray-500" />
                Nome Completo
              </Label>
              <Input
                id="name"
                value={userSettings.name}
                onChange={(e) => onUserSettingsChange({ ...userSettings, name: e.target.value })}
                placeholder="Nome completo"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <Mail className="h-3 w-3 mr-1 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userSettings.email}
                onChange={(e) => onUserSettingsChange({ ...userSettings, email: e.target.value })}
                placeholder="seu.email@exemplo.pt"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <Phone className="h-3 w-3 mr-1 text-gray-500" />
                Telefone
              </Label>
              <Input
                id="phone"
                value={userSettings.phone}
                onChange={(e) => onUserSettingsChange({ ...userSettings, phone: e.target.value })}
                placeholder="+351 900 000 000"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <Building className="h-3 w-3 mr-1 text-gray-500" />
                Empresa
              </Label>
              <Input
                id="company"
                value={userSettings.company}
                onChange={(e) => onUserSettingsChange({ ...userSettings, company: e.target.value })}
                placeholder="Nome da empresa"
                className="h-9"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="role" className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <Briefcase className="h-3 w-3 mr-1 text-gray-500" />
                Papel no Sistema
              </Label>
              <Input
                id="role"
                value={userSettings.role}
                disabled
                className="h-9 bg-gray-100 dark:bg-gray-800"
                placeholder="Papel no sistema"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button 
              onClick={handleSaveProfile} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Salvar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangeAvatarModal
        open={changeAvatarOpen}
        onOpenChange={setChangeAvatarOpen}
        currentAvatar={userSettings.avatar}
        onAvatarChange={handleAvatarChange}
      />
    </>
  );
};
