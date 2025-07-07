
import { ComponentLayout } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';

interface TableRendererProps {
  component: ComponentLayout;
}

// Mock data for table
const mockTableData = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', department: 'Vendas', status: 'Ativo', revenue: 12500 },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', department: 'Marketing', status: 'Ativo', revenue: 8750 },
  { id: 3, name: 'Pedro Lima', email: 'pedro@email.com', department: 'Suporte', status: 'Inativo', revenue: 5200 },
  { id: 4, name: 'Ana Costa', email: 'ana@email.com', department: 'Vendas', status: 'Ativo', revenue: 15300 },
  { id: 5, name: 'Carlos Oliveira', email: 'carlos@email.com', department: 'TI', status: 'Ativo', revenue: 9800 },
];

export const TableRenderer = ({ component }: TableRendererProps) => {
  return (
    <Card className="w-full h-full">
      {component.title && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{component.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Search className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Filter className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={`${component.title ? 'pt-0' : 'pt-6'} h-full overflow-auto`}>
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              className="pl-8 h-8"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs font-medium">Nome</TableHead>
                <TableHead className="text-xs font-medium">Email</TableHead>
                <TableHead className="text-xs font-medium">Departamento</TableHead>
                <TableHead className="text-xs font-medium">Status</TableHead>
                <TableHead className="text-xs font-medium text-right">Receita</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTableData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="text-xs font-medium">{row.name}</TableCell>
                  <TableCell className="text-xs text-gray-600">{row.email}</TableCell>
                  <TableCell className="text-xs">{row.department}</TableCell>
                  <TableCell className="text-xs">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium">
                    {row.revenue.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">
            Mostrando 1-5 de 150 registros
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-6 text-xs">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-xs">
              Próximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
