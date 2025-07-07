
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileType,
  Settings,
  Users,
  Layout,
  Copy,
  Eye,
  Download,
  Upload,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface RecordType {
  id: string;
  name: string;
  label: string;
  description: string;
  object: string;
  isActive: boolean;
  isDefault: boolean;
  pageLayoutId?: string;
  profileIds: string[];
  picklistValues: Record<string, string[]>;
  businessProcessId?: string;
  validationRules: string[];
  created_at: Date;
  updated_at: Date;
}

export const RecordTypesManager = () => {
  const [recordTypes, setRecordTypes] = useState<RecordType[]>(() => {
    const saved = localStorage.getItem('recordTypes');
    return saved ? JSON.parse(saved).map((rt: any) => ({
      ...rt,
      created_at: new Date(rt.created_at),
      updated_at: new Date(rt.updated_at)
    })) : [];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecordType, setEditingRecordType] = useState<RecordType | null>(null);
  const [filterObject, setFilterObject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    object: 'Account',
    isActive: true,
    isDefault: false,
    pageLayoutId: '',
    profileIds: ['all'],
    businessProcessId: '',
    picklistValues: {},
    validationRules: []
  });

  const saveToStorage = (recordTypes: RecordType[]) => {
    localStorage.setItem('recordTypes', JSON.stringify(recordTypes));
  };

  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case', 'Product', 'Quote', 'Campaign'];
  const profiles = [
    { id: 'all', name: 'Todos os Perfis' },
    { id: 'admin', name: 'Administrador do Sistema' },
    { id: 'sales_manager', name: 'Gerente de Vendas' },
    { id: 'sales_rep', name: 'Representante de Vendas' },
    { id: 'marketing_user', name: 'Usuário de Marketing' },
    { id: 'service_agent', name: 'Agente de Serviço' }
  ];
  
  const pageLayouts = [
    { id: 'layout_1', name: 'Layout Padrão' },
    { id: 'layout_2', name: 'Layout Empresarial' },
    { id: 'layout_3', name: 'Layout Simplificado' },
    { id: 'layout_4', name: 'Layout Compacto' },
    { id: 'layout_5', name: 'Layout Detalhado' }
  ];

  const businessProcesses = [
    { id: 'process_1', name: 'Processo de Vendas Padrão' },
    { id: 'process_2', name: 'Processo Enterprise' },
    { id: 'process_3', name: 'Processo Simplificado' }
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.label) {
      toast.error('Nome e rótulo são obrigatórios');
      return;
    }

    // Verificar se já existe um record type com o mesmo nome para o mesmo objeto
    const existingRecordType = recordTypes.find(rt => 
      rt.name === formData.name.toLowerCase().replace(/\s+/g, '_') && 
      rt.object === formData.object &&
      rt.id !== editingRecordType?.id
    );

    if (existingRecordType) {
      toast.error('Já existe um tipo de registro com este nome para este objeto');
      return;
    }

    const newRecordType: RecordType = {
      id: editingRecordType?.id || crypto.randomUUID(),
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      label: formData.label,
      description: formData.description,
      object: formData.object,
      isActive: formData.isActive,
      isDefault: formData.isDefault,
      pageLayoutId: formData.pageLayoutId,
      profileIds: formData.profileIds,
      businessProcessId: formData.businessProcessId,
      picklistValues: formData.picklistValues,
      validationRules: formData.validationRules,
      created_at: editingRecordType?.created_at || new Date(),
      updated_at: new Date()
    };

    let updatedRecordTypes;
    if (editingRecordType) {
      updatedRecordTypes = recordTypes.map(rt => rt.id === editingRecordType.id ? newRecordType : rt);
      toast.success('Tipo de registro atualizado com sucesso!');
    } else {
      updatedRecordTypes = [...recordTypes, newRecordType];
      toast.success('Tipo de registro criado com sucesso!');
    }

    setRecordTypes(updatedRecordTypes);
    saveToStorage(updatedRecordTypes);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      description: '',
      object: 'Account',
      isActive: true,
      isDefault: false,
      pageLayoutId: '',
      profileIds: ['all'],
      businessProcessId: '',
      picklistValues: {},
      validationRules: []
    });
    setEditingRecordType(null);
  };

  const handleEdit = (recordType: RecordType) => {
    setEditingRecordType(recordType);
    setFormData({
      name: recordType.name,
      label: recordType.label,
      description: recordType.description,
      object: recordType.object,
      isActive: recordType.isActive,
      isDefault: recordType.isDefault,
      pageLayoutId: recordType.pageLayoutId || '',
      profileIds: recordType.profileIds,
      businessProcessId: recordType.businessProcessId || '',
      picklistValues: recordType.picklistValues,
      validationRules: recordType.validationRules
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (recordTypeId: string) => {
    const recordType = recordTypes.find(rt => rt.id === recordTypeId);
    if (recordType?.isDefault) {
      toast.error('Não é possível excluir o tipo de registro padrão');
      return;
    }

    const updatedRecordTypes = recordTypes.filter(rt => rt.id !== recordTypeId);
    setRecordTypes(updatedRecordTypes);
    saveToStorage(updatedRecordTypes);
    toast.success('Tipo de registro removido com sucesso!');
  };

  const toggleActiveStatus = (recordTypeId: string) => {
    const updatedRecordTypes = recordTypes.map(rt => 
      rt.id === recordTypeId ? { ...rt, isActive: !rt.isActive, updated_at: new Date() } : rt
    );
    setRecordTypes(updatedRecordTypes);
    saveToStorage(updatedRecordTypes);
    toast.success('Status do tipo de registro alterado!');
  };

  const setAsDefault = (recordTypeId: string) => {
    const recordType = recordTypes.find(rt => rt.id === recordTypeId);
    if (!recordType) return;

    const updatedRecordTypes = recordTypes.map(rt => ({
      ...rt,
      isDefault: rt.object === recordType.object ? rt.id === recordTypeId : rt.isDefault,
      updated_at: rt.id === recordTypeId || (rt.object === recordType.object && rt.isDefault) ? new Date() : rt.updated_at
    }));
    
    setRecordTypes(updatedRecordTypes);
    saveToStorage(updatedRecordTypes);
    toast.success('Tipo de registro definido como padrão!');
  };

  const duplicateRecordType = (recordType: RecordType) => {
    const duplicatedRecordType: RecordType = {
      ...recordType,
      id: crypto.randomUUID(),
      name: `${recordType.name}_copy`,
      label: `${recordType.label} (Cópia)`,
      isDefault: false,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const updatedRecordTypes = [...recordTypes, duplicatedRecordType];
    setRecordTypes(updatedRecordTypes);
    saveToStorage(updatedRecordTypes);
    toast.success('Tipo de registro duplicado com sucesso!');
  };

  const exportRecordTypes = () => {
    const dataStr = JSON.stringify(recordTypes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'record-types.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Tipos de registro exportados com sucesso!');
  };

  const filteredRecordTypes = recordTypes.filter(recordType => {
    const matchesObject = filterObject === 'all' || recordType.object === filterObject;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && recordType.isActive) ||
      (filterStatus === 'inactive' && !recordType.isActive);
    const matchesSearch = !searchTerm || 
      recordType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recordType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recordType.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesObject && matchesStatus && matchesSearch;
  });

  const statsData = {
    total: recordTypes.length,
    active: recordTypes.filter(rt => rt.isActive).length,
    inactive: recordTypes.filter(rt => !rt.isActive).length,
    default: recordTypes.filter(rt => rt.isDefault).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Record Types</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure tipos de registro com layouts e permissões específicas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportRecordTypes}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Tipo de Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRecordType ? 'Editar Tipo de Registro' : 'Criar Novo Tipo de Registro'}
                </DialogTitle>
                <DialogDescription>
                  Configure as propriedades do tipo de registro e suas associações
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Rótulo *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="ex: Conta Empresarial"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome API *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ex: enterprise_account"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Objeto</Label>
                  <Select value={formData.object} onValueChange={(value) => setFormData({...formData, object: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {objectTypes.map((object) => (
                        <SelectItem key={object} value={object}>
                          {object}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Page Layout</Label>
                  <Select value={formData.pageLayoutId} onValueChange={(value) => setFormData({...formData, pageLayoutId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {pageLayouts.map((layout) => (
                        <SelectItem key={layout.id} value={layout.id}>
                          {layout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Processo de Negócio</Label>
                  <Select value={formData.businessProcessId} onValueChange={(value) => setFormData({...formData, businessProcessId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um processo" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessProcesses.map((process) => (
                        <SelectItem key={process.id} value={process.id}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Configurações</Label>
                  <div className="flex flex-col space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                      />
                      <span className="text-sm">Ativo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isDefault}
                        onCheckedChange={(checked) => setFormData({...formData, isDefault: checked})}
                      />
                      <span className="text-sm">Padrão para o objeto</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o propósito deste tipo de registro..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingRecordType ? 'Atualizar' : 'Criar'} Tipo de Registro
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statsData.total}</div>
            <p className="text-sm text-gray-600">Total de Tipos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statsData.active}</div>
            <p className="text-sm text-gray-600">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-400">{statsData.inactive}</div>
            <p className="text-sm text-gray-600">Inativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statsData.default}</div>
            <p className="text-sm text-gray-600">Padrão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar tipos de registro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Objeto:</Label>
              <Select value={filterObject} onValueChange={setFilterObject}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {objectTypes.map((object) => (
                    <SelectItem key={object} value={object}>{object}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Status:</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'inactive')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredRecordTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileType className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {recordTypes.length === 0 ? 'Nenhum tipo de registro encontrado' : 'Nenhum tipo corresponde aos filtros'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {recordTypes.length === 0 
                ? 'Configure tipos de registro com layouts e permissões específicas para organizar seus dados'
                : 'Ajuste os filtros para ver mais tipos de registro'
              }
            </p>
            {recordTypes.length === 0 && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Tipo de Registro
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordTypes.map((recordType) => (
            <Card key={recordType.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileType className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{recordType.label}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{recordType.object}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {recordType.isDefault && (
                      <Badge variant="default" className="text-xs">Padrão</Badge>
                    )}
                    <Badge variant={recordType.isActive ? "default" : "secondary"} className="text-xs">
                      {recordType.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recordType.description || 'Nenhuma descrição disponível'}
                </p>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Layout:</span>
                    <span>{pageLayouts.find(l => l.id === recordType.pageLayoutId)?.name || 'Nenhum'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Processo:</span>
                    <span>{businessProcesses.find(p => p.id === recordType.businessProcessId)?.name || 'Nenhum'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Perfis:</span>
                    <span>{recordType.profileIds.length}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Criado em {recordType.created_at.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => duplicateRecordType(recordType)}
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {!recordType.isDefault && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setAsDefault(recordType.id)}
                        title="Definir como Padrão"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => toggleActiveStatus(recordType.id)}
                      title="Alternar Status"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEdit(recordType)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!recordType.isDefault && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(recordType.id)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
