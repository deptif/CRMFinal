
export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: string;
  created_at: Date;
  plan?: 'free' | 'professional' | 'enterprise';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  company_id?: string;
  company?: Company;
  status: 'active' | 'pending' | 'suspended';
  avatar?: string;
  created_at: Date;
  last_login?: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  company: Company | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerCompany: (companyData: Omit<Company, 'id' | 'created_at'>, adminData: { name: string; email: string; password: string }) => Promise<void>;
}
