
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Copy, Check, Edit3, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EmailResponseCardProps {
  generatedResponse: string;
  onEdit: (editedResponse: string) => void;
  onSend: () => Promise<void>;
}

export const EmailResponseCard = ({ generatedResponse, onEdit, onSend }: EmailResponseCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState(generatedResponse);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado para área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onEdit(editedResponse);
    setIsEditing(false);
    toast.success('Resposta editada com sucesso!');
  };

  const handleImprove = () => {
    // Simulação de melhoria por IA
    const improvedResponse = editedResponse + '\n\nP.S. Estamos disponíveis para esclarecer qualquer dúvida adicional.';
    setEditedResponse(improvedResponse);
    toast.success('Resposta melhorada pela IA!');
  };

  const handleSendClick = async () => {
    setIsSending(true);
    try {
      await onSend();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-2 border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Send className="h-5 w-5 mr-2 text-green-600" />
            Resposta Sugerida
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Optimizada
            </Badge>
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(editedResponse)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              className="min-h-[150px] border-2 border-blue-200 focus:border-blue-500"
              placeholder="Edite a resposta..."
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleImprove}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Melhorar com IA
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{editedResponse}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSendClick} 
                disabled={isSending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Resposta
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="border-gray-200 hover:bg-gray-50"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
