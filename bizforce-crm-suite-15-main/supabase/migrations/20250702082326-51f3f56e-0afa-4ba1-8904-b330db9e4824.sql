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