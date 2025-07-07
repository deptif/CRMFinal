
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseOpportunities } from '@/hooks/useSupabaseOpportunities';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';

interface QuoteLineItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

interface QuoteData {
  opportunity_id: string;
  opportunity_name: string;
  valid_until: string;
  line_items: QuoteLineItem[];
  total_amount: number;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: QuoteData) => void;
}

export const QuoteModal = ({ isOpen, onClose, onSave }: QuoteModalProps) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  
  const { opportunities, isLoading: opportunitiesLoading } = useSupabaseOpportunities();
  const { products, isLoading: productsLoading } = useSupabaseProducts();

  useEffect(() => {
    if (isOpen) {
      // Adicionar um item vazio inicial
      setLineItems([{
        product_id: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
        discount: 0,
        total: 0
      }]);
      
      // Definir data padrão (30 dias a partir de hoje)
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setValidUntil(defaultDate.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const addLineItem = () => {
    setLineItems([...lineItems, {
      product_id: '',
      product_name: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      total: 0
    }]);
  };

  const removeLineItem = (index: number) => {
    const newItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newItems);
  };

  const updateLineItem = (index: number, field: keyof QuoteLineItem, value: any) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Se o produto foi alterado, atualizar preço e nome
    if (field === 'product_id') {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        newItems[index].product_name = selectedProduct.name;
        newItems[index].unit_price = selectedProduct.price;
      }
    }
    
    // Recalcular total do item
    const item = newItems[index];
    const subtotal = item.quantity * item.unit_price;
    const discountAmount = (subtotal * item.discount) / 100;
    newItems[index].total = subtotal - discountAmount;
    
    setLineItems(newItems);
  };

  const calculateTotalAmount = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSave = () => {
    if (!selectedOpportunity) {
      toast.error('Por favor, selecione uma oportunidade');
      return;
    }

    if (!validUntil) {
      toast.error('Por favor, defina a data de validade');
      return;
    }

    const validItems = lineItems.filter(item => item.product_id && item.quantity > 0);
    
    if (validItems.length === 0) {
      toast.error('Por favor, adicione pelo menos um produto');
      return;
    }

    const selectedOpp = opportunities.find(opp => opp.id === selectedOpportunity);
    
    const quoteData: QuoteData = {
      opportunity_id: selectedOpportunity,
      opportunity_name: selectedOpp?.name || '',
      valid_until: validUntil,
      line_items: validItems,
      total_amount: calculateTotalAmount()
    };

    onSave(quoteData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedOpportunity('');
    setValidUntil('');
    setLineItems([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Novo Orçamento</span>
          </DialogTitle>
          <DialogDescription>
            Crie um novo orçamento para uma oportunidade existente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Oportunidade *</Label>
              <Select 
                value={selectedOpportunity} 
                onValueChange={setSelectedOpportunity}
                disabled={opportunitiesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={opportunitiesLoading ? "Carregando..." : "Selecione uma oportunidade..."} />
                </SelectTrigger>
                <SelectContent>
                  {opportunities.map((opp) => (
                    <SelectItem key={opp.id} value={opp.id}>
                      {opp.name} - {opp.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Válido até *</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Produtos</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Produto</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700">
                  <div className="col-span-3">Produto</div>
                  <div className="col-span-2">Quantidade</div>
                  <div className="col-span-2">Preço Unit.</div>
                  <div className="col-span-2">Desconto</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1"></div>
                </div>
                
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <Select
                        value={item.product_id}
                        onValueChange={(value) => updateLineItem(index, 'product_id', value)}
                        disabled={productsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar produto..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.active).map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4" />
                                <span>{product.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                        min="1"
                        placeholder="1"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(index, 'unit_price', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateLineItem(index, 'discount', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={`€${item.total.toFixed(2)}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      {lineItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total do Orçamento:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{calculateTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Criar Orçamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
