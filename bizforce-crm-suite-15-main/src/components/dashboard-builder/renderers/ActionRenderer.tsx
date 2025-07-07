
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ActionRendererProps {
  component: ComponentLayout;
}

export const ActionRenderer = ({ component }: ActionRendererProps) => {
  const { type, config } = component;

  const handleClick = () => {
    console.log(`${type} clicked:`, component.title);
  };

  const renderAction = () => {
    switch (type) {
      case 'button':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-2 flex items-center justify-center h-full">
              <Button
                variant="default"
                size={config.styling?.size === 'sm' ? 'sm' : config.styling?.size === 'lg' ? 'lg' : 'default'}
                onClick={handleClick}
                className="w-full"
                disabled={!config.behavior?.clickable}
              >
                {component.title || 'Clique Aqui'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'link':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-2 flex items-center justify-center h-full">
              <button
                onClick={handleClick}
                className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 underline ${
                  !config.behavior?.clickable ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <span className={getSizeClass(config.styling?.size)}>
                  {component.title || 'Link de Exemplo'}
                </span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Ação {type} não implementada
          </div>
        );
    }
  };

  return renderAction();
};

function getSizeClass(size?: string): string {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-base';
  }
}
