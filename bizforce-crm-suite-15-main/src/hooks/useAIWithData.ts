import { useOpenAI } from './useOpenAI';
import { useAppData } from './useAppData';

export const useAIWithData = () => {
  const { generateText, isLoading: aiLoading } = useOpenAI();
  const { 
    searchAccounts, 
    searchContacts, 
    searchOpportunities, 
    searchActivities,
    getAccountById,
    getContactById,
    getOpportunityById,
    getRecentActivities,
    getTopOpportunities,
    getSalesMetrics,
    isLoading: dataLoading 
  } = useAppData();

  const processQuery = async (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Ajuda sobre funcionalidades do sistema
    if (lowerQuery.includes('como') || lowerQuery.includes('help') || lowerQuery.includes('ajuda')) {
      return await handleHelpQuery(query);
    }
    
    // Navegação e funcionalidades
    if (lowerQuery.includes('navegar') || lowerQuery.includes('ir para') || lowerQuery.includes('abrir')) {
      return handleNavigationQuery(query);
    }
    
    // Estatísticas e dashboards
    if (lowerQuery.includes('dashboard') || lowerQuery.includes('estatísticas') || lowerQuery.includes('resumo')) {
      return await handleDashboardQuery(query);
    }
    
    // Relatórios
    if (lowerQuery.includes('relatório') || lowerQuery.includes('report') || lowerQuery.includes('análise')) {
      return await handleReportsQuery(query);
    }
    
    // Configurações
    if (lowerQuery.includes('configurar') || lowerQuery.includes('settings') || lowerQuery.includes('definições')) {
      return handleSettingsQuery(query);
    }
    
    // Pesquisa específica de dados
    if (lowerQuery.includes('client') || lowerQuery.includes('account') || lowerQuery.includes('company') || lowerQuery.includes('empresa')) {
      const searchTerm = extractSearchTerm(query, ['client', 'account', 'company', 'empresa']);
      if (searchTerm) {
        const accounts = await searchAccounts(searchTerm);
        return formatAccountsResponse(accounts, query);
      }
    }
    
    if (lowerQuery.includes('contact') || lowerQuery.includes('person') || lowerQuery.includes('contato') || lowerQuery.includes('pessoa')) {
      const searchTerm = extractSearchTerm(query, ['contact', 'person', 'contato', 'pessoa']);
      if (searchTerm) {
        const contacts = await searchContacts(searchTerm);
        return formatContactsResponse(contacts, query);
      }
    }
    
    if (lowerQuery.includes('opportunity') || lowerQuery.includes('deal') || lowerQuery.includes('proposal') || 
        lowerQuery.includes('oportunidade') || lowerQuery.includes('negócio') || lowerQuery.includes('proposta')) {
      const searchTerm = extractSearchTerm(query, ['opportunity', 'deal', 'proposal', 'oportunidade', 'negócio', 'proposta']);
      if (searchTerm) {
        const opportunities = await searchOpportunities(searchTerm);
        return formatOpportunitiesResponse(opportunities, query);
      }
    }
    
    if (lowerQuery.includes('activity') || lowerQuery.includes('task') || lowerQuery.includes('meeting') ||
        lowerQuery.includes('atividade') || lowerQuery.includes('tarefa') || lowerQuery.includes('reunião')) {
      const searchTerm = extractSearchTerm(query, ['activity', 'task', 'meeting', 'atividade', 'tarefa', 'reunião']);
      if (searchTerm) {
        const activities = await searchActivities(searchTerm);
        return formatActivitiesResponse(activities, query);
      }
    }
    
    if (lowerQuery.includes('sales') || lowerQuery.includes('metrics') || lowerQuery.includes('performance') ||
        lowerQuery.includes('vendas') || lowerQuery.includes('métricas') || lowerQuery.includes('desempenho')) {
      const metrics = await getSalesMetrics();
      return formatMetricsResponse(metrics, query);
    }
    
    if (lowerQuery.includes('recent') || lowerQuery.includes('last') || lowerQuery.includes('recente') || lowerQuery.includes('último')) {
      const activities = await getRecentActivities(5);
      return formatRecentActivitiesResponse(activities, query);
    }
    
    if (lowerQuery.includes('top') || lowerQuery.includes('highest') || lowerQuery.includes('best') ||
        lowerQuery.includes('principais') || lowerQuery.includes('melhores')) {
      const opportunities = await getTopOpportunities(5);
      return formatTopOpportunitiesResponse(opportunities, query);
    }
    
    // Se não é uma consulta específica de dados, usar IA normal com contexto do sistema
    const systemContext = `Você é um assistente especializado no sistema CRM BizForce. 
    O sistema inclui as seguintes funcionalidades:
    - Gestão de Clientes (Accounts)
    - Gestão de Contatos
    - Gestão de Oportunidades
    - Atividades e Tarefas
    - Produtos e Serviços
    - Relatórios e Analytics
    - Chat da Equipa
    - Configurações e Administração
    
    Ajude o utilizador com informações sobre como usar essas funcionalidades.`;
    
    return await generateText(query, systemContext);
  };

  const handleHelpQuery = async (query: string) => {
    const helpTopics = {
      'clientes': 'Para gerir clientes, vá para a secção "Clientes" onde pode adicionar, editar e visualizar informações das empresas.',
      'contatos': 'Na secção "Contatos" pode gerir todas as pessoas relacionadas com os seus clientes.',
      'oportunidades': 'As oportunidades de vendas são geridas na secção "Oportunidades" onde pode acompanhar o pipeline de vendas.',
      'atividades': 'Na secção "Atividades" pode agendar chamadas, reuniões e outras tarefas.',
      'produtos': 'O catálogo de produtos está disponível na secção "Produtos".',
      'relatórios': 'Acesse relatórios detalhados na secção "Relatórios".',
      'chat': 'Use o Chat da Equipa para comunicar com colegas em tempo real.',
      'configurações': 'Personalize o sistema nas "Configurações".'
    };

    const lowerQuery = query.toLowerCase();
    for (const [topic, description] of Object.entries(helpTopics)) {
      if (lowerQuery.includes(topic)) {
        return `ℹ️ **Ajuda - ${topic.charAt(0).toUpperCase() + topic.slice(1)}**\n\n${description}\n\nPrecisa de mais detalhes sobre alguma funcionalidade específica?`;
      }
    }

    return `🔍 **Como posso ajudar?**\n\nEstou aqui para ajudar com o sistema BizForce. Posso ajudar com:\n\n• **Pesquisar dados** - "buscar cliente X", "mostrar oportunidades"\n• **Navegação** - "como ir para relatórios", "abrir configurações"\n• **Funcionalidades** - "como criar cliente", "como agendar reunião"\n• **Métricas** - "mostrar vendas", "performance da equipa"\n\nO que gostaria de saber?`;
  };

  const handleNavigationQuery = (query: string) => {
    const navigationMap = {
      'dashboard': 'Para ir ao Dashboard, clique no ícone de casa na barra lateral.',
      'clientes': 'Para ver Clientes, clique em "Clientes" na barra lateral.',
      'contatos': 'Para ver Contatos, clique em "Contatos" na barra lateral.',
      'oportunidades': 'Para ver Oportunidades, clique em "Oportunidades" na barra lateral.',
      'atividades': 'Para ver Atividades, clique em "Atividades" na barra lateral.',
      'produtos': 'Para ver Produtos, clique em "Produtos" na barra lateral.',
      'relatórios': 'Para ver Relatórios, clique em "Relatórios" na barra lateral.',
      'chat': 'Para abrir o Chat, clique em "Chat" na barra lateral.',
      'configurações': 'Para abrir Configurações, clique no ícone de engrenagem.'
    };

    const lowerQuery = query.toLowerCase();
    for (const [section, instruction] of Object.entries(navigationMap)) {
      if (lowerQuery.includes(section)) {
        return `🧭 **Navegação**\n\n${instruction}`;
      }
    }

    return `🧭 **Navegação no Sistema**\n\nUse a barra lateral esquerda para navegar entre as secções:\n• Dashboard\n• Clientes\n• Contatos\n• Oportunidades\n• Atividades\n• Produtos\n• Relatórios\n• Chat\n• Configurações\n\nOnde gostaria de ir?`;
  };

  const handleDashboardQuery = async (query: string) => {
    const metrics = await getSalesMetrics();
    return `📊 **Resumo do Dashboard**\n\n` +
           `• **Total de Oportunidades:** ${metrics.totalOpportunities}\n` +
           `• **Negócios Ganhos:** ${metrics.wonDeals}\n` +
           `• **Receita Total:** €${metrics.totalRevenue.toLocaleString()}\n` +
           `• **Ticket Médio:** €${Math.round(metrics.averageDealSize).toLocaleString()}\n` +
           `• **Taxa de Conversão:** ${metrics.winRate}%\n\n` +
           `Para ver métricas detalhadas, vá para a secção Relatórios.`;
  };

  const handleReportsQuery = async (query: string) => {
    return `📈 **Relatórios Disponíveis**\n\n` +
           `• **Relatório de Vendas** - Performance da equipa\n` +
           `• **Pipeline de Oportunidades** - Estado das oportunidades\n` +
           `• **Atividades por Utilizador** - Produtividade individual\n` +
           `• **ROI de Campanhas** - Retorno dos investimentos\n` +
           `• **Previsão de Vendas** - Projeções futuras\n\n` +
           `Para aceder aos relatórios, vá para a secção "Relatórios" na barra lateral.`;
  };

  const handleSettingsQuery = (query: string) => {
    return `⚙️ **Configurações do Sistema**\n\n` +
           `• **Perfil do Utilizador** - Alterar dados pessoais\n` +
           `• **Notificações** - Gerir alertas e notificações\n` +
           `• **Integração com APIs** - Conectar serviços externos\n` +
           `• **Gestão de Equipas** - Adicionar/remover utilizadores\n` +
           `• **Personalização** - Campos e layouts customizados\n\n` +
           `Para aceder às configurações, clique no ícone de engrenagem na barra lateral.`;
  };

  const extractSearchTerm = (query: string, keywords: string[]): string | null => {
    const lowerQuery = query.toLowerCase();
    for (const keyword of keywords) {
      const index = lowerQuery.indexOf(keyword);
      if (index !== -1) {
        const afterKeyword = query.substring(index + keyword.length).trim();
        const words = afterKeyword.split(' ').filter(word => word.length > 2);
        return words.length > 0 ? words[0] : null;
      }
    }
    return null;
  };

  const formatAccountsResponse = (accounts: any[], query: string) => {
    if (accounts.length === 0) {
      return `Não foram encontrados clientes relacionados com "${query}".`;
    }
    
    let response = `Encontrados ${accounts.length} cliente(s):\n\n`;
    accounts.forEach(account => {
      response += `🏢 **${account.name}**\n`;
      response += `   Setor: ${account.industry}\n`;
      response += `   Email: ${account.email}\n`;
      response += `   Responsável: ${account.owner_name}\n`;
      if (account.annual_revenue) {
        response += `   Receita Anual: €${account.annual_revenue.toLocaleString()}\n`;
      }
      response += `\n`;
    });
    
    return response;
  };

  const formatContactsResponse = (contacts: any[], query: string) => {
    if (contacts.length === 0) {
      return `Não foram encontrados contatos relacionados com "${query}".`;
    }
    
    let response = `Encontrados ${contacts.length} contato(s):\n\n`;
    contacts.forEach(contact => {
      response += `👤 **${contact.first_name} ${contact.last_name}**\n`;
      response += `   Cargo: ${contact.title}\n`;
      response += `   Empresa: ${contact.account_name}\n`;
      response += `   Email: ${contact.email}\n`;
      response += `   Telefone: ${contact.phone}\n`;
      response += `   Responsável: ${contact.owner_name}\n`;
      response += `\n`;
    });
    
    return response;
  };

  const formatOpportunitiesResponse = (opportunities: any[], query: string) => {
    if (opportunities.length === 0) {
      return `Não foram encontradas oportunidades relacionadas com "${query}".`;
    }
    
    let response = `Encontradas ${opportunities.length} oportunidade(s):\n\n`;
    opportunities.forEach(opp => {
      response += `🎯 **${opp.name}**\n`;
      response += `   Valor: €${opp.amount.toLocaleString()}\n`;
      response += `   Fase: ${opp.stage}\n`;
      response += `   Probabilidade: ${opp.probability}%\n`;
      response += `   Cliente: ${opp.account_name}\n`;
      response += `   Responsável: ${opp.owner_name}\n`;
      response += `   Data de Fecho: ${new Date(opp.close_date).toLocaleDateString('pt-PT')}\n`;
      response += `\n`;
    });
    
    return response;
  };

  const formatActivitiesResponse = (activities: any[], query: string) => {
    if (activities.length === 0) {
      return `Não foram encontradas atividades relacionadas com "${query}".`;
    }
    
    let response = `Encontradas ${activities.length} atividade(s):\n\n`;
    activities.forEach(activity => {
      const icon = activity.type === 'call' ? '📞' : activity.type === 'email' ? '📧' : activity.type === 'meeting' ? '🤝' : '📝';
      response += `${icon} **${activity.title}**\n`;
      response += `   Tipo: ${activity.type}\n`;
      response += `   Estado: ${activity.status}\n`;
      response += `   Relacionado: ${activity.related_name}\n`;
      response += `   Responsável: ${activity.owner_name}\n`;
      response += `   Data: ${new Date(activity.due_date).toLocaleDateString('pt-PT')}\n`;
      response += `\n`;
    });
    
    return response;
  };

  const formatMetricsResponse = (metrics: any, query: string) => {
    return `📈 **Métricas Atuais de Vendas:**\n\n` +
           `• Total de Oportunidades: ${metrics.totalOpportunities}\n` +
           `• Negócios Ganhos: ${metrics.wonDeals}\n` +
           `• Receita Total: €${metrics.totalRevenue.toLocaleString()}\n` +
           `• Ticket Médio: €${Math.round(metrics.averageDealSize).toLocaleString()}\n` +
           `• Taxa de Conversão: ${metrics.winRate}%\n`;
  };

  const formatRecentActivitiesResponse = (activities: any[], query: string) => {
    let response = `🕒 **Atividades Recentes:**\n\n`;
    activities.forEach(activity => {
      const icon = activity.type === 'call' ? '📞' : activity.type === 'email' ? '📧' : activity.type === 'meeting' ? '🤝' : '📝';
      response += `${icon} ${activity.title} - ${activity.related_name}\n`;
      response += `   ${new Date(activity.created_at).toLocaleDateString('pt-PT')}\n\n`;
    });
    return response;
  };

  const formatTopOpportunitiesResponse = (opportunities: any[], query: string) => {
    let response = `🏆 **Principais Oportunidades:**\n\n`;
    opportunities.forEach((opp, index) => {
      response += `${index + 1}. ${opp.name} - €${opp.amount.toLocaleString()}\n`;
      response += `   Cliente: ${opp.account_name} | Fase: ${opp.stage}\n\n`;
    });
    return response;
  };

  return {
    processQuery,
    isLoading: aiLoading || dataLoading
  };
};
