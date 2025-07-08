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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  settings JSONB DEFAULT '{}',
  objects JSONB DEFAULT '{}',
  theme_color TEXT DEFAULT '#3b82f6',
  default_view TEXT DEFAULT 'dashboard',
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications
CREATE POLICY "Users can view all applications"
ON public.applications
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own applications"
ON public.applications
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own applications"
ON public.applications
FOR DELETE
USING (auth.uid() = owner_id);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar TEXT,
  company TEXT,
  department TEXT,
  position TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create trigger to automatically create a profile when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert profile for existing user if needed
INSERT INTO public.profiles (id, email, name, role, created_at)
VALUES (
  UUID('e4a1bf9e-33ca-4d6c-8fa4-0e57098bfed9'), 
  'ze@gmail.com', 
  'Admin', 
  'admin', 
  now()
)
ON CONFLICT (id) DO NOTHING; 