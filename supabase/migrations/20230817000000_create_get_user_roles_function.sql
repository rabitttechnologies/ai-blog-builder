
-- Create a function to safely retrieve user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id_param UUID)
RETURNS TABLE (role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role::TEXT
  FROM public.user_roles ur
  WHERE ur.user_id = user_id_param;
END;
$$;
