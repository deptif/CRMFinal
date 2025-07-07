
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  GitBranch,
  Save,
  RotateCcw,
  Eye,
  Clock,
  User,
  MessageSquare,
  Archive,
  GitCompare
} from 'lucide-react';
import { toast } from 'sonner';

interface FormulaVersion {
  id: string;
  version: string;
  formula: string;
  comment: string;
  author: string;
  timestamp: Date;
  isActive: boolean;
  changes?: {
    added: string[];
    removed: string[];
    modified: string[];
  };
}

interface FormulaVersionControlProps {
  currentFormula: string;
  onFormulaRestore: (formula: string) => void;
  fieldId: string;
}

export const FormulaVersionControl = ({ 
  currentFormula, 
  onFormulaRestore, 
  fieldId 
}: FormulaVersionControlProps) => {
  const [versions, setVersions] = useState<FormulaVersion[]>(() => {
    const saved = localStorage.getItem(`formula_versions_${fieldId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showCompare, setShowCompare] = useState<string | null>(null);
  const [saveComment, setSaveComment] = useState('');

  const saveVersion = () => {
    if (!currentFormula.trim()) {
      toast.error('Não é possível salvar uma fórmula vazia');
      return;
    }

    const newVersion: FormulaVersion = {
      id: crypto.randomUUID(),
      version: `v${versions.length + 1}.0`,
      formula: currentFormula,
      comment: saveComment || 'Versão salva automaticamente',
      author: 'Usuário Atual', // Em uma implementação real, pegaria do contexto de auth
      timestamp: new Date(),
      isActive: true
    };

    // Detectar mudanças
    if (versions.length > 0) {
      const lastVersion = versions[versions.length - 1];
      newVersion.changes = detectChanges(lastVersion.formula, currentFormula);
    }

    // Marcar todas as outras versões como inativas
    const updatedVersions = versions.map(v => ({ ...v, isActive: false }));
    const newVersionsList = [...updatedVersions, newVersion];
    
    setVersions(newVersionsList);
    localStorage.setItem(`formula_versions_${fieldId}`, JSON.stringify(newVersionsList));
    setSaveComment('');
    
    toast.success(`Versão ${newVersion.version} salva com sucesso!`);
  };

  const restoreVersion = (version: FormulaVersion) => {
    onFormulaRestore(version.formula);
    
    // Marcar como versão ativa
    const updatedVersions = versions.map(v => ({
      ...v,
      isActive: v.id === version.id
    }));
    
    setVersions(updatedVersions);
    localStorage.setItem(`formula_versions_${fieldId}`, JSON.stringify(updatedVersions));
    
    toast.success(`Fórmula restaurada para ${version.version}`);
  };

  const detectChanges = (oldFormula: string, newFormula: string) => {
    // Análise simples de mudanças - em uma implementação real seria mais sofisticada
    const oldLines = oldFormula.split('\n');
    const newLines = newFormula.split('\n');
    
    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];
    
    // Detectar linhas adicionadas
    newLines.forEach((line, index) => {
      if (!oldLines.includes(line) && line.trim()) {
        added.push(`Linha ${index + 1}: ${line.trim()}`);
      }
    });
    
    // Detectar linhas removidas
    oldLines.forEach((line, index) => {
      if (!newLines.includes(line) && line.trim()) {
        removed.push(`Linha ${index + 1}: ${line.trim()}`);
      }
    });
    
    return { added, removed, modified };
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getChangesSummary = (changes?: FormulaVersion['changes']) => {
    if (!changes) return null;
    
    const total = changes.added.length + changes.removed.length + changes.modified.length;
    if (total === 0) return null;
    
    return (
      <div className="text-xs text-gray-500">
        {changes.added.length > 0 && <span className="text-green-600">+{changes.added.length} </span>}
        {changes.removed.length > 0 && <span className="text-red-600">-{changes.removed.length} </span>}
        {changes.modified.length > 0 && <span className="text-blue-600">~{changes.modified.length}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Save New Version */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <span>Controle de Versão</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Comentário da Versão:</Label>
            <Textarea
              value={saveComment}
              onChange={(e) => setSaveComment(e.target.value)}
              placeholder="Descreva as mudanças feitas nesta versão..."
              rows={2}
            />
          </div>
          <Button onClick={saveVersion} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Salvar Nova Versão
          </Button>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Versões</CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma versão salva</p>
              <p className="text-sm">Salve sua primeira versão para começar o controle de versões</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {versions.reverse().map((version) => (
                <Card key={version.id} className={`p-3 ${version.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className="space-y-2">
                    {/* Version Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={version.isActive ? "default" : "outline"}>
                          {version.version}
                        </Badge>
                        {version.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Ativa
                          </Badge>
                        )}
                        {getChangesSummary(version.changes)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowCompare(showCompare === version.id ? null : version.id)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!version.isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => restoreVersion(version)}
                            title="Restaurar versão"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Version Info */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{version.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(version.timestamp)}</span>
                      </div>
                      {version.comment && (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="truncate max-w-32">{version.comment}</span>
                        </div>
                      )}
                    </div>

                    {/* Expanded View */}
                    {showCompare === version.id && (
                      <div className="mt-3 space-y-2 border-t pt-2">
                        <div>
                          <Label className="text-xs font-medium">Fórmula:</Label>
                          <div className="bg-gray-100 p-2 rounded text-xs font-mono mt-1 max-h-20 overflow-y-auto">
                            {version.formula}
                          </div>
                        </div>
                        
                        {version.changes && (
                          <div>
                            <Label className="text-xs font-medium">Mudanças:</Label>
                            <div className="space-y-1 mt-1">
                              {version.changes.added.map((change, index) => (
                                <div key={index} className="text-xs text-green-600 bg-green-50 p-1 rounded">
                                  + {change}
                                </div>
                              ))}
                              {version.changes.removed.map((change, index) => (
                                <div key={index} className="text-xs text-red-600 bg-red-50 p-1 rounded">
                                  - {change}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
