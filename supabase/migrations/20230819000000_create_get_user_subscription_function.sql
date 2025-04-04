
-- Create function to get user subscription that will be accessible from the client
CREATE OR REPLACE FUNCTION public.get_user_subscription()
RETURNS SETOF public.subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.subscriptions
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1;
END;
$$;
