-- Update handle_new_user to auto-assign admin role for specific emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  assigned_role text := CASE
    WHEN lower(NEW.email) IN ('oneshotsxtg@gmail.com', 'lisakenny391@gmail.com') THEN 'admin'
    ELSE 'user'
  END;
BEGIN
  INSERT INTO public.users (id, email, role, username)
  VALUES (NEW.id, NEW.email, assigned_role, public.generate_unique_ultra_username());

  INSERT INTO public.user_wallets (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Ensure existing rows are promoted if present
UPDATE public.users
SET role = 'admin'
WHERE lower(email) IN ('oneshotsxtg@gmail.com', 'lisakenny391@gmail.com');