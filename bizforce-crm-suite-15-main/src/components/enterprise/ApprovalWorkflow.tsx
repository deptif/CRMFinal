
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User,
  FileText,
  MessageCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface ApprovalStep {
  id: string;
  name: string;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  comments?: string;
  approved_at?: Date;
  order: number;
}

interface ApprovalRequest {
  id: string;
  title: string;
  type: 'discount' | 'contract' | 'quote' | 'expense' | 'custom';
  amount?: number;
  description: string;
  submitted_by: string;
  submitted_by_name: string;
  submitted_at: Date;
  current_step: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  steps: ApprovalStep[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const ApprovalWorkflow = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  // TODO: Replace with actual database queries
  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockRequests: ApprovalRequest[] = [];
    setRequests(mockRequests);
  }, []);

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
    };
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={config[priority as keyof typeof config]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const handleApproval = async (requestId: string, stepId: string, action: 'approve' | 'reject', comments?: string) => {
    try {
      // TODO: Replace with actual API call
      toast.success(`Solicitação ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso!`);
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === requestId 
          ? {
              ...req,
              steps: req.steps.map(step =>
                step.id === stepId
                  ? { ...step, status: action === 'approve' ? 'approved' : 'rejected', comments, approved_at: new Date() }
                  : step
              )
            }
          : req
      ));
    } catch (error) {
      toast.error('Erro ao processar aprovação');
    }
  };

  const calculateProgress = (request: ApprovalRequest) => {
    const completedSteps = request.steps.filter(step => 
      step.status === 'approved' || step.status === 'rejected'
    ).length;
    return (completedSteps / request.steps.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sistema de Aprovações</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie workflows de aprovação empresarial</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
            <p className="text-xs text-muted-foreground">Para aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Approval Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Aprovação</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação pendente</h3>
              <p className="text-gray-600">As solicitações de aprovação aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <p className="text-gray-600">{request.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-sm text-gray-500">
                          Por: {request.submitted_by_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {request.submitted_at.toLocaleDateString('pt-PT')}
                        </span>
                        {request.amount && (
                          <span className="text-sm font-medium">
                            €{request.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progresso da Aprovação</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(calculateProgress(request))}%
                      </span>
                    </div>
                    <Progress value={calculateProgress(request)} className="h-2" />
                  </div>

                  {/* Approval Steps */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Etapas de Aprovação:</h4>
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {request.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-2 min-w-max">
                          <div className={`p-2 rounded-full ${
                            step.status === 'approved' ? 'bg-green-100' :
                            step.status === 'rejected' ? 'bg-red-100' :
                            step.status === 'pending' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <User className="h-4 w-4" />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{step.approver_name}</div>
                            <div className="text-xs text-gray-500">{step.name}</div>
                            {step.status !== 'pending' && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {step.status}
                              </Badge>
                            )}
                          </div>
                          {index < request.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleApproval(request.id, request.steps[request.current_step]?.id, 'reject')}
                      >
                        Rejeitar
                      </Button>
                      <Button
                        onClick={() => handleApproval(request.id, request.steps[request.current_step]?.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Aprovar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
