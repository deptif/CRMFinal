
import { useState, useRef, useCallback } from 'react';
import { ComponentLayout } from '@/types/dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Move, MoreVertical } from 'lucide-react';
import { ChartRenderer } from './renderers/ChartRenderer';
import { MetricRenderer } from './renderers/MetricRenderer';
import { TableRenderer } from './renderers/TableRenderer';
import { FilterRenderer } from './renderers/FilterRenderer';
import { LayoutRenderer } from './renderers/LayoutRenderer';
import { TextRenderer } from './renderers/TextRenderer';
import { ActionRenderer } from './renderers/ActionRenderer';

interface DashboardComponentProps {
  component: ComponentLayout;
  isSelected: boolean;
  isPreviewMode: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<ComponentLayout>) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onResize: (size: { w: number; h: number }) => void;
  onMove: (position: { x: number; y: number }) => void;
}

export const DashboardComponent = ({
  component,
  isSelected,
  isPreviewMode,
  isDragging,
  onSelect,
  onRemove,
  onUpdate,
  onDragStart,
  onDragEnd,
  onResize,
  onMove,
}: DashboardComponentProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingComponent, setIsDraggingComponent] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });

  const renderComponent = () => {
    const { type } = component;

    // Charts
    if (['line-chart', 'bar-chart', 'pie-chart', 'donut-chart', 'area-chart', 'scatter-plot'].includes(type)) {
      return <ChartRenderer component={component} />;
    }

    // Metrics
    if (['kpi-card', 'counter', 'progress-bar', 'gauge'].includes(type)) {
      return <MetricRenderer component={component} />;
    }

    // Tables
    if (type === 'data-table') {
      return <TableRenderer component={component} />;
    }

    // Filters
    if (['date-picker', 'dropdown', 'multi-select', 'search-box'].includes(type)) {
      return <FilterRenderer component={component} />;
    }

    // Layout
    if (['container', 'spacer', 'divider', 'tabs'].includes(type)) {
      return <LayoutRenderer component={component} />;
    }

    // Text
    if (['heading', 'paragraph', 'label'].includes(type)) {
      return <TextRenderer component={component} />;
    }

    // Actions
    if (['button', 'link'].includes(type)) {
      return <ActionRenderer component={component} />;
    }

    return (
      <div className="p-4 text-center text-gray-500">
        Componente {type} não implementado
      </div>
    );
  };

  const calculateSize = () => {
    const baseWidth = 120; // Grid cell width
    const baseHeight = 80; // Grid cell height
    
    return {
      width: component.position.w * baseWidth,
      height: component.position.h * baseHeight,
    };
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode || isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDraggingComponent(true);
    onDragStart();
    onSelect();
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialPosition.current = { x: component.position.x, y: component.position.y };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const gridDeltaX = Math.round(deltaX / 120);
      const gridDeltaY = Math.round(deltaY / 80);
      
      const newX = Math.max(0, initialPosition.current.x + gridDeltaX);
      const newY = Math.max(0, initialPosition.current.y + gridDeltaY);
      
      if (newX !== component.position.x || newY !== component.position.y) {
        onMove({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingComponent(false);
      onDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isPreviewMode, isResizing, component.position, onDragStart, onDragEnd, onSelect, onMove]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = component.position.w;
    const startHeight = component.position.h;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newW = startWidth;
      let newH = startHeight;
      
      if (direction.includes('right')) {
        newW = Math.max(1, startWidth + Math.round(deltaX / 120));
      }
      if (direction.includes('bottom')) {
        newH = Math.max(1, startHeight + Math.round(deltaY / 80));
      }
      
      if (newW !== component.position.w || newH !== component.position.h) {
        onResize({ w: newW, h: newH });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isPreviewMode, component.position, onResize]);

  const size = calculateSize();

  return (
    <div
      ref={componentRef}
      className={`absolute select-none transition-all duration-200 ${
        isDragging || isDraggingComponent ? 'opacity-50 z-50 cursor-grabbing' : 'z-10'
      } ${isSelected && !isPreviewMode ? 'z-20' : ''} ${
        !isPreviewMode && !isDraggingComponent ? 'cursor-grab hover:cursor-grab' : ''
      }`}
      style={{
        left: component.position.x * 120,
        top: component.position.y * 80,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-full h-full relative group ${
          isSelected && !isPreviewMode
            ? 'ring-2 ring-blue-500 ring-offset-2'
            : 'hover:ring-1 hover:ring-gray-300'
        }`}
      >
        {/* Component Controls */}
        {!isPreviewMode && (
          <>
            {/* Header with controls */}
            <div className={`absolute top-0 left-0 right-0 bg-white border-b rounded-t-lg p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''} transition-opacity z-10 cursor-grab`}>
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600 truncate">
                  {component.title || component.type}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Resize handles */}
            {isSelected && (
              <>
                {/* Bottom-right resize handle */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize z-20 rounded-tl-lg flex items-center justify-center"
                  onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
                >
                  <div className="w-2 h-2 bg-white rounded-sm opacity-80"></div>
                </div>
                
                {/* Right resize handle */}
                <div
                  className="absolute top-1/2 right-0 w-2 h-8 bg-blue-500 cursor-e-resize z-20 rounded-l-lg transform -translate-y-1/2"
                  onMouseDown={(e) => handleResizeStart(e, 'right')}
                />
                
                {/* Bottom resize handle */}
                <div
                  className="absolute bottom-0 left-1/2 w-8 h-2 bg-blue-500 cursor-s-resize z-20 rounded-t-lg transform -translate-x-1/2"
                  onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                />
              </>
            )}
          </>
        )}

        {/* Component Content */}
        <div className={`w-full h-full ${!isPreviewMode ? 'pt-8' : ''} overflow-hidden pointer-events-none`}>
          {renderComponent()}
        </div>
      </Card>
    </div>
  );
};
