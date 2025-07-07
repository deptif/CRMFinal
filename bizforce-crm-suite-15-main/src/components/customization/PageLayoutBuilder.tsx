import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Layout,
  GripVertical,
  Eye,
  Settings,
  Columns,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseLayouts } from '@/hooks/useSupabaseLayouts';

// Use the types from the hook - remove local definitions to avoid conflicts
interface LayoutField {
  id: string;
  name: string;
  label: string;
  type: 'field' | 'section' | 'spacer' | 'related_list';
  required?: boolean;
  readonly?: boolean;
  width?: 'full' | 'half' | 'third' | 'quarter';
}

interface LayoutSection {
  id: string;
  name: string;
  label: string;
  columns: 1 | 2 | 3;
  collapsible: boolean;
  expanded: boolean;
  fields: LayoutField[];
}

interface PageLayout {
  id: string;
  name: string;
  label: string;
  object: string;
  isDefault: boolean;
  assignedProfiles: string[];
  sections: LayoutSection[];
  created_at: Date;
  updated_at?: Date;
}

const SortableField = ({ field }: { field: LayoutField }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center p-2 bg-white dark:bg-gray-800 border rounded-lg shadow-sm"
    >
      <div {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 ml-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{field.label}</span>
          <div className="flex items-center space-x-1">
            {field.required && (
              <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
            )}
            {field.readonly && (
              <Badge variant="secondary" className="text-xs">Readonly</Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {field.type}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-gray-500">{field.name}</p>
      </div>
    </div>
  );
};

export const PageLayoutBuilder = () => {
  const { layouts, loadLayouts, createLayout, updateLayout, deleteLayout } = useSupabaseLayouts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState<PageLayout | null>(null);
  const [viewingLayout, setViewingLayout] = useState<PageLayout | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'builder'>('info');
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    object: 'Account',
    isDefault: false,
    assignedProfiles: ['all']
  });

  const [sections, setSections] = useState<LayoutSection[]>([
    {
      id: '1',
      name: 'information',
      label: 'Informações Gerais',
      columns: 2,
      collapsible: true,
      expanded: true,
      fields: [
        { id: 'f1', name: 'name', label: 'Nome', type: 'field', required: true, width: 'full' },
        { id: 'f2', name: 'email', label: 'Email', type: 'field', required: true, width: 'half' },
        { id: 'f3', name: 'phone', label: 'Telefone', type: 'field', width: 'half' },
      ]
    }
  ]);

  const objectTypes = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case'];
  const profiles = ['all', 'admin', 'sales_manager', 'sales_rep', 'marketing_user'];
  
  const availableFields = [
    { id: 'name', label: 'Nome', type: 'field' },
    { id: 'email', label: 'Email', type: 'field' },
    { id: 'phone', label: 'Telefone', type: 'field' },
    { id: 'website', label: 'Website', type: 'field' },
    { id: 'industry', label: 'Setor', type: 'field' },
    { id: 'description', label: 'Descrição', type: 'field' },
    { id: 'created_date', label: 'Data de Criação', type: 'field' },
    { id: 'modified_date', label: 'Data de Modificação', type: 'field' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadLayouts();
  }, [loadLayouts]);

  const handleView = (layout: PageLayout) => {
    setViewingLayout(layout);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (layout: PageLayout) => {
    setEditingLayout(layout);
    setFormData({
      name: layout.name,
      label: layout.label,
      object: layout.object,
      isDefault: layout.isDefault,
      assignedProfiles: layout.assignedProfiles
    });
    setSections(layout.sections);
    setIsDialogOpen(true);
  };

  const handleDelete = async (layoutId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este layout?')) {
      await deleteLayout(layoutId);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((sections) => {
        const activeSection = sections.find(s => s.fields.some(f => f.id === active.id));
        const overSection = sections.find(s => s.fields.some(f => f.id === over.id));
        
        if (activeSection && overSection && activeSection.id === overSection.id) {
          const updatedSections = sections.map(section => {
            if (section.id === activeSection.id) {
              const oldIndex = section.fields.findIndex(f => f.id === active.id);
              const newIndex = section.fields.findIndex(f => f.id === over.id);
              
              return {
                ...section,
                fields: arrayMove(section.fields, oldIndex, newIndex)
              };
            }
            return section;
          });
          
          return updatedSections;
        }
        
        return sections;
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.label) {
      toast.error('Nome e rótulo são obrigatórios');
      return;
    }

    const layoutData = {
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      label: formData.label,
      object: formData.object,
      isDefault: formData.isDefault,
      assignedProfiles: formData.assignedProfiles,
      sections: sections
    };

    try {
      if (editingLayout) {
        await updateLayout(editingLayout.id, layoutData);
      } else {
        await createLayout(layoutData);
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar layout:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      object: 'Account',
      isDefault: false,
      assignedProfiles: ['all']
    });
    setSections([
      {
        id: '1',
        name: 'information',
        label: 'Informações Gerais',
        columns: 2,
        collapsible: true,
        expanded: true,
        fields: [
          { id: 'f1', name: 'name', label: 'Nome', type: 'field', required: true, width: 'full' },
          { id: 'f2', name: 'email', label: 'Email', type: 'field', required: true, width: 'half' },
          { id: 'f3', name: 'phone', label: 'Telefone', type: 'field', width: 'half' },
        ]
      }
    ]);
    setEditingLayout(null);
    setActiveTab('info');
  };

  const addSection = () => {
    const newSection: LayoutSection = {
      id: Date.now().toString(),
      name: `section_${sections.length + 1}`,
      label: `Nova Seção ${sections.length + 1}`,
      columns: 2,
      collapsible: true,
      expanded: true,
      fields: []
    };
    setSections([...sections, newSection]);
  };

  const addFieldToSection = (sectionId: string, fieldId: string) => {
    const availableField = availableFields.find(f => f.id === fieldId);
    if (!availableField) return;

    const newField: LayoutField = {
      id: `${fieldId}_${Date.now()}`,
      name: availableField.id,
      label: availableField.label,
      type: availableField.type as any,
      width: 'half'
    };

    setSections(sections => sections.map(section => 
      section.id === sectionId 
        ? { ...section, fields: [...section.fields, newField] }
        : section
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Page Layouts</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure layouts de página para diferentes objetos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Layout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLayout ? 'Editar Page Layout' : 'Criar Page Layout'}
              </DialogTitle>
              <DialogDescription>
                Configure o layout da página para o objeto selecionado
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${activeTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('info')}
              >
                Informações
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'builder' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('builder')}
              >
                Construtor
              </button>
            </div>
            
            {activeTab === 'info' ? (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Rótulo do Layout *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="ex: Layout de Conta Empresarial"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da API *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ex: enterprise_account_layout"
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
                  <Label>Perfis Atribuídos</Label>
                  <div className="flex flex-wrap gap-2">
                    {profiles.map((profile) => (
                      <Badge
                        key={profile}
                        variant={formData.assignedProfiles.includes(profile) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newProfiles = formData.assignedProfiles.includes(profile)
                            ? formData.assignedProfiles.filter(p => p !== profile)
                            : [...formData.assignedProfiles, profile];
                          setFormData({...formData, assignedProfiles: newProfiles});
                        }}
                      >
                        {profile}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Construtor de Layout</h3>
                  <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Seção
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-4">
                    {sections.map((section) => (
                      <Card key={section.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Layout className="h-5 w-5" />
                              <Input
                                value={section.label}
                                onChange={(e) => {
                                  setSections(sections => sections.map(s => 
                                    s.id === section.id ? { ...s, label: e.target.value } : s
                                  ));
                                }}
                                className="font-semibold text-lg border-none p-0 h-auto"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={section.columns.toString()}
                                onValueChange={(value) => {
                                  setSections(sections => sections.map(s => 
                                    s.id === section.id ? { ...s, columns: parseInt(value) as 1 | 2 | 3 } : s
                                  ));
                                }}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 Col</SelectItem>
                                  <SelectItem value="2">2 Col</SelectItem>
                                  <SelectItem value="3">3 Col</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={section.fields.map(f => f.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {section.fields.map((field) => (
                                  <SortableField key={field.id} field={field} />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                          
                          {section.fields.length === 0 && (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                              Arraste campos para esta seção
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Campos Disponíveis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {availableFields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div className="flex items-center space-x-2">
                                <Database className="h-4 w-4" />
                                <span className="text-sm">{field.label}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addFieldToSection(sections[0]?.id, field.id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingLayout ? 'Atualizar' : 'Criar'} Layout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Layout Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visualizar Layout: {viewingLayout?.label}</DialogTitle>
              <DialogDescription>
                Preview do layout "{viewingLayout?.label}" para o objeto {viewingLayout?.object}
              </DialogDescription>
            </DialogHeader>
            
            {viewingLayout && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Nome:</strong> {viewingLayout.name}
                  </div>
                  <div>
                    <strong>Objeto:</strong> {viewingLayout.object}
                  </div>
                  <div>
                    <strong>Padrão:</strong> {viewingLayout.isDefault ? 'Sim' : 'Não'}
                  </div>
                  <div>
                    <strong>Perfis:</strong> {viewingLayout.assignedProfiles.join(', ')}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Seções do Layout</h3>
                  <div className="space-y-4">
                    {viewingLayout.sections.map((section) => (
                      <Card key={section.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{section.label}</CardTitle>
                            <Badge variant="outline">{section.columns} Coluna{section.columns > 1 ? 's' : ''}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className={`grid grid-cols-${section.columns} gap-2`}>
                            {section.fields.map((field) => (
                              <div
                                key={field.id}
                                className="p-2 bg-gray-50 dark:bg-gray-800 border rounded text-sm"
                              >
                                <div className="font-medium">{field.label}</div>
                                <div className="text-xs text-gray-500">{field.name}</div>
                                <div className="flex gap-1 mt-1">
                                  {field.required && (
                                    <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                                  )}
                                  {field.readonly && (
                                    <Badge variant="secondary" className="text-xs">Readonly</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {layouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Layout className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum layout encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Configure layouts de página personalizados para organizar campos e seções
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Layout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layouts.map((layout) => (
            <Card key={layout.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Layout className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{layout.label}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{layout.object}</p>
                    </div>
                  </div>
                  {layout.isDefault && (
                    <Badge variant="default" className="text-xs">Padrão</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Columns className="h-4 w-4 text-gray-400" />
                    <span>Seções: {layout.sections.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    <span>Campos: {layout.sections.reduce((acc, s) => acc + s.fields.length, 0)}</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Perfis:</p>
                  <div className="flex flex-wrap gap-1">
                    {layout.assignedProfiles.map((profile) => (
                      <Badge key={profile} variant="outline" className="text-xs">
                        {profile}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Criado em {new Date(layout.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => handleView(layout)} title="Visualizar">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(layout)} title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDelete(layout.id)}
                      title="Excluir"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
