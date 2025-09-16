-- 1) Helper to generate unique 'ultra_' usernames
CREATE OR REPLACE FUNCTION public.generate_unique_ultra_username()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_suffix text;
  new_username text;
  username_exists boolean;
BEGIN
  LOOP
    random_suffix := floor(random() * 900000 + 100000)::text; -- 6 digits
    new_username := 'ultra_' || random_suffix;
    SELECT EXISTS(SELECT 1 FROM public.users WHERE username = new_username) INTO username_exists;
    EXIT WHEN NOT username_exists;
  END LOOP;
  RETURN new_username;
END;
$$;

-- 2) Update handle_new_user to use the helper and create wallet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, role, username)
  VALUES (NEW.id, NEW.email, 'user', public.generate_unique_ultra_username());

  INSERT INTO public.user_wallets (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- 3) Create trigger on auth.users to call handle_new_user after user creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- 4) Backfill missing users from existing auth.users
INSERT INTO public.users (id, email, role, username)
SELECT au.id, au.email, 'user', public.generate_unique_ultra_username()
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- 5) Backfill missing wallets for existing users
INSERT INTO public.user_wallets (user_id)
SELECT pu.id
FROM public.users pu
LEFT JOIN public.user_wallets uw ON uw.user_id = pu.id
WHERE uw.user_id IS NULL;

-- 6) Enforce unique emails at the public.users level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.users'::regclass
      AND contype = 'u'
      AND conname = 'users_email_unique'
  ) THEN
    ALTER TABLE public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
  END IF;
END $$;

-- 7) Promote specific emails to admin
UPDATE public.users
SET role = 'admin'
WHERE email IN ('oneshotsxtg@gmail.com', 'lisakenny391@gmail.com');