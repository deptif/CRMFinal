
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Plus, 
  Search, 
  Users,
  Target,
  TrendingUp,
  Building,
  DollarSign
} from 'lucide-react';
import { useSupabaseTerritories } from '@/hooks/useSupabaseTerritories';
import { TerritoryModal } from './TerritoryModal';

export const TerritoriesPage = () => {
  const { territories, isLoading, createTerritory } = useSupabaseTerritories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveTerritory = async (territoryData: any) => {
    await createTerritory(territoryData);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredTerritories = territories.filter(territory =>
    territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    territory.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    territory.manager_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTarget = territories.reduce((sum, t) => sum + t.target_revenue, 0);
  const totalActual = territories.reduce((sum, t) => sum + t.actual_revenue, 0);
  const overallPercentage = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Territórios</h1>
          <p className="text-gray-600">Gerir territórios de vendas e performance regional</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Território
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Territórios</p>
                <p className="text-2xl font-bold">{territories.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meta Total</p>
                <p className="text-2xl font-bold">€{(totalTarget / 1000000).toFixed(1)}M</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Atual</p>
                <p className="text-2xl font-bold">€{(totalActual / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance Geral</p>
                <p className="text-2xl font-bold">{overallPercentage.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar territórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Territories Grid */}
      {filteredTerritories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum território encontrado</h3>
            <p className="text-gray-600 mb-4">Crie o seu primeiro território de vendas</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Território
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerritories.map((territory) => {
            const percentage = territory.target_revenue > 0 ? (territory.actual_revenue / territory.target_revenue) * 100 : 0;
            const isOnTarget = percentage >= 80;
            
            return (
              <Card key={territory.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{territory.name}</CardTitle>
                    <Badge 
                      className={isOnTarget ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {percentage.toFixed(0)}% da meta
                    </Badge>
                  </div>
                  <p className="text-gray-600">{territory.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Manager */}
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Gestor:</strong> {territory.manager_name}
                    </span>
                  </div>

                  {/* Team Members */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Equipa ({territory.members.length} membros):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {territory.members.length > 0 ? (
                        territory.members.map((member, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {member}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Nenhum membro atribuído</span>
                      )}
                    </div>
                  </div>

                  {/* Revenue Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Receita Atual</span>
                      <span>€{territory.actual_revenue.toLocaleString()} / €{territory.target_revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Building className="h-4 w-4 mr-2" />
                      Ver Contas
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Relatórios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TerritoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTerritory}
      />
    </div>
  );
};
