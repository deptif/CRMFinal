
-- Primeiro, vamos configurar as políticas RLS para todas as tabelas

-- RLS policies para accounts
CREATE POLICY "Users can view their own accounts" 
  ON public.accounts 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own accounts" 
  ON public.accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own accounts" 
  ON public.accounts 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own accounts" 
  ON public.accounts 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- RLS policies para contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own contacts" 
  ON public.contacts 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own contacts" 
  ON public.contacts 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Ensure RLS is enabled on all relevant tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
