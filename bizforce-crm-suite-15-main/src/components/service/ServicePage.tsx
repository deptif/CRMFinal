
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HeadphonesIcon, 
  Plus, 
  Search, 
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  User,
  Calendar
} from 'lucide-react';
import { Case } from '@/types';
import { toast } from 'sonner';
import { NewCaseModal } from './NewCaseModal';
import { CaseCommentModal } from './CaseCommentModal';
import { EditCaseModal } from './EditCaseModal';

export const ServicePage = () => {
  // Initial cases data removed - ready for database integration
  const [cases, setCases] = useState<Case[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'in_progress': return 'Em Andamento';
      case 'waiting': return 'Aguardando';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'critical': return 'Crítica';
      default: return priority;
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.contact_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || caseItem.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatsForStatus = (status: string) => {
    return cases.filter(c => c.status === status).length;
  };

  // Modal handlers
  const handleNewCase = (newCase: Case) => {
    setCases([newCase, ...cases]);
    
    // TODO: Replace with actual database call
    // await createCaseInDB(newCase);
  };

  const handleEditCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowEditModal(true);
  };

  const handleSaveEditedCase = (updatedCase: Case) => {
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
    
    // TODO: Replace with actual database call
    // await updateCaseInDB(updatedCase);
  };

  const handleCommentCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowCommentModal(true);
  };

  const handleResolveCase = (caseId: string) => {
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, status: 'closed' } : c
    ));
    toast.success('Caso marcado como resolvido!');
    
    // TODO: Replace with actual database call
    // await updateCaseStatusInDB(caseId, 'closed');
  };

  // TODO: Add function to load cases from database
  // useEffect(() => {
  //   const loadCases = async () => {
  //     try {
  //       const casesData = await fetchCasesFromDB();
  //       setCases(casesData);
  //     } catch (error) {
  //       console.error('Failed to load cases:', error);
  //     }
  //   };
  //   loadCases();
  // }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atendimento ao Cliente</h1>
          <p className="text-gray-600">Gerir casos e solicitações de suporte</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewCaseModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Caso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Novos</p>
                <p className="text-2xl font-bold">{getStatsForStatus('new')}</p>
              </div>
              <HeadphonesIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold">{getStatsForStatus('in_progress')}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aguardando</p>
                <p className="text-2xl font-bold">{getStatsForStatus('waiting')}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold">{getStatsForStatus('closed')}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar casos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todas as Prioridades</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="new">Novo</option>
                <option value="in_progress">Em Andamento</option>
                <option value="waiting">Aguardando</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Casos</TabsTrigger>
          <TabsTrigger value="kanban">Quadro Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredCases.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <HeadphonesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum caso encontrado</h3>
                <p className="text-gray-600 mb-4">Comece criando o seu primeiro caso de suporte</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNewCaseModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Caso
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{caseItem.case_number}</h3>
                        <Badge className={getPriorityColor(caseItem.priority)}>
                          {getPriorityLabel(caseItem.priority)}
                        </Badge>
                        <Badge className={getStatusColor(caseItem.status)}>
                          {getStatusLabel(caseItem.status)}
                        </Badge>
                      </div>
                      
                      <h4 className="text-gray-900 font-medium">{caseItem.subject}</h4>
                      <p className="text-gray-600 text-sm">{caseItem.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{caseItem.contact_name}</span>
                        </div>
                        <span><strong>Conta:</strong> {caseItem.account_name}</span>
                        <span><strong>Responsável:</strong> {caseItem.owner_name}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{caseItem.created_at.toLocaleDateString('pt-PT')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCommentCase(caseItem)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditCase(caseItem)}
                      >
                        Editar
                      </Button>
                      {caseItem.status !== 'closed' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleResolveCase(caseItem.id)}
                        >
                          Resolver
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['new', 'in_progress', 'waiting', 'closed'].map((status) => (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {getStatusLabel(status)}
                    <Badge variant="secondary">
                      {cases.filter(c => c.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cases
                    .filter(c => c.status === status)
                    .map((caseItem) => (
                    <Card key={caseItem.id} className="p-3 cursor-pointer hover:shadow-sm">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{caseItem.case_number}</span>
                          <Badge 
                            className={`${getPriorityColor(caseItem.priority)} text-xs`}
                          >
                            {getPriorityLabel(caseItem.priority)}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {caseItem.subject}
                        </h4>
                        <div className="text-xs text-gray-500">
                          <p>{caseItem.contact_name}</p>
                          <p>{caseItem.account_name}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {cases.filter(c => c.status === status).length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Nenhum caso</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewCaseModal
        open={showNewCaseModal}
        onOpenChange={setShowNewCaseModal}
        onSave={handleNewCase}
      />

      <CaseCommentModal
        case={selectedCase}
        open={showCommentModal}
        onOpenChange={setShowCommentModal}
      />

      <EditCaseModal
        case={selectedCase}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleSaveEditedCase}
      />
    </div>
  );
};
