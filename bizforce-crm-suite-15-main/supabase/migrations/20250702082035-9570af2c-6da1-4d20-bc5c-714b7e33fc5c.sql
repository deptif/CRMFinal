-- Create sales_quotas table for storing sales quotas
CREATE TABLE IF NOT EXISTS public.sales_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  period TEXT NOT NULL,
  year INTEGER NOT NULL,
  quarter INTEGER,
  quota_amount NUMERIC NOT NULL DEFAULT 0,
  achieved_amount NUMERIC NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_quotas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their quotas" 
ON public.sales_quotas 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view all quotas" 
ON public.sales_quotas 
FOR SELECT 
USING (true);

-- Create tasks table for kanban board
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assignee UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_name TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  labels TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can manage their tasks" 
ON public.tasks 
FOR ALL 
USING (auth.uid() = owner_id OR auth.uid() = assignee);

CREATE POLICY "Users can view all tasks" 
ON public.tasks 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();