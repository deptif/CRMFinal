
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff, 
  Download, 
  Upload,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DashboardToolbarProps {
  dashboardName: string;
  isPreviewMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePreview: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const DashboardToolbar = ({
  dashboardName,
  isPreviewMode,
  canUndo,
  canRedo,
  onNameChange,
  onSave,
  onUndo,
  onRedo,
  onTogglePreview,
  onExport,
  onImport,
}: DashboardToolbarProps) => {
  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard Builder</h1>
          <Badge variant="outline" className="text-xs">
            Beta
          </Badge>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Input
          value={dashboardName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-64 h-8"
          placeholder="Nome do dashboard"
        />
      </div>

      {/* Center section */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8"
        >
          <Undo className="h-3 w-3 mr-1" />
          Desfazer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8"
        >
          <Redo className="h-3 w-3 mr-1" />
          Refazer
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          className="h-8"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Sair do Preview
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </>
          )}
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
          className="h-8"
        >
          <Upload className="h-3 w-3 mr-1" />
          Importar
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-8"
        >
          <Download className="h-3 w-3 mr-1" />
          Exportar
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          className="h-8"
        >
          <Save className="h-3 w-3 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
};
