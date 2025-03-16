
-- Create a function to safely retrieve all admin users
CREATE OR REPLACE FUNCTION public.get_all_admin_users()
RETURNS TABLE (user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.user_id
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
END;
$$;
