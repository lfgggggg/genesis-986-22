-- Add username column to users table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
    ALTER TABLE public.users ADD COLUMN username text UNIQUE;
  END IF;
END $$;

-- Update the handle_new_user function to auto-generate username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  random_suffix text;
  new_username text;
  username_exists boolean;
BEGIN
  -- Generate unique username with ultra_ prefix
  LOOP
    random_suffix := floor(random() * 900000 + 100000)::text; -- 6 digit random number
    new_username := 'ultra_' || random_suffix;
    
    -- Check if username already exists
    SELECT EXISTS(SELECT 1 FROM public.users WHERE username = new_username) INTO username_exists;
    
    -- Exit loop if username is unique
    EXIT WHEN NOT username_exists;
  END LOOP;

  -- Insert user with generated username
  INSERT INTO public.users (id, email, role, username)
  VALUES (NEW.id, NEW.email, 'user', new_username);
  
  -- Create wallet for user
  INSERT INTO public.user_wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;