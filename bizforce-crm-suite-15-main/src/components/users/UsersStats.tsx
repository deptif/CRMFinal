
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  UserCheck,
  Mail,
  UserX,
} from 'lucide-react';

interface User {
  id: string;
  status: 'pending' | 'active' | 'suspended';
}

interface UsersStatsProps {
  users: User[];
}

export const UsersStats = ({ users }: UsersStatsProps) => {
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Utilizadores</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold">{pendingUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <UserX className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Suspensos</p>
              <p className="text-2xl font-bold">{suspendedUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
