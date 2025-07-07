
import { ComponentLayout, DataSource } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Database, Palette, Zap } from 'lucide-react';

interface PropertyPanelProps {
  selectedComponent: ComponentLayout | null;
  dataSources: DataSource[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onComponentUpdate: (updates: Partial<ComponentLayout>) => void;
}

export const PropertyPanel = ({
  selectedComponent,
  dataSources,
  isCollapsed,
  onToggleCollapse,
  onComponentUpdate,
}: PropertyPanelProps) => {
  if (isCollapsed) {
    return (
      <Card className="w-12 h-full">
        <CardContent className="p-2 flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!selectedComponent) {
    return (
      <Card className="w-80 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Propriedades</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-8 h-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Selecione um componente para ver suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const updateComponent = (updates: Partial<ComponentLayout>) => {
    onComponentUpdate(updates);
  };

  const updateConfig = (configUpdates: any) => {
    updateComponent({
      config: {
        ...selectedComponent.config,
        ...configUpdates,
      },
    });
  };

  const updateDataConfig = (dataConfigUpdates: any) => {
    updateConfig({
      dataConfig: {
        ...selectedComponent.config.dataConfig,
        ...dataConfigUpdates,
      },
    });
  };

  const updateStyling = (stylingUpdates: any) => {
    updateConfig({
      styling: {
        ...selectedComponent.config.styling,
        ...stylingUpdates,
      },
    });
  };

  const updateBehavior = (behaviorUpdates: any) => {
    updateConfig({
      behavior: {
        ...selectedComponent.config.behavior,
        ...behaviorUpdates,
      },
    });
  };

  const selectedDataSource = dataSources.find(ds => ds.id === selectedComponent.dataSource);

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Propriedades</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedComponent.type}</Badge>
          <span className="text-sm text-gray-500">
            {selectedComponent.position.w}x{selectedComponent.position.h}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-4 pb-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general" className="text-xs">
                  <Settings className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs">
                  <Database className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="style" className="text-xs">
                  <Palette className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="behavior" className="text-xs">
                  <Zap className="h-3 w-3" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={selectedComponent.title || ''}
                    onChange={(e) => updateComponent({ title: e.target.value })}
                    placeholder="Nome do componente"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Posição</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">X</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.x}
                        onChange={(e) => updateComponent({
                          position: {
                            ...selectedComponent.position,
                            x: parseInt(e.target.value) || 0,
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Y</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.y}
                        onChange={(e) => updateComponent({
                          position: {
                            ...selectedComponent.position,
                            y: parseInt(e.target.value) || 0,
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">Largura</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.w}
                        onChange={(e) => updateComponent({
                          position: {
                            ...selectedComponent.position,
                            w: parseInt(e.target.value) || 1,
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Altura</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.h}
                        onChange={(e) => updateComponent({
                          position: {
                            ...selectedComponent.position,
                            h: parseInt(e.target.value) || 1,
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="visible">Visível</Label>
                  <Switch
                    id="visible"
                    checked={selectedComponent.visible}
                    onCheckedChange={(checked) => updateComponent({ visible: checked })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Fonte de Dados</Label>
                  <Select
                    value={selectedComponent.dataSource}
                    onValueChange={(value) => updateComponent({ dataSource: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDataSource && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Campos Disponíveis</Label>
                      {selectedDataSource.fields.map(field => (
                        <div key={field.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="text-sm font-medium">{field.label}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {field.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />
                    
                    {/* Component-specific data configuration */}
                    {['line-chart', 'bar-chart', 'area-chart'].includes(selectedComponent.type) && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Eixo X</Label>
                          <Select
                            value={selectedComponent.config.dataConfig.xAxis || ''}
                            onValueChange={(value) => updateDataConfig({ xAxis: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione campo" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedDataSource.fields.map(field => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Eixo Y</Label>
                          <Select
                            value={selectedComponent.config.dataConfig.yAxis || ''}
                            onValueChange={(value) => updateDataConfig({ yAxis: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione campo" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedDataSource.fields.filter(f => f.type === 'number').map(field => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {['pie-chart', 'donut-chart'].includes(selectedComponent.type) && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Campo de Valor</Label>
                          <Select
                            value={selectedComponent.config.dataConfig.value || ''}
                            onValueChange={(value) => updateDataConfig({ value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione campo" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedDataSource.fields.filter(f => f.type === 'number').map(field => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Agrupar Por</Label>
                          <Select
                            value={selectedComponent.config.dataConfig.groupBy || ''}
                            onValueChange={(value) => updateDataConfig({ groupBy: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione campo" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedDataSource.fields.filter(f => f.type === 'string').map(field => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <Select
                    value={selectedComponent.config.styling.size || 'md'}
                    onValueChange={(value) => updateStyling({ size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Pequeno</SelectItem>
                      <SelectItem value="md">Médio</SelectItem>
                      <SelectItem value="lg">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Mostrar Legenda</Label>
                  <Switch
                    checked={selectedComponent.config.styling.showLegend}
                    onCheckedChange={(checked) => updateStyling({ showLegend: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Mostrar Grade</Label>
                  <Switch
                    checked={selectedComponent.config.styling.showGrid}
                    onCheckedChange={(checked) => updateStyling({ showGrid: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Mostrar Rótulos</Label>
                  <Switch
                    checked={selectedComponent.config.styling.showLabels}
                    onCheckedChange={(checked) => updateStyling({ showLabels: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Cores do Tema</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedComponent.config.styling.colors?.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          // Here you could open a color picker
                        }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Clicável</Label>
                  <Switch
                    checked={selectedComponent.config.behavior.clickable}
                    onCheckedChange={(checked) => updateBehavior({ clickable: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Hover</Label>
                  <Switch
                    checked={selectedComponent.config.behavior.hoverable}
                    onCheckedChange={(checked) => updateBehavior({ hoverable: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Filtrável</Label>
                  <Switch
                    checked={selectedComponent.config.behavior.filterable}
                    onCheckedChange={(checked) => updateBehavior({ filterable: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Drill Down</Label>
                  <Switch
                    checked={selectedComponent.config.behavior.drillDown}
                    onCheckedChange={(checked) => updateBehavior({ drillDown: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Cross Filter</Label>
                  <Switch
                    checked={selectedComponent.config.behavior.crossFilter}
                    onCheckedChange={(checked) => updateBehavior({ crossFilter: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Animação</Label>
                  <Switch
                    checked={selectedComponent.config.behavior.animation}
                    onCheckedChange={(checked) => updateBehavior({ animation: checked })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
