-- Update RLS policies for user_roles to prevent self-promotion
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Only allow users to view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only managers can manage roles
CREATE POLICY "Managers can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.has_role(auth.uid(), 'manager'));

-- Users can only insert their own role as 'user' (for signup)
CREATE POLICY "Users can insert own user role only" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND role = 'user');

-- Create a function to get all users for managers
CREATE OR REPLACE FUNCTION public.get_all_users_for_manager()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role app_role
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    auth.users.email,
    p.full_name,
    COALESCE(ur.role, 'user'::app_role) as role
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  LEFT JOIN auth.users ON p.id = auth.users.id
  WHERE public.has_role(auth.uid(), 'manager')
  ORDER BY p.full_name;
$$;