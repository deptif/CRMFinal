
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';

interface TextRendererProps {
  component: ComponentLayout;
}

export const TextRenderer = ({ component }: TextRendererProps) => {
  const { type, config } = component;

  const renderText = () => {
    const baseText = component.title || getDefaultText(type);
    
    switch (type) {
      case 'heading':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 flex items-center h-full">
              <h2 className={`font-bold text-gray-900 ${getSizeClass(config.styling.size)}`}>
                {baseText}
              </h2>
            </CardContent>
          </Card>
        );

      case 'paragraph':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-4 flex items-start h-full">
              <p className={`text-gray-700 leading-relaxed ${getSizeClass(config.styling.size)}`}>
                {baseText}
              </p>
            </CardContent>
          </Card>
        );

      case 'label':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-2 flex items-center h-full">
              <span className={`font-medium text-gray-600 ${getSizeClass(config.styling.size)}`}>
                {baseText}
              </span>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Texto {type} não implementado
          </div>
        );
    }
  };

  return renderText();
};

function getDefaultText(type: string): string {
  switch (type) {
    case 'heading':
      return 'Título Principal';
    case 'paragraph':
      return 'Este é um parágrafo de exemplo que demonstra como o texto será exibido no dashboard. Você pode personalizar o conteúdo através do painel de propriedades.';
    case 'label':
      return 'Rótulo';
    default:
      return 'Texto';
  }
}

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
