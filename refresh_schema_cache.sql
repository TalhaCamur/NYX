-- Refresh Supabase Schema Cache
-- Run this in Supabase SQL Editor

-- Force refresh of schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: Restart the API
-- This will force a schema refresh
SELECT 1;
