
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Plus,
  Euro,
  Calendar,
  User,
  Building2,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { OpportunityModal } from './OpportunityModal';
import { useDataExport } from '@/hooks/useDataExport';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSupabaseOpportunities } from '@/hooks/useSupabaseOpportunities';
import type { Opportunity } from '@/types';

const stageColumns = [
  { id: 'lead', title: 'Lead', color: 'bg-gray-100' },
  { id: 'qualified', title: 'Qualificado', color: 'bg-blue-100' },
  { id: 'proposal', title: 'Proposta', color: 'bg-yellow-100' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-orange-100' },
  { id: 'closed_won', title: 'Fechado', color: 'bg-green-100' }
];

export const OpportunitiesPage = () => {
  const { opportunities, isLoading, createOpportunity, updateOpportunity, deleteOpportunity } = useSupabaseOpportunities();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const { exportData } = useDataExport();
  const { hasPermission } = usePermissions();

  const handleCreateOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'created_at'>) => {
    try {
      const result = await createOpportunity(opportunityData);
      if (result.error) {
        console.error('Erro ao criar oportunidade:', result.error);
        return;
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
    }
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleUpdateOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'created_at'>) => {
    if (!editingOpportunity) return;
    
    try {
      const result = await updateOpportunity(editingOpportunity.id, opportunityData);
      if (result.error) {
        console.error('Erro ao atualizar oportunidade:', result.error);
        return;
      }
      setEditingOpportunity(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta oportunidade?')) return;
    
    try {
      const result = await deleteOpportunity(opportunityId);
      if (result.error) {
        console.error('Erro ao eliminar oportunidade:', result.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar oportunidade:', error);
    }
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const getTotalValueByStage = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((total, opp) => total + opp.amount, 0);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-100 text-gray-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportData = (type: 'pdf' | 'excel') => {
    const exportableData = opportunities.map(opp => ({
      nome: opp.name,
      conta: opp.account_name,
      valor: `€${opp.amount.toLocaleString()}`,
      probabilidade: `${opp.probability}%`,
      fase: opp.stage,
      data_fechamento: opp.close_date.toLocaleDateString('pt-PT'),
      responsavel: opp.owner_name
    }));

    exportData({
      data: exportableData,
      filename: 'relatorio-oportunidades',
      type
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando oportunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Vendas</h1>
          <p className="text-gray-600">Gerir oportunidades de negócio</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasPermission('reports.view') && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                onClick={() => handleExportData('pdf')}
                className="text-red-600 hover:bg-red-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('excel')}
                className="text-green-600 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          )}
          <Button 
            onClick={() => {
              setEditingOpportunity(null);
              setIsModalOpen(true);
            }} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-5 gap-4">
        {stageColumns.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id);
          const totalValue = getTotalValueByStage(stage.id);
          
          return (
            <Card key={stage.id} className={stage.color}>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stageOpportunities.length}
                </p>
                <p className="text-sm text-gray-600">
                  €{totalValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      {opportunities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oportunidade encontrada</h3>
            <p className="text-gray-600 mb-4">Crie uma nova oportunidade para começar</p>
            <Button 
              onClick={() => {
                setEditingOpportunity(null);
                setIsModalOpen(true);
              }} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Oportunidade
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-5 gap-4 min-h-[600px]">
          {stageColumns.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            
            return (
              <Card key={stage.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{stage.title}</span>
                    <Badge variant="secondary">{stageOpportunities.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {stageOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm line-clamp-2">
                          {opportunity.name}
                        </h4>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {opportunity.account_name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            €{opportunity.amount.toLocaleString()}
                          </span>
                          <Badge className={getStageColor(opportunity.stage)} variant="secondary">
                            {opportunity.probability}%
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {opportunity.close_date.toLocaleDateString('pt-PT')}
                          </span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {opportunity.owner_name.split(' ')[0]}
                          </span>
                        </div>

                        <div className="flex space-x-1 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOpportunity(opportunity)}
                            className="text-xs flex-1"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteOpportunity(opportunity.id)}
                            className="text-xs text-red-600 hover:bg-red-50"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal - sempre renderizada */}
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpportunity(null);
        }}
        onSubmit={editingOpportunity ? handleUpdateOpportunity : handleCreateOpportunity}
        editingOpportunity={editingOpportunity}
      />
    </div>
  );
};
