
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Megaphone,
  Package,
  FileText,
  Map,
  Bot,
  Brain,
  Mail,
  GitBranch,
  Monitor,
  Headphones,
  Smartphone,
  Settings,
  UserCog,
  CheckCircle,
  Shield,
  Puzzle,
  MessageSquare,
  Route,
  Star,
  Wrench,
  Bell,
  FolderOpen,
  Palette,
  BarChart3,
  Zap,
  Workflow
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  section: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const menuConfig: MenuGroup[] = [
  {
    title: 'Visão Geral',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
      { name: 'Analytics', icon: BarChart3, section: 'analytics' },
      { name: 'Relatórios', icon: FileText, section: 'reports' },
    ]
  },
  {
    title: 'CRM Principal',
    items: [
      { name: 'Contas', icon: Building2, section: 'accounts' },
      { name: 'Contactos', icon: Users, section: 'contacts' },
      { name: 'Oportunidades', icon: Target, section: 'opportunities' },
      { name: 'Atividades', icon: Calendar, section: 'activities' },
    ]
  },
  {
    title: 'Vendas',
    items: [
      { name: 'Pipeline', icon: TrendingUp, section: 'sales' },
      { name: 'Previsões', icon: TrendingUp, section: 'forecasting' },
      { name: 'Territórios', icon: Map, section: 'territories' },
      { name: 'Produtos', icon: Package, section: 'products' },
      { name: 'Propostas', icon: FileText, section: 'quotes' },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Campanhas', icon: Megaphone, section: 'campaigns' },
      { name: 'Jornada Cliente', icon: Route, section: 'customer-journey' },
      { name: 'Multi-Canal', icon: MessageSquare, section: 'multi-channel' },
    ]
  },
  {
    title: 'Inteligência Artificial',
    items: [
      { name: 'Assistente IA', icon: Bot, section: 'ai-assistant' },
      { name: 'Lead Scoring', icon: Star, section: 'lead-scoring' },
      { name: 'Analytics IA', icon: Brain, section: 'ai-analytics' },
      { name: 'Email Intel.', icon: Mail, section: 'email-intelligence' },
    ]
  },
  {
    title: 'Automação & Workflows',
    items: [
      { name: 'Workflow Builder', icon: Workflow, section: 'workflows' },
      { name: 'Approval System', icon: CheckCircle, section: 'approval-system' },
    ]
  },
  {
    title: 'Colaboração',
    items: [
      { name: 'Chat Equipa', icon: MessageSquare, section: 'chat' },
      { name: 'Tarefas', icon: CheckCircle, section: 'tasks' },
      { name: 'Documentos', icon: FolderOpen, section: 'documents' },
      { name: 'Notificações', icon: Bell, section: 'notifications' },
      { name: 'Aprovações', icon: CheckCircle, section: 'approvals' },
    ]
  },
  {
    title: 'Ferramentas',
    items: [
      { name: 'Creator Dashboard', icon: Palette, section: 'dashboard-builder' },
      { name: 'Personalização', icon: Wrench, section: 'customization' },
      { name: 'Integrações', icon: Puzzle, section: 'integrations' },
      { name: 'Mobile', icon: Smartphone, section: 'mobile' },
    ]
  },
  {
    title: 'Administração',
    items: [
      { name: 'Utilizadores', icon: Users, section: 'users' },
      { name: 'Permissões', icon: UserCog, section: 'roles' },
      { name: 'Segurança', icon: Shield, section: 'field-security' },
      { name: 'Auditoria', icon: Shield, section: 'audit' },
      { name: 'Definições', icon: Settings, section: 'settings' },
    ]
  },
  {
    title: 'Gerenciamento de Aplicação',
    items: [
      { name: 'Aplicação', icon: Monitor, section: 'application-management' },
    ]
  },
  {
    title: 'Minhas Aplicações',
    items: []
  }
];
