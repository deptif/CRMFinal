
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Settings, Zap, Users, Brain } from 'lucide-react';
import { EmailJSConfigModal } from '../ai/EmailJSConfigModal';

export const EmailConfigSection = () => {
  const [showEmailJSConfig, setShowEmailJSConfig] = useState(false);

  const isEmailJSConfigured = () => {
    const emailJSConfig = localStorage.getItem('emailjs_config');
    return !!emailJSConfig;
  };

  const features = [
    {
      icon: Brain,
      title: 'Email Intelligence',
      description: 'Respostas automáticas geradas por IA'
    },
    {
      icon: Users,
      title: 'Gestão de Utilizadores',
      description: 'Convites automáticos para novos trabalhadores'
    },
    {
      icon: Mail,
      title: 'Notificações',
      description: 'Alertas e relatórios por email'
    }
  ];

  return (
    <>
      <Card className="border border-gray-200 hover:border-green-200 transition-colors">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg mr-2">
              <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            Sistema de Email
            {isEmailJSConfigured() && (
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Configure uma vez, use em todo o sistema
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              EmailJS ativa todas as funcionalidades de email automaticamente
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Configuration Button */}
          <div className="flex justify-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="text-center">
              <Button 
                onClick={() => setShowEmailJSConfig(true)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                {isEmailJSConfigured() ? 'Reconfigurar' : 'Configurar EmailJS'}
              </Button>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Gratuito até 200 emails/mês
              </p>
            </div>
          </div>

          {isEmailJSConfigured() && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Sistema Configurado!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Todas as funcionalidades de email estão ativas
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showEmailJSConfig && (
        <EmailJSConfigModal
          isOpen={showEmailJSConfig}
          onClose={() => setShowEmailJSConfig(false)}
        />
      )}
    </>
  );
};
