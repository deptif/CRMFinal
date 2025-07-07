
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Quote, QuoteLineItem } from '@/types';
import { toast } from 'sonner';

interface QuoteEditModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuote: Quote) => void;
}

export const QuoteEditModal = ({ quote, isOpen, onClose, onSave }: QuoteEditModalProps) => {
  const [formData, setFormData] = useState<Partial<Quote>>({});
  const [products, setProducts] = useState<QuoteLineItem[]>([]);

  useEffect(() => {
    if (quote) {
      setFormData({
        opportunity_name: quote.opportunity_name,
        valid_until: quote.valid_until,
        total_amount: quote.total_amount
      });
      setProducts(quote.products || []);
    }
  }, [quote]);

  const addProduct = () => {
    const newProduct: QuoteLineItem = {
      id: `temp-${Date.now()}`,
      product_id: '',
      product_name: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      total: 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (index: number, field: keyof QuoteLineItem, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };

    // Recalcular total do produto
    if (field === 'quantity' || field === 'unit_price' || field === 'discount') {
      const product = updatedProducts[index];
      product.total = (product.quantity * product.unit_price) - product.discount;
    }

    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.total || 0), 0);
  };

  const handleSave = () => {
    if (!quote) return;

    const updatedQuote: Quote = {
      ...quote,
      ...formData,
      products,
      total_amount: calculateTotal()
    };

    onSave(updatedQuote);
    toast.success('Orçamento atualizado com sucesso!');
    onClose();
  };

  if (!quote) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Orçamento - {quote.quote_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opportunity">Oportunidade</Label>
              <Input
                id="opportunity"
                value={formData.opportunity_name || ''}
                onChange={(e) => setFormData({...formData, opportunity_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Válido até</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.valid_until?.toISOString().split('T')[0] || ''}
                onChange={(e) => setFormData({...formData, valid_until: new Date(e.target.value)})}
              />
            </div>
          </div>

          {/* Produtos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Produtos</h3>
              <Button onClick={addProduct} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {products.map((product, index) => (
              <Card key={product.id} className="p-4">
                <CardContent className="p-0">
                  <div className="grid grid-cols-6 gap-4 items-end">
                    <div className="col-span-2">
                      <Label htmlFor={`product-${index}`}>Nome do Produto</Label>
                      <Input
                        id={`product-${index}`}
                        value={product.product_name}
                        onChange={(e) => updateProduct(index, 'product_name', e.target.value)}
                        placeholder="Nome do produto"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${index}`}>Quantidade</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`price-${index}`}>Preço Unitário</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        value={product.unit_price}
                        onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`discount-${index}`}>Desconto</Label>
                      <Input
                        id={`discount-${index}`}
                        type="number"
                        value={product.discount}
                        onChange={(e) => updateProduct(index, 'discount', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">
                        €{(product.total || 0).toLocaleString()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total do Orçamento:</span>
              <span className="text-2xl font-bold text-blue-600">
                €{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
