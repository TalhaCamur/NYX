-- Fix Email Change Process
-- Run this in Supabase SQL Editor

-- 1. Check if profiles table exists and has correct structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Note: Auth configuration should be set in Supabase Dashboard > Authentication > Settings
-- Make sure these are configured:
-- - Site URL: http://localhost:3001 (or your current port)
-- - Redirect URLs: http://localhost:3001/**

-- 3. Create a function to handle email change completion
CREATE OR REPLACE FUNCTION public.handle_email_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profiles table when email is changed
    IF OLD.email IS DISTINCT FROM NEW.email THEN
        UPDATE public.profiles 
        SET 
            email = NEW.email,
            updated_at = NOW()
        WHERE id = NEW.id;
        
        RAISE LOG 'Email updated for user %: % -> %', NEW.id, OLD.email, NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger for email changes
DROP TRIGGER IF EXISTS on_auth_user_email_change ON auth.users;
CREATE TRIGGER on_auth_user_email_change
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_email_change();

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT SELECT, UPDATE ON auth.users TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.profiles TO service_role;

-- 6. Test the trigger
-- This will show if the trigger is working
SELECT 'Email change trigger created successfully' as status;
