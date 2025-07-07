
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Target, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSupabaseCustomerJourney } from '@/hooks/useSupabaseCustomerJourney';
import { useSupabaseContacts } from '@/hooks/useSupabaseContacts';
import { CustomerJourneyModal } from './CustomerJourneyModal';

export const CustomerJourney = () => {
  const { journeyStages, isLoading: stagesLoading, createJourneyStage } = useSupabaseCustomerJourney();
  const { contacts, isLoading: contactsLoading } = useSupabaseContacts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveStage = async (stageData: any) => {
    await createJourneyStage(stageData);
    setIsModalOpen(false);
  };

  if (stagesLoading || contactsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Organizar etapas por ordem
  const orderedStages = journeyStages.sort((a, b) => a.stage_order - b.stage_order);
  
  // Agrupar por nome da etapa para mostrar estatísticas
  const stageGroups = orderedStages.reduce((acc, stage) => {
    if (!acc[stage.stage_name]) {
      acc[stage.stage_name] = [];
    }
    acc[stage.stage_name].push(stage);
    return acc;
  }, {} as Record<string, typeof journeyStages>);

  const totalContacts = contacts.length;
  const stagesWithContacts = Object.keys(stageGroups).length;
  const completedStages = journeyStages.filter(s => s.completed_at).length;
  const conversionRate = journeyStages.length > 0 ? (completedStages / journeyStages.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jornada do Cliente</h1>
          <p className="text-gray-600">Visualize e gerencie a jornada dos seus clientes</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Etapa
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalContacts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Etapas Ativas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stagesWithContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Etapas Concluídas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{completedStages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo da Jornada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(stageGroups).length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma etapa da jornada criada</h3>
              <p className="text-gray-600 mb-4">Comece mapeando as etapas da jornada do cliente</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Etapa
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              {Object.entries(stageGroups).map(([stageName, stages], index) => (
                <div key={stageName} className="flex items-center">
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-4 min-w-[200px]">
                    <h3 className="font-semibold text-gray-900 mb-2">{stageName}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Contactos:</span>
                        <Badge variant="outline">{stages.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Concluídos:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {stages.filter(s => s.completed_at).length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < Object.keys(stageGroups).length - 1 && (
                    <ArrowRight className="h-6 w-6 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Stages */}
      {orderedStages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes das Etapas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderedStages.map((stage) => (
                <div key={stage.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{stage.stage_name}</h3>
                      <p className="text-gray-600 text-sm">{stage.description}</p>
                    </div>
                    <Badge className={stage.completed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {stage.completed_at ? 'Concluída' : 'Em Progresso'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Ordem: {stage.stage_order} | 
                    Criada: {stage.created_at.toLocaleDateString('pt-PT')}
                    {stage.completed_at && ` | Concluída: ${stage.completed_at.toLocaleDateString('pt-PT')}`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CustomerJourneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStage}
      />
    </div>
  );
};
