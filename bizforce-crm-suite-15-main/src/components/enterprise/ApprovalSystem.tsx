
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  ArrowRight,
  DollarSign,
  FileText,
  AlertCircle,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { NewRequestModal } from './NewRequestModal';
import { ApprovalActionModal } from './ApprovalActionModal';

interface ApprovalRequest {
  id: string;
  type: 'discount' | 'contract' | 'expense' | 'deal';
  title: string;
  description: string;
  amount?: number;
  requestedBy: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  currentApprover: string;
  approvalChain: ApprovalStep[];
  priority: 'low' | 'medium' | 'high';
}

interface ApprovalStep {
  id: string;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp?: Date;
  order: number;
}

export const ApprovalSystem = () => {
  // Ready for database integration - no mock data
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject';
    requestId: string;
    requestTitle: string;
  }>({
    isOpen: false,
    action: 'approve',
    requestId: '',
    requestTitle: ''
  });

  const handleNewRequest = (requestData: any) => {
    setApprovalRequests([requestData, ...approvalRequests]);
    
    // TODO: Replace with actual database call
    // await createApprovalRequestInDB(requestData);
  };

  const handleApprovalAction = (requestId: string, action: 'approve' | 'reject') => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (!request) return;

    setApprovalAction({
      isOpen: true,
      action,
      requestId,
      requestTitle: request.title
    });
  };

  const confirmApprovalAction = (comments: string) => {
    const { action, requestId } = approvalAction;
    
    setApprovalRequests(prevRequests => 
      prevRequests.map(request => {
        if (request.id === requestId) {
          const updatedChain = request.approvalChain.map(step => {
            if (step.approver === request.currentApprover && step.status === 'pending') {
              return {
                ...step,
                status: (action === 'approve' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected',
                comments,
                timestamp: new Date()
              };
            }
            return step;
          });

          // Determine next status and approver
          let newStatus: 'pending' | 'approved' | 'rejected' | 'in_review' = request.status;
          let newCurrentApprover = request.currentApprover;

          if (action === 'reject') {
            newStatus = 'rejected';
          } else {
            // Find next pending approver
            const nextPendingStep = updatedChain.find(step => step.status === 'pending');
            if (nextPendingStep) {
              newStatus = 'in_review';
              newCurrentApprover = nextPendingStep.approver;
            } else {
              newStatus = 'approved';
            }
          }

          return {
            ...request,
            status: newStatus,
            currentApprover: newCurrentApprover,
            approvalChain: updatedChain
          };
        }
        return request;
      })
    );

    toast.success(`Solicitação ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    
    // TODO: Replace with actual database call
    // await updateApprovalStatusInDB(requestId, action, comments);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendente' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Aprovado' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejeitado' },
      in_review: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Em Análise' }
    };
    
    const { color, icon: Icon, label } = config[status as keyof typeof config];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'Baixa' },
      medium: { color: 'bg-blue-100 text-blue-800', label: 'Média' },
      high: { color: 'bg-red-100 text-red-800', label: 'Alta' }
    };
    
    const { color, label } = config[priority as keyof typeof config];
    return <Badge className={color}>{label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <DollarSign className="h-4 w-4" />;
      case 'contract': return <FileText className="h-4 w-4" />;
      case 'expense': return <DollarSign className="h-4 w-4" />;
      case 'deal': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // TODO: Add function to load approval requests from database
  // useEffect(() => {
  //   const loadApprovalRequests = async () => {
  //     try {
  //       const requestsData = await fetchApprovalRequestsFromDB();
  //       setApprovalRequests(requestsData);
  //     } catch (error) {
  //       console.error('Error loading approval requests:', error);
  //     }
  //   };
  //   loadApprovalRequests();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Aprovações</h1>
          <p className="text-gray-600">Gerencie aprovações multi-nível para negócios e processos</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsNewRequestModalOpen(true)}
        >
          <Send className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      {/* KPI Cards */}
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
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Aprovações processadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Para aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Aguardando dados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="my-requests">Minhas Solicitações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aprovações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              {approvalRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma aprovação pendente</p>
                  <p className="text-sm mt-2">As solicitações aparecerão aqui quando criadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalRequests
                    .filter(req => req.status === 'pending' || req.status === 'in_review')
                    .map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getTypeIcon(request.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.title}</h3>
                            <p className="text-sm text-gray-600">{request.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm text-gray-500">Por: {request.requestedBy}</span>
                              {request.amount && (
                                <span className="text-sm font-medium">
                                  €{request.amount.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(request.priority)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>

                      {/* Approval Chain */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Cadeia de Aprovação:</h4>
                        <div className="flex items-center space-x-2">
                          {request.approvalChain.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                                step.status === 'approved' ? 'bg-green-100 text-green-800' :
                                step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                step.status === 'pending' && request.currentApprover === step.approver ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                <User className="h-3 w-3" />
                                <span>{step.approver}</span>
                                <span className="text-xs">({step.role})</span>
                              </div>
                              {index < request.approvalChain.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {request.currentApprover === 'Ana Silva' && request.status !== 'approved' && request.status !== 'rejected' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprovalAction(request.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleApprovalAction(request.id, 'reject')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              {approvalRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma solicitação encontrada</p>
                  <p className="text-sm mt-2">Suas solicitações aparecerão aqui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(request.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{request.title}</h3>
                          <p className="text-sm text-gray-600">{request.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">
                              Criado: {request.createdAt.toLocaleDateString('pt-PT')}
                            </span>
                            {request.amount && (
                              <span className="text-sm font-medium">
                                €{request.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Aprovações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum histórico encontrado</p>
                <p className="text-sm mt-2">O histórico de aprovações aparecerá aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSave={handleNewRequest}
      />

      <ApprovalActionModal
        isOpen={approvalAction.isOpen}
        onClose={() => setApprovalAction({...approvalAction, isOpen: false})}
        onConfirm={confirmApprovalAction}
        action={approvalAction.action}
        requestTitle={approvalAction.requestTitle}
      />
    </div>
  );
};
