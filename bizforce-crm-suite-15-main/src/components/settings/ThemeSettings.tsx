
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeSelect = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
  };

  const handleSystemTheme = () => {
    localStorage.removeItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg mr-2">
            <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          Tema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Escolha o tema</Label>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="flex flex-col items-center p-3 h-auto space-y-1 text-xs"
              onClick={() => handleThemeSelect('light')}
            >
              <Sun className="h-4 w-4" />
              <span>Claro</span>
            </Button>
            
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="flex flex-col items-center p-3 h-auto space-y-1 text-xs"
              onClick={() => handleThemeSelect('dark')}
            >
              <Moon className="h-4 w-4" />
              <span>Escuro</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center p-3 h-auto space-y-1 text-xs"
              onClick={handleSystemTheme}
            >
              <Monitor className="h-4 w-4" />
              <span>Sistema</span>
            </Button>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Tema Atual</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              theme === 'light' ? 'bg-yellow-400' : 'bg-blue-600'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
