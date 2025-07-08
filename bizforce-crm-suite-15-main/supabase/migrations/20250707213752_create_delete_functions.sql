-- Criar funções RPC para garantir exclusão permanente de registros
-- Esta migração adiciona funções que serão chamadas pelo frontend para garantir
-- que os registros sejam completamente removidos do banco de dados

-- Função para excluir uma conta
CREATE OR REPLACE FUNCTION delete_account(account_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se existem contatos relacionados
  IF EXISTS (SELECT 1 FROM contacts WHERE account_id = $1) THEN
    RETURN FALSE;
  END IF;
  
  -- Excluir a conta
  DELETE FROM accounts WHERE id = $1;
  
  -- Retornar sucesso
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Função para excluir um contato
CREATE OR REPLACE FUNCTION delete_contact(contact_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Excluir o contato
  DELETE FROM contacts WHERE id = $1;
  
  -- Retornar sucesso
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Função para excluir uma oportunidade
CREATE OR REPLACE FUNCTION delete_opportunity(opportunity_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Excluir a oportunidade
  DELETE FROM opportunities WHERE id = $1;
  
  -- Retornar sucesso
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Função para excluir um usuário
CREATE OR REPLACE FUNCTION delete_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário é proprietário de registros
  IF EXISTS (
    SELECT 1 FROM accounts WHERE owner_id = $1
    UNION ALL
    SELECT 1 FROM contacts WHERE owner_id = $1
    UNION ALL
    SELECT 1 FROM opportunities WHERE owner_id = $1
    UNION ALL
    SELECT 1 FROM activities WHERE owner_id = $1
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Excluir o usuário
  DELETE FROM profiles WHERE id = $1;
  
  -- Retornar sucesso
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Garantir que as políticas de exclusão estejam ativas
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir exclusão para proprietários" ON accounts;
DROP POLICY IF EXISTS "Permitir exclusão para proprietários" ON contacts;
DROP POLICY IF EXISTS "Permitir exclusão para proprietários" ON opportunities;
DROP POLICY IF EXISTS "Permitir exclusão para proprietários" ON profiles;

-- Adicionar políticas de segurança para permitir exclusão
CREATE POLICY "Permitir exclusão para proprietários" ON accounts
  FOR DELETE
  USING (auth.uid() = owner_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Permitir exclusão para proprietários" ON contacts
  FOR DELETE
  USING (auth.uid() = owner_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Permitir exclusão para proprietários" ON opportunities
  FOR DELETE
  USING (auth.uid() = owner_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Permitir exclusão para proprietários" ON profiles
  FOR DELETE
  USING (auth.uid() = id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Adicionar políticas para inserção e atualização também
CREATE POLICY "Permitir inserção para todos" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para proprietários" ON accounts FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Permitir seleção para todos" ON accounts FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para todos" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para proprietários" ON contacts FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Permitir seleção para todos" ON contacts FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para todos" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para proprietários" ON opportunities FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Permitir seleção para todos" ON opportunities FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para todos" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para proprietários" ON profiles FOR UPDATE USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Permitir seleção para todos" ON profiles FOR SELECT USING (true); 