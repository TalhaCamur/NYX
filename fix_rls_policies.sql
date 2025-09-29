-- Fix RLS Policies for Profiles
-- Run this in Supabase SQL Editor

-- 1. Temporarily disable RLS to fix policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- 3. Create new policies with proper conditions
CREATE POLICY "Enable insert for authenticated users" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for all users" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on user_id" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- 4. Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Grant additional permissions
GRANT ALL ON profiles TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
