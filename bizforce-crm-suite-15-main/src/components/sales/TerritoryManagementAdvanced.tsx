
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Map, 
  Users, 
  Target, 
  TrendingUp,
  MapPin,
  Crown,
  Settings,
  BarChart3,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface TerritoryRule {
  id: string;
  name: string;
  type: 'geographic' | 'industry' | 'company_size' | 'revenue';
  conditions: any[];
  priority: number;
}

interface Territory {
  id: string;
  name: string;
  type: 'region' | 'country' | 'state' | 'city';
  parent_id?: string;
  manager_id: string;
  manager_name: string;
  members: string[];
  rules: TerritoryRule[];
  target_revenue: number;
  actual_revenue: number;
  leads_count: number;
  opportunities_count: number;
  accounts_count: number;
  performance_score: number;
  created_at: Date;
}

interface TerritoryAssignment {
  id: string;
  territory_id: string;
  territory_name: string;
  user_id: string;
  user_name: string;
  role: 'manager' | 'member';
  assigned_at: Date;
}

export const TerritoryManagementAdvanced = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [assignments, setAssignments] = useState<TerritoryAssignment[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  // TODO: Replace with actual database queries
  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTerritories: Territory[] = [];
    const mockAssignments: TerritoryAssignment[] = [];
    
    setTerritories(mockTerritories);
    setAssignments(mockAssignments);
  }, []);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAchievementPercentage = (actual: number, target: number) => {
    return target > 0 ? Math.round((actual / target) * 100) : 0;
  };

  const handleAutoAssignment = async () => {
    try {
      // TODO: Replace with actual API call for auto-assignment
      toast.success('Atribuição automática iniciada! Processando leads...');
      
      // Simulate auto-assignment logic
      setTimeout(() => {
        toast.success('50 leads foram automaticamente atribuídos aos territórios!');
      }, 2000);
    } catch (error) {
      toast.error('Erro na atribuição automática');
    }
  };

  const handleRebalancing = async () => {
    try {
      // TODO: Replace with actual API call for territory rebalancing
      toast.success('Rebalanceamento de territórios iniciado!');
      
      setTimeout(() => {
        toast.success('Territórios rebalanceados com sucesso!');
      }, 3000);
    } catch (error) {
      toast.error('Erro no rebalanceamento');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Territory Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestão avançada de territórios e atribuição inteligente</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleAutoAssignment}>
            <Target className="h-4 w-4 mr-2" />
            Auto-Atribuir Leads
          </Button>
          <Button variant="outline" onClick={handleRebalancing}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Rebalancear
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Território
          </Button>
        </div>
      </div>

      {/* Territory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Territórios Ativos</CardTitle>
            <Map className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territories.length}</div>
            <p className="text-xs text-muted-foreground">Configurados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Distribuídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Contra meta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Atribuídos</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Territory Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Hierarquia de Territórios</CardTitle>
        </CardHeader>
        <CardContent>
          {territories.length === 0 ? (
            <div className="text-center py-12">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum território configurado</h3>
              <p className="text-gray-600">Configure territórios para organizar sua equipe de vendas</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Território
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {territories.map((territory) => (
                <div key={territory.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{territory.name}</h3>
                        <p className="text-gray-600">Gerente: {territory.manager_name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="outline">{territory.type}</Badge>
                          <span className="text-sm text-gray-500">
                            {territory.members.length} membros
                          </span>
                          <span className={`text-sm font-medium ${getPerformanceColor(territory.performance_score)}`}>
                            Score: {territory.performance_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        €{territory.actual_revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Meta: €{territory.target_revenue.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${
                        getAchievementPercentage(territory.actual_revenue, territory.target_revenue) >= 100 
                          ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {getAchievementPercentage(territory.actual_revenue, territory.target_revenue)}% alcançado
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progresso da Meta</span>
                      <span className="text-sm text-gray-500">
                        {getAchievementPercentage(territory.actual_revenue, territory.target_revenue)}%
                      </span>
                    </div>
                    <Progress 
                      value={getAchievementPercentage(territory.actual_revenue, territory.target_revenue)} 
                      className="h-2" 
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{territory.accounts_count}</div>
                      <div className="text-sm text-gray-600">Contas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{territory.opportunities_count}</div>
                      <div className="text-sm text-gray-600">Oportunidades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{territory.leads_count}</div>
                      <div className="text-sm text-gray-600">Leads</div>
                    </div>
                  </div>

                  {/* Territory Rules */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium">Regras de Atribuição:</h4>
                    <div className="flex flex-wrap gap-2">
                      {territory.rules.map((rule) => (
                        <Badge key={rule.id} variant="outline" className="text-xs">
                          {rule.name} ({rule.type})
                        </Badge>
                      ))}
                      {territory.rules.length === 0 && (
                        <span className="text-sm text-gray-500">Nenhuma regra configurada</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Atribuição Automática</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Atribuição Inteligente</h3>
            <p className="text-gray-600 mb-4">
              Configure regras para atribuir automaticamente leads baseado em localização, setor, tamanho da empresa
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Configurar Regras
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
