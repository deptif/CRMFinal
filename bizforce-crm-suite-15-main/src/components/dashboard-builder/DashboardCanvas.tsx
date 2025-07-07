
import { useCallback, useState } from 'react';
import { ComponentLayout } from '@/types/dashboard';
import { DashboardComponent } from './DashboardComponent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Grid, Eye, EyeOff } from 'lucide-react';

interface DashboardCanvasProps {
  layout: ComponentLayout[];
  selectedComponent: string | null;
  isPreviewMode: boolean;
  onLayoutChange: (layout: ComponentLayout[]) => void;
  onComponentSelect: (id: string | null) => void;
  onComponentAdd: (type: string, position: { x: number; y: number }) => void;
  onComponentRemove: (id: string) => void;
  onComponentUpdate: (id: string, updates: Partial<ComponentLayout>) => void;
}

export const DashboardCanvas = ({
  layout,
  selectedComponent,
  isPreviewMode,
  onLayoutChange,
  onComponentSelect,
  onComponentAdd,
  onComponentRemove,
  onComponentUpdate,
}: DashboardCanvasProps) => {
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [dropIndicator, setDropIndicator] = useState<{ x: number; y: number } | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('application/component-type');
    
    if (componentType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left - 16) / 120); // Account for padding
      const y = Math.floor((e.clientY - rect.top - 16) / 80);
      
      onComponentAdd(componentType, { x: Math.max(0, x), y: Math.max(0, y) });
    }
    
    setDropIndicator(null);
  }, [onComponentAdd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - 16) / 120);
    const y = Math.floor((e.clientY - rect.top - 16) / 80);
    
    setDropIndicator({ x: Math.max(0, x), y: Math.max(0, y) });
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only hide indicator if leaving the canvas area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropIndicator(null);
    }
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onComponentSelect(null);
    }
  }, [onComponentSelect]);

  const handleComponentDragStart = useCallback((componentId: string) => {
    setDraggedComponent(componentId);
  }, []);

  const handleComponentDragEnd = useCallback(() => {
    setDraggedComponent(null);
  }, []);

  const handleComponentResize = useCallback((componentId: string, size: { w: number; h: number }) => {
    onComponentUpdate(componentId, {
      position: {
        ...layout.find(c => c.id === componentId)?.position!,
        w: size.w,
        h: size.h,
      }
    });
  }, [layout, onComponentUpdate]);

  const handleComponentMove = useCallback((componentId: string, position: { x: number; y: number }) => {
    onComponentUpdate(componentId, {
      position: {
        ...layout.find(c => c.id === componentId)?.position!,
        x: position.x,
        y: position.y,
      }
    });
  }, [layout, onComponentUpdate]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Canvas Toolbar */}
      {!isPreviewMode && (
        <div className="flex items-center justify-between p-3 bg-white border-b">
          <div className="flex items-center gap-2">
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grade {showGrid ? 'Visível' : 'Oculta'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {layout.length} componente{layout.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-gray-400">
              📱 Arraste para mover • 🔄 Use as alças para redimensionar
            </span>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        className={`flex-1 relative overflow-auto ${
          showGrid && !isPreviewMode ? 'bg-grid-pattern' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: showGrid && !isPreviewMode 
            ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`
            : undefined,
          backgroundSize: showGrid && !isPreviewMode ? '20px 20px' : undefined,
        }}
      >
        {/* Drop Indicator */}
        {dropIndicator && !isPreviewMode && (
          <div
            className="absolute border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg opacity-50 z-30 pointer-events-none"
            style={{
              left: dropIndicator.x * 120 + 16,
              top: dropIndicator.y * 80 + 16,
              width: 240, // 2 grid cells default
              height: 160, // 2 grid cells default
            }}
          />
        )}

        {layout.length === 0 && !isPreviewMode ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Canvas Vazio
              </h3>
              <p className="text-gray-500 mb-4">
                Arraste componentes da biblioteca à esquerda para começar a construir seu dashboard
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <div>💡 <strong>Dica:</strong> Use arrastar e soltar para posicionar</div>
                <div>🔄 <strong>Redimensione:</strong> Selecione e use as alças azuis</div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="p-4 relative">
            {layout.map(component => (
              <DashboardComponent
                key={component.id}
                component={component}
                isSelected={selectedComponent === component.id}
                isPreviewMode={isPreviewMode}
                isDragging={draggedComponent === component.id}
                onSelect={() => onComponentSelect(component.id)}
                onRemove={() => onComponentRemove(component.id)}
                onUpdate={(updates) => onComponentUpdate(component.id, updates)}
                onDragStart={() => handleComponentDragStart(component.id)}
                onDragEnd={handleComponentDragEnd}
                onResize={(size) => handleComponentResize(component.id, size)}
                onMove={(position) => handleComponentMove(component.id, position)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
