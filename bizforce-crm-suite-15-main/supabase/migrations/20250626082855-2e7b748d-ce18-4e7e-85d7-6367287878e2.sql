
-- Primeiro, vamos garantir que a tabela de atividades tenha a estrutura correta
-- e adicionar políticas RLS para que os usuários possam ver apenas suas próprias atividades

-- Habilitar RLS na tabela activities se ainda não estiver habilitado
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para activities
CREATE POLICY "Users can view their own activities" 
  ON public.activities 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own activities" 
  ON public.activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own activities" 
  ON public.activities 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own activities" 
  ON public.activities 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Habilitar RLS na tabela opportunities se ainda não estiver habilitado
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para opportunities
CREATE POLICY "Users can view their own opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own opportunities" 
  ON public.opportunities 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own opportunities" 
  ON public.opportunities 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own opportunities" 
  ON public.opportunities 
  FOR DELETE 
  USING (auth.uid() = owner_id);
