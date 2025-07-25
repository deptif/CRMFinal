-- Create profiles table if it doesn't exist

-- Create policies to allow deletion of records

-- Accounts policies
DROP POLICY IF EXISTS "Users can delete accounts" ON public.accounts;
CREATE POLICY "Users can delete accounts"
ON public.accounts
FOR DELETE
USING (auth.uid() = owner_id);

-- Contacts policies
DROP POLICY IF EXISTS "Users can delete contacts" ON public.contacts;
CREATE POLICY "Users can delete contacts"
ON public.contacts
FOR DELETE
USING (auth.uid() = owner_id);

-- Applications policies
DROP POLICY IF EXISTS "Users can delete applications" ON public.applications;
CREATE POLICY "Users can delete applications"
ON public.applications
FOR DELETE
USING (auth.uid() = owner_id);

-- Profiles policies
DROP POLICY IF EXISTS "Users can delete profiles" ON public.profiles;
CREATE POLICY "Users can delete profiles"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- Tasks policies
DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;
CREATE POLICY "Users can delete tasks"
ON public.tasks
FOR DELETE
USING (auth.uid() = owner_id OR auth.uid() = assignee);
