-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image TEXT,
  url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications
CREATE POLICY "Users can manage their applications"
ON public.applications
FOR ALL
USING (auth.uid() = owner_id);

CREATE POLICY "Users can view all applications"
ON public.applications
FOR SELECT
USING (true);




