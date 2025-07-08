import { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  Undo2,
  Redo2,
  Folder,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardToolbarProps {
  dashboardName: string;
  isPreviewMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onLoad: () => void;
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
  onLoad,
  onUndo,
  onRedo,
  onTogglePreview,
  onExport,
  onImport
}: DashboardToolbarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(dashboardName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedName(dashboardName);
  }, [dashboardName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    if (editedName.trim() !== '') {
      onNameChange(editedName);
    } else {
      setEditedName(dashboardName);
      toast.error('O nome do dashboard não pode estar vazio');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(dashboardName);
    }
  };

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
        
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editedName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleKeyDown}
              className="w-64 h-8"
            />
          ) : (
            <h2
              className="text-lg font-medium cursor-pointer hover:text-blue-600"
              onClick={handleNameClick}
            >
              {dashboardName}
            </h2>
          )}
        </div>
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
          <Undo2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="h-8"
        >
          <Save className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Salvar</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onLoad}
          className="h-8"
        >
          <Folder className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Abrir</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-8"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
          className="h-8"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          className="h-8"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Sair do Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
