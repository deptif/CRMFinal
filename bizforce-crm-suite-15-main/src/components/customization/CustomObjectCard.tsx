
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Edit, Trash2, Settings, Eye, Users } from 'lucide-react';

interface CustomObject {
  id: string;
  name: string;
  label: string;
  pluralLabel: string;
  description: string;
  icon: string;
  isActive: boolean;
  recordCount: number;
  fields: number;
  created_at: Date;
}

interface CustomObjectCardProps {
  object: CustomObject;
  onEdit: (object: CustomObject) => void;
  onDelete: (objectId: string) => void;
  onToggleStatus: (objectId: string) => void;
}

export const CustomObjectCard = ({ object, onEdit, onDelete, onToggleStatus }: CustomObjectCardProps) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">{object.label}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{object.name}</p>
            </div>
          </div>
          <Badge variant={object.isActive ? "default" : "secondary"}>
            {object.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {object.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{object.recordCount} registros</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-gray-400" />
            <span>{object.fields} campos</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Criado em {object.created_at.toLocaleDateString('pt-BR')}
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => onToggleStatus(object.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(object)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(object.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
