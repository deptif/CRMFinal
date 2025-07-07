
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Package, Euro, Tag, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'created_at'>) => void;
  product?: Product | null;
}

export const ProductModal = ({ isOpen, onClose, onSave, product }: ProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    price: '',
    cost: '',
    description: '',
    active: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        sku: product.sku,
        price: product.price.toString(),
        cost: product.cost.toString(),
        description: product.description,
        active: product.active
      });
    } else {
      setFormData({
        name: '',
        category: '',
        sku: '',
        price: '',
        cost: '',
        description: '',
        active: true
      });
    }
  }, [product, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Por favor, insira o nome do produto');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Por favor, insira a categoria');
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      toast.error('Por favor, insira um preço válido');
      return;
    }

    if (!formData.cost || Number(formData.cost) < 0) {
      toast.error('Por favor, insira um custo válido');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      sku: formData.sku.trim(),
      price: Number(formData.price),
      cost: Number(formData.cost),
      description: formData.description.trim(),
      active: formData.active
    };

    onSave(productData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      sku: '',
      price: '',
      cost: '',
      description: '',
      active: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span>{product ? 'Editar Produto' : 'Novo Produto'}</span>
          </DialogTitle>
          <DialogDescription>
            {product ? 'Edite as informações do produto.' : 'Adicione um novo produto ao catálogo.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Software CRM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Software"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ex: CRM-001"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (€) *</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Custo (€) *</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0.00"
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do produto..."
                className="pl-10"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Produto ativo</Label>
          </div>

          {formData.price && formData.cost && Number(formData.price) > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border">
              <p className="text-sm text-green-700">
                <span className="font-medium">Margem de lucro: </span>
                {(((Number(formData.price) - Number(formData.cost)) / Number(formData.price)) * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Package className="h-4 w-4 mr-2" />
            {product ? 'Atualizar' : 'Criar'} Produto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
