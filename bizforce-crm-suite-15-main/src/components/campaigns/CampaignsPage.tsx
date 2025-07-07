
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, DollarSign, TrendingUp, Megaphone, Users, Edit, Trash2 } from 'lucide-react';
import { useSupabaseCampaigns } from '@/hooks/useSupabaseCampaigns';
import { CampaignModal } from './CampaignModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Campaign } from '@/types';

export const CampaignsPage = () => {
  const { campaigns, isLoading, createCampaign, refetch } = useSupabaseCampaigns();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const handleSaveCampaign = async (campaignData: any) => {
    if (editingCampaign) {
      await updateCampaign(editingCampaign.id, campaignData);
    } else {
      await createCampaign(campaignData);
    }
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          name: updates.name,
          type: updates.type,
          status: updates.status,
          budget: updates.budget,
          start_date: updates.start_date?.toISOString().split('T')[0],
          end_date: updates.end_date?.toISOString().split('T')[0],
          leads_generated: updates.leads_generated,
          conversion_rate: updates.conversion_rate,
          roi: updates.roi
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar campanha:', error);
        toast.error('Erro ao atualizar campanha');
        return;
      }

      toast.success('Campanha atualizada com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      toast.error('Erro ao atualizar campanha');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta campanha?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) {
        console.error('Erro ao eliminar campanha:', error);
        toast.error('Erro ao eliminar campanha');
        return;
      }

      toast.success('Campanha eliminada com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao eliminar campanha:', error);
      toast.error('Erro ao eliminar campanha');
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleNewCampaign = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status: Campaign['status']) => {
    const statusConfig = {
      planning: { color: 'bg-gray-100 text-gray-800', label: 'Planejando' },
      active: { color: 'bg-green-100 text-green-800', label: 'Ativa' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Pausada' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Concluída' },
    };
    
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: Campaign['type']) => {
    const typeConfig = {
      email: { color: 'bg-purple-100 text-purple-800', label: 'Email' },
      social: { color: 'bg-blue-100 text-blue-800', label: 'Social Media' },
      webinar: { color: 'bg-green-100 text-green-800', label: 'Webinar' },
      event: { color: 'bg-orange-100 text-orange-800', label: 'Evento' },
      direct_mail: { color: 'bg-gray-100 text-gray-800', label: 'Mala Direta' },
    };
    
    const config = typeConfig[type];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads_generated, 0);
  const avgConversion = campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.conversion_rate, 0) / campaigns.length : 0;
  const avgROI = campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / campaigns.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campanhas de Marketing</h1>
          <p className="text-gray-600">Gerencie e analise suas campanhas de marketing</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleNewCampaign}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Investimento total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">Total de leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversão Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Taxa de conversão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROI.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Campanhas</CardTitle>
          <CardDescription>Lista completa das campanhas de marketing</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira campanha de marketing</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleNewCampaign}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Campanha
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Conversão</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>€{campaign.budget.toLocaleString()}</TableCell>
                    <TableCell>{campaign.leads_generated}</TableCell>
                    <TableCell>{campaign.conversion_rate}%</TableCell>
                    <TableCell className="text-green-600 font-semibold">{campaign.roi}%</TableCell>
                    <TableCell>{campaign.owner_name}</TableCell>
                    <TableCell>
                      {campaign.start_date.toLocaleDateString('pt-PT')} - {campaign.end_date.toLocaleDateString('pt-PT')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCampaign(campaign.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(null);
        }}
        onSave={handleSaveCampaign}
        campaign={editingCampaign}
      />
    </div>
  );
};
