
-- Criar tabela para customer_journey_stages
CREATE TABLE public.customer_journey_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  contact_id UUID,
  completed_at TIMESTAMP WITH TIME ZONE,
  owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para multi_channel_campaigns
CREATE TABLE public.multi_channel_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  channels TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  leads_generated INTEGER DEFAULT 0,
  responses INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  budget NUMERIC DEFAULT 0,
  start_date DATE,
  end_date DATE,
  owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS às novas tabelas
ALTER TABLE public.customer_journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multi_channel_campaigns ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para customer_journey_stages
CREATE POLICY "Users can view customer journey stages" ON public.customer_journey_stages
FOR SELECT USING (auth.uid() = owner_id OR owner_id IS NULL);

CREATE POLICY "Users can create customer journey stages" ON public.customer_journey_stages
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update customer journey stages" ON public.customer_journey_stages
FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete customer journey stages" ON public.customer_journey_stages
FOR DELETE USING (auth.uid() = owner_id);

-- Políticas RLS para multi_channel_campaigns
CREATE POLICY "Users can view multi channel campaigns" ON public.multi_channel_campaigns
FOR SELECT USING (auth.uid() = owner_id OR owner_id IS NULL);

CREATE POLICY "Users can create multi channel campaigns" ON public.multi_channel_campaigns
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update multi channel campaigns" ON public.multi_channel_campaigns
FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete multi channel campaigns" ON public.multi_channel_campaigns
FOR DELETE USING (auth.uid() = owner_id);
