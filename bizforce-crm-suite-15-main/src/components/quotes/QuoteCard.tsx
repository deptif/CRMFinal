
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Quote } from '@/types';

interface QuoteCardProps {
  quote: Quote;
  onView: (quote: Quote) => void;
  onEdit: (quote: Quote) => void;
  onSend: (quoteId: string) => void;
  onDownload: (quote: Quote) => void;
  onDelete: (quoteId: string) => void;
}

export const QuoteCard = ({ 
  quote, 
  onView, 
  onEdit, 
  onSend, 
  onDownload, 
  onDelete 
}: QuoteCardProps) => {
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

  const generatePDF = () => {
    // Criar conteúdo HTML para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Orçamento ${quote.quote_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
          .quote-number { font-size: 18px; margin: 10px 0; }
          .info-section { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .products-table th, .products-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .products-table th { background-color: #f5f5f5; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .status { padding: 5px 10px; border-radius: 5px; display: inline-block; }
          .status-draft { background-color: #f3f4f6; color: #374151; }
          .status-sent { background-color: #dbeafe; color: #1d4ed8; }
          .status-accepted { background-color: #dcfce7; color: #166534; }
          .status-rejected { background-color: #fee2e2; color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">BizForce CRM</div>
          <div class="quote-number">Orçamento ${quote.quote_number}</div>
          <div class="status status-${quote.status}">${getStatusLabel(quote.status)}</div>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <strong>Oportunidade:</strong>
            <span>${quote.opportunity_name}</span>
          </div>
          <div class="info-row">
            <strong>Responsável:</strong>
            <span>${quote.owner_name}</span>
          </div>
          <div class="info-row">
            <strong>Válido até:</strong>
            <span>${quote.valid_until?.toLocaleDateString('pt-PT') || 'N/A'}</span>
          </div>
          <div class="info-row">
            <strong>Data de criação:</strong>
            <span>${quote.created_at?.toLocaleDateString('pt-PT') || 'N/A'}</span>
          </div>
        </div>

        <table class="products-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Desconto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${quote.products?.map(product => `
              <tr>
                <td>${product.product_name}</td>
                <td>${product.quantity || 0}</td>
                <td>€${(product.unit_price || 0).toLocaleString()}</td>
                <td>€${(product.discount || 0).toLocaleString()}</td>
                <td>€${(product.total || 0).toLocaleString()}</td>
              </tr>
            `).join('') || '<tr><td colspan="5">Nenhum produto</td></tr>'}
          </tbody>
        </table>

        <div class="total">
          Total do Orçamento: €${(quote.total_amount || 0).toLocaleString()}
        </div>
      </body>
      </html>
    `;

    // Criar um novo blob com o conteúdo HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = url;
    link.download = `orcamento-${quote.quote_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar o URL do blob
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold">{quote.quote_number}</h3>
              <Badge className={getStatusColor(quote.status)}>
                {getStatusLabel(quote.status)}
              </Badge>
            </div>
            
            <p className="text-gray-600">
              <strong>Oportunidade:</strong> {quote.opportunity_name}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span><strong>Valor:</strong> €{(quote.total_amount || 0).toLocaleString()}</span>
              <span><strong>Válido até:</strong> {quote.valid_until?.toLocaleDateString('pt-PT') || 'N/A'}</span>
              <span><strong>Responsável:</strong> {quote.owner_name}</span>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Produtos:</p>
              <div className="space-y-1">
                {quote.products?.map((product) => (
                  <div key={product.id} className="text-sm text-gray-600 flex justify-between">
                    <span>{product.product_name} (x{product.quantity || 0})</span>
                    <span>€{(product.total || 0).toLocaleString()}</span>
                  </div>
                )) || <span className="text-sm text-gray-500">Nenhum produto</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(quote)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEdit(quote)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            {quote.status === 'draft' && (
              <Button 
                size="sm" 
                onClick={() => onSend(quote.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={generatePDF}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(quote.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
