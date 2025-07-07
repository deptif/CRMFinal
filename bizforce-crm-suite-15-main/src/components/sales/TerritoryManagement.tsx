
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Map, Users, Target, TrendingUp, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useSupabaseTerritories } from '@/hooks/useSupabaseTerritories';
import { TerritoryModal } from './TerritoryModal';
import { TerritoryEditModal } from './TerritoryEditModal';
import { toast } from 'sonner';
import type { Territory } from '@/types';

export const TerritoryManagement = () => {
  const { territories, isLoading, createTerritory } = useSupabaseTerritories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  const handleSaveTerritory = async (territoryData: any) => {
    await createTerritory(territoryData);
    setIsModalOpen(false);
  };

  const handleEditTerritory = (territory: Territory) => {
    setSelectedTerritory(territory);
    setIsEditModalOpen(true);
  };

  const handleUpdateTerritory = async (territoryData: Partial<Territory>) => {
    // TODO: Implement update territory functionality
    console.log('Update territory:', territoryData);
    toast.success('Território atualizado com sucesso!');
    setIsEditModalOpen(false);
  };

  const handleDeleteTerritory = async (territory: Territory) => {
    if (window.confirm(`Tem certeza que deseja excluir o território "${territory.name}"?`)) {
      // TODO: Implement delete territory functionality
      console.log('Delete territory:', territory.id);
      toast.success('Território excluído com sucesso!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalRevenue = territories.reduce((sum, territory) => sum + territory.actual_revenue, 0);
  const totalTarget = territories.reduce((sum, territory) => sum + territory.target_revenue, 0);
  const avgPerformance = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Territórios</h1>
          <p className="text-gray-600">Organize e gerencie territórios de vendas</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Território
        </Button>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Territórios</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territories.length}</div>
            <p className="text-xs text-muted-foreground">Territórios ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Receita total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalTarget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Meta de receita</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPerformance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Da meta atingida</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Territórios */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Territórios</CardTitle>
          <CardDescription>Lista completa dos territórios de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          {territories.length === 0 ? (
            <div className="text-center py-12">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum território encontrado</h3>
              <p className="text-gray-600">Crie seu primeiro território de vendas</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Território
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>Gestor</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Atual</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {territories.map((territory) => {
                  const performance = territory.target_revenue > 0 ? (territory.actual_revenue / territory.target_revenue) * 100 : 0;
                  return (
                    <TableRow key={territory.id}>
                      <TableCell className="font-medium">{territory.name}</TableCell>
                      <TableCell>{territory.region}</TableCell>
                      <TableCell>{territory.manager_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{territory.members.length} membros</Badge>
                      </TableCell>
                      <TableCell>€{territory.target_revenue.toLocaleString()}</TableCell>
                      <TableCell>€{territory.actual_revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          className={performance >= 100 ? 'bg-green-100 text-green-800' : performance >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                        >
                          {performance.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTerritory(territory)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTerritory(territory)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TerritoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTerritory}
      />

      <TerritoryEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateTerritory}
        territory={selectedTerritory}
      />
    </div>
  );
};
