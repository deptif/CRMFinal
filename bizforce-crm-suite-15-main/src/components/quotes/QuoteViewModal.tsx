
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, User, Calendar, Euro } from 'lucide-react';
import { Quote } from '@/types';

interface QuoteViewModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteViewModal = ({ quote, isOpen, onClose }: QuoteViewModalProps) => {
  if (!quote) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviado';
      case 'accepted': return 'Aceito';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <FileText className="h-5 w-5" />
            <span>{quote.quote_number}</span>
            <Badge className={getStatusColor(quote.status)}>
              {getStatusLabel(quote.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações gerais */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Oportunidade</p>
                    <p className="font-medium">{quote.opportunity_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Responsável</p>
                    <p className="font-medium">{quote.owner_name}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Válido até</p>
                    <p className="font-medium">{quote.valid_until.toLocaleDateString('pt-PT')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="font-medium text-lg">€{quote.total_amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produtos */}
          <div className="space-y-3">
            <h3 className="font-medium">Produtos</h3>
            {quote.products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{product.product_name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Quantidade: {product.quantity}</p>
                        <p>Preço unitário: €{product.unit_price.toLocaleString()}</p>
                        {product.discount > 0 && (
                          <p>Desconto: €{product.discount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">€{product.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">Total do Orçamento</span>
                <span className="text-2xl font-bold text-blue-900">€{quote.total_amount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
