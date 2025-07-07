
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Map, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Settings,
  Globe,
  Building,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface Territory {
  id: string;
  name: string;
  description: string;
  type: 'geographic' | 'account' | 'product';
  criteria: string[];
  users: string[];
  accounts: number;
  opportunities: number;
  isActive: boolean;
}

export const TerritoryManagement = () => {
  const [territories, setTerritories] = useState<Territory[]>([
    {
      id: '1',
      name: 'Norte de Portugal',
      description: 'Território cobrindo distrito do Porto e Braga',
      type: 'geographic',
      criteria: ['Porto', 'Braga', 'Viana do Castelo'],
      users: ['user1', 'user2'],
      accounts: 45,
      opportunities: 23,
      isActive: true
    },
    {
      id: '2',
      name: 'Contas Enterprise',
      description: 'Clientes com receita anual > €1M',
      type: 'account',
      criteria: ['annual_revenue > 1000000'],
      users: ['user3'],
      accounts: 12,
      opportunities: 8,
      isActive: true
    }
  ]);

  const [selectedTerritory, setSelectedTerritory] = useState<string>('');
  const [newTerritory, setNewTerritory] = useState({
    name: '',
    description: '',
    type: 'geographic' as const,
    criteria: '',
  });

  const handleCreateTerritory = () => {
    if (!newTerritory.name.trim()) {
      toast.error('Nome do território é obrigatório');
      return;
    }

    const territory: Territory = {
      id: crypto.randomUUID(),
      name: newTerritory.name,
      description: newTerritory.description,
      type: newTerritory.type,
      criteria: newTerritory.criteria.split(',').map(c => c.trim()),
      users: [],
      accounts: 0,
      opportunities: 0,
      isActive: true
    };

    setTerritories([...territories, territory]);
    setNewTerritory({ name: '', description: '', type: 'geographic', criteria: '' });
    toast.success('Território criado com sucesso!');
  };

  const deleteTerritory = (id: string) => {
    setTerritories(territories.filter(t => t.id !== id));
    toast.success('Território removido');
  };

  const getTypeIcon = (type: Territory['type']) => {
    switch (type) {
      case 'geographic': return Globe;
      case 'account': return Building;
      case 'product': return Settings;
      default: return Map;
    }
  };

  const getTypeLabel = (type: Territory['type']) => {
    switch (type) {
      case 'geographic': return 'Geográfico';
      case 'account': return 'Conta';
      case 'product': return 'Produto';
      default: return 'Outro';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Territórios</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure territórios de vendas e atribuições</p>
        </div>
        <div className="flex items-center space-x-2">
          <Map className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">{territories.length} Territórios</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Territórios</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territories.length}</div>
            <p className="text-xs text-muted-foreground">Configurados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {territories.reduce((sum, t) => sum + t.users.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Atribuídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {territories.reduce((sum, t) => sum + t.accounts, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Sob gestão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {territories.reduce((sum, t) => sum + t.opportunities, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Territórios</TabsTrigger>
          <TabsTrigger value="create">Criar Território</TabsTrigger>
          <TabsTrigger value="assignments">Atribuições</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {territories.map((territory) => {
              const TypeIcon = getTypeIcon(territory.type);
              return (
                <Card key={territory.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-5 w-5 text-blue-600" />
                        <span>{territory.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={territory.isActive ? "default" : "secondary"}>
                          {territory.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteTerritory(territory.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{territory.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tipo:</span>
                        <Badge variant="outline">{getTypeLabel(territory.type)}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Critérios:</span>
                        <span className="text-sm text-gray-600">{territory.criteria.join(', ')}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{territory.users.length}</div>
                          <div className="text-xs text-gray-500">Utilizadores</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{territory.accounts}</div>
                          <div className="text-xs text-gray-500">Contas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{territory.opportunities}</div>
                          <div className="text-xs text-gray-500">Oportunidades</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Território</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Território</Label>
                  <Input
                    value={newTerritory.name}
                    onChange={(e) => setNewTerritory({...newTerritory, name: e.target.value})}
                    placeholder="ex: Norte de Portugal"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={newTerritory.type} onValueChange={(value: any) => setNewTerritory({...newTerritory, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geographic">Geográfico</SelectItem>
                      <SelectItem value="account">Conta</SelectItem>
                      <SelectItem value="product">Produto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={newTerritory.description}
                  onChange={(e) => setNewTerritory({...newTerritory, description: e.target.value})}
                  placeholder="Descrição do território"
                />
              </div>

              <div className="space-y-2">
                <Label>Critérios (separados por vírgula)</Label>
                <Input
                  value={newTerritory.criteria}
                  onChange={(e) => setNewTerritory({...newTerritory, criteria: e.target.value})}
                  placeholder="ex: Porto, Braga, Viana do Castelo"
                />
              </div>

              <Button onClick={handleCreateTerritory} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Território
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atribuições de Território</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure as atribuições de utilizadores aos territórios</p>
                <p className="text-sm mt-2">Feature em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
