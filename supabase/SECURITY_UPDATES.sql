-- SECURITY UPDATE: Improved Row Level Security (RLS) Policies
-- Replace the existing "Public insert" and "Public delete" policies with these secure ones

-- ============ STEP 1: UPDATE EXISTING POLICIES ============
-- First, delete the insecure policies:
-- DROP POLICY "Public insert (tighten later)" ON public.case_studies;
-- DROP POLICY "Public delete (tighten later)" ON public.case_studies;

-- ============ STEP 2: CREATE SECURE POLICIES ============

-- ▼ RESTRICT INSERT: Only allow if user is authenticated
-- (Requires Supabase Auth - admin users must be logged in)
-- Uncomment when you implement Supabase Auth:
/*
create policy "Admin insert" on public.case_studies
for insert
with check (auth.role() = 'authenticated');
*/

-- ▼ RESTRICT UPDATE: Only allow if user is authenticated
-- Uncomment when you implement Supabase Auth:
/*
create policy "Admin update" on public.case_studies
for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
*/

-- ▼ RESTRICT DELETE: Only allow if user is authenticated
-- Uncomment when you implement Supabase Auth:
/*
create policy "Admin delete" on public.case_studies
for delete
using (auth.role() = 'authenticated');
*/

-- ============ STEP 3: CURRENT WORKAROUND ============
-- Since you're using password-based admin dashboard (not Supabase Auth),
-- use the following approach:

-- Allow public READ access (necessary for portfolio site)
-- ✓ Already set: "Public read access" policy

-- For WRITE access (insert/update/delete):
-- OPTION A: Manual security at application level
--   - Verify admin password in React component (done in AdminDashboard)
--   - Use public policies but validate on client
--   - NOT RECOMMENDED for production

-- OPTION B: Implement Supabase Auth (RECOMMENDED)
--   - Create Supabase user accounts for admins
--   - Use auth.role() = 'authenticated' in policies
--   - Much more secure

-- ============ RECOMMENDED SETUP ============
-- To fully implement this, you should:
-- 1. Set up a Supabase Auth account
-- 2. Create admin user account(s) in Supabase Auth
-- 3. Update admin login to use supabase.auth.signInWithPassword()
-- 4. Uncomment the auth policies above
-- 5. Delete the "Public insert/delete" policies

-- ============ TEMPORARY SECURE POLICIES ============
-- Until you implement full Supabase Auth, use these
-- (These require validation at the API/client level):

-- Keep the "Public read access" policy as-is (line 24-27)

-- For insert/update/delete, you MUST implement validation in code
-- See: src/pages/AdminDashboard.tsx - ensure password check is done BEFORE
-- calling supabase.from('case_studies').insert()

-- Example secure call:
/*
if (password === adminPassword) {  // Already checked
  const { data, error } = await supabase
    .from('case_studies')
    .insert([newCaseStudy])
  // Handle response
}
*/

-- ============ FULL SECURE SCHEMA (RECOMMENDED) ============
-- Create this to replace the insecure policies entirely

-- RUN THIS AFTER SETTING UP SUPABASE AUTH:
/*
-- First drop the insecure policies
DROP POLICY IF EXISTS "Public insert (tighten later)" ON public.case_studies;
DROP POLICY IF EXISTS "Public delete (tighten later)" ON public.case_studies;

-- Create secure policies with authentication requirement
CREATE POLICY "Allow public read" ON public.case_studies
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated insert" ON public.case_studies
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.case_studies
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON public.case_studies
FOR DELETE
USING (auth.role() = 'authenticated');

-- END OF SECURE SCHEMA
*/

