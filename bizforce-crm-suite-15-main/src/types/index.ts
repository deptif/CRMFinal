export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales_rep';
  avatar?: string;
  created_at: Date;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  annual_revenue?: number;
  employees?: number;
  tags: string[];
  owner_id: string;
  owner_name: string;
  created_at: Date;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  account_id: string;
  account_name: string;
  owner_id: string;
  owner_name: string;
  tags: string[];
  created_at: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  account_id: string;
  account_name: string;
  contact_id: string;
  contact_name: string;
  amount: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  close_date: Date;
  owner_id: string;
  owner_name: string;
  description: string;
  created_at: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  status: 'pending' | 'completed' | 'cancelled';
  due_date: Date;
  related_to: 'account' | 'contact' | 'opportunity';
  related_id: string;
  related_name: string;
  owner_id: string;
  owner_name: string;
  created_at: Date;
}

// Novos tipos para funcionalidades avançadas
export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'webinar' | 'event' | 'direct_mail';
  status: 'planning' | 'active' | 'paused' | 'completed';
  budget: number;
  start_date: Date;
  end_date: Date;
  leads_generated: number;
  conversion_rate: number;
  roi: number;
  owner_id: string;
  owner_name: string;
  created_at: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  description: string;
  sku: string;
  active: boolean;
  created_at: Date;
}

export interface Quote {
  id: string;
  opportunity_id: string;
  opportunity_name: string;
  quote_number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  total_amount: number;
  valid_until: Date;
  products: QuoteLineItem[];
  owner_id: string;
  owner_name: string;
  created_at: Date;
}

export interface QuoteLineItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

export interface Case {
  id: string;
  case_number: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'waiting' | 'closed';
  type: 'bug' | 'feature' | 'question' | 'complaint';
  contact_id: string;
  contact_name: string;
  account_id: string;
  account_name: string;
  owner_id: string;
  owner_name: string;
  created_at: Date;
}

export interface SalesQuota {
  id: string;
  user_id: string;
  user_name: string;
  period: string;
  quota_amount: number;
  achieved_amount: number;
  percentage: number;
  year: number;
  quarter: number;
}

export interface Territory {
  id: string;
  name: string;
  description: string;
  region: string;
  manager_id: string;
  manager_name: string;
  members: string[];
  target_revenue: number;
  actual_revenue: number;
  created_at: Date;
}

export interface Application {
  id: string;
  name: string;
  api_name: string;
  description?: string;
  icon?: string;
  image?: string;
  url?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
  settings?: Record<string, unknown>;
  objects?: Record<string, unknown>;
  theme_color?: string;
  default_view?: string;
  is_active?: boolean;
}
