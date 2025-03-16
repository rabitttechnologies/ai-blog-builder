
-- Create a function to safely add an admin role
CREATE OR REPLACE FUNCTION public.add_user_admin_role(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id_param, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
