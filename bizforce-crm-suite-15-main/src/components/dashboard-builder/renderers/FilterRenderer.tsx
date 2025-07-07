
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface FilterRendererProps {
  component: ComponentLayout;
}

export const FilterRenderer = ({ component }: FilterRendererProps) => {
  const { type } = component;
  const [date, setDate] = useState<Date>();
  const [selectedValues, setSelectedValues] = useState<string[]>(['Vendas', 'Marketing']);
  const [searchValue, setSearchValue] = useState('');

  const renderFilter = () => {
    switch (type) {
      case 'date-picker':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-3 flex flex-col justify-center h-full">
              <Label className="text-xs font-medium mb-2">
                {component.title || 'Selecionar Data'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-8 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        );

      case 'dropdown':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-3 flex flex-col justify-center h-full">
              <Label className="text-xs font-medium mb-2">
                {component.title || 'Selecionar Opção'}
              </Label>
              <Select>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Escolha uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="ti">TI</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        );

      case 'multi-select':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-3 flex flex-col justify-center h-full">
              <Label className="text-xs font-medium mb-2">
                {component.title || 'Seleção Múltipla'}
              </Label>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Adicionar filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="ti">TI</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedValues.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-3 w-3 ml-1 hover:bg-transparent"
                          onClick={() => {
                            setSelectedValues(prev => prev.filter(v => v !== value));
                          }}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'search-box':
        return (
          <Card className="w-full h-full">
            <CardContent className="p-3 flex flex-col justify-center h-full">
              <Label className="text-xs font-medium mb-2">
                {component.title || 'Buscar'}
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Digite para buscar..."
                  className="pl-7 h-8 text-xs"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6 hover:bg-transparent"
                    onClick={() => setSearchValue('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Filtro {type} não implementado
          </div>
        );
    }
  };

  return renderFilter();
};
