
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Phone, Clock, Plus, Trash2 } from 'lucide-react';
import { CreateTemplateModal } from './CreateTemplateModal';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  type: 'response' | 'follow-up' | 'cold-outreach' | 'proposal';
  subject: string;
  content: string;
  tags: string[];
}

interface EmailTemplatesPanelProps {
  onSelectTemplate: (template: EmailTemplate) => void;
}

export const EmailTemplatesPanel = ({ onSelectTemplate }: EmailTemplatesPanelProps) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem('email_templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  };

  const handleTemplateCreated = (newTemplate: EmailTemplate) => {
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('email_templates', JSON.stringify(updatedTemplates));
    toast.success('Template removido com sucesso!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'response': return <MessageSquare className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      case 'proposal': return <Mail className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'response': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'response': return 'Resposta';
      case 'follow-up': return 'Follow-up';
      case 'proposal': return 'Proposta';
      case 'cold-outreach': return 'Cold Outreach';
      default: return type;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Templates de Email
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Template</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
              <p className="text-gray-600 mb-4">Crie seu primeiro template de email para começar</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(template.type)}
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(template.type)}>
                        {getTypeLabel(template.type)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelectTemplate(template)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Usar Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTemplateCreated={handleTemplateCreated}
      />
    </>
  );
};
