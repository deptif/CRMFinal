
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LayoutRendererProps {
  component: ComponentLayout;
}

export const LayoutRenderer = ({ component }: LayoutRendererProps) => {
  const { type } = component;

  const renderLayout = () => {
    switch (type) {
      case 'container':
        return (
          <Card className="w-full h-full border-dashed border-2 border-gray-300">
            <CardContent className="p-4 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-sm font-medium">
                  {component.title || 'Container'}
                </div>
                <div className="text-xs mt-1">
                  Arraste componentes aqui
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'spacer':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs text-gray-400 border border-dashed border-gray-300 w-full h-full flex items-center justify-center">
              Espaçador
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="w-full h-full flex items-center justify-center py-2">
            <Separator className="w-full" />
          </div>
        );

      case 'tabs':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 h-full">
              <Tabs defaultValue="tab1" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tab1" className="text-xs">Aba 1</TabsTrigger>
                  <TabsTrigger value="tab2" className="text-xs">Aba 2</TabsTrigger>
                  <TabsTrigger value="tab3" className="text-xs">Aba 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-4 h-full">
                  <div className="border border-dashed border-gray-300 rounded p-4 h-full flex items-center justify-center">
                    <span className="text-sm text-gray-500">Conteúdo da Aba 1</span>
                  </div>
                </TabsContent>
                <TabsContent value="tab2" className="mt-4 h-full">
                  <div className="border border-dashed border-gray-300 rounded p-4 h-full flex items-center justify-center">
                    <span className="text-sm text-gray-500">Conteúdo da Aba 2</span>
                  </div>
                </TabsContent>
                <TabsContent value="tab3" className="mt-4 h-full">
                  <div className="border border-dashed border-gray-300 rounded p-4 h-full flex items-center justify-center">
                    <span className="text-sm text-gray-500">Conteúdo da Aba 3</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Layout {type} não implementado
          </div>
        );
    }
  };

  return renderLayout();
};
