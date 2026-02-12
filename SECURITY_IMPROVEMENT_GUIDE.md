# Security Implementation Guide

## Overview
This guide walks you through implementing the recommended security improvements for your portfolio website.

---

## ✅ STEP 1: Admin Password Environmental Variables (COMPLETED)

### What was done:
- ✓ Moved hardcoded password `'1234567890$Im'` from code to environment variables
- ✓ Updated `.env.example` with `VITE_ADMIN_PASSWORD` placeholder
- ✓ Modified `AdminDashboard.tsx` to read from `import.meta.env.VITE_ADMIN_PASSWORD`
- ✓ Removed console logging of password attempts

### To activate this:
1. Create/open your `.env` file (git-ignored, not committed)
2. Add this line:
```env
VITE_ADMIN_PASSWORD=your_very_secure_password_here
```

3. Use a **strong password** (min 16 characters, mixed case, numbers, symbols):
```env
VITE_ADMIN_PASSWORD=K#9mL$2pQxYz!4wR@vB7n
```

**Security Level:** ⭐⭐⭐ (Good - password not in code)

---

## 🔜 STEP 2: Implement Supabase Authentication (RECOMMENDED)

### Why:
Currently, write access to Supabase is unrestricted (anyone can insert/update/delete). Only your React admin check prevents abuse. A determined attacker can bypass this by attacking the Supabase API directly.

### Implementation Plan:

#### A. Set up Supabase Auth Account

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add user** and create admin account(s):
   ```
   Email: admin@example.com
   Password: (auto-generate secure one)
   ```

#### B. Update Admin Login Component

Replace the password check in `AdminDashboard.tsx`:

```typescript
// Current (password only):
if (password === adminPassword) {
  setIsAuthenticated(true);
}

// NEW (Supabase Auth):
const handleLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    setIsAuthenticated(true)
    localStorage.setItem('admin_session', data.session?.access_token || '')
  } catch (error) {
    setAuthError(error.message)
  }
}
```

#### C. Update RLS Policies in Supabase

Run the SQL from `supabase/SECURITY_UPDATES.sql`:

1. Go to Supabase Dashboard → **SQL Editor**
2. Create new query and paste:

```sql
-- Remove insecure policies
DROP POLICY IF EXISTS "Public insert (tighten later)" ON public.case_studies;
DROP POLICY IF EXISTS "Public delete (tighten later)" ON public.case_studies;

-- Add secure auth-based policies
CREATE POLICY "Admin insert" ON public.case_studies
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON public.case_studies
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON public.case_studies
FOR DELETE
USING (auth.role() = 'authenticated');
```

3. Click **Run** ✓

**Security Level:** ⭐⭐⭐⭐⭐ (Excellent - API-level protection)

---

## 🔜 STEP 3: Add Rate Limiting (IMPORTANT)

### Current Risk:
Contact form has no rate limiting. Spammers can submit unlimited messages.

### Solution Options:

#### Option A: Formspree Rate Limiting (Simple)
Formspree has built-in rate limiting (check your account settings).
1. Log into Formspree.io
2. Go to your form settings
3. Enable **Rate Limiting** (usually 1 request per 10 seconds per IP)
4. Set spam protection to **Moderate** or **Strict**

**Implementation Time:** 5 minutes
**Cost:** Free (included with Formspree)

#### Option B: Implement Backend Rate Limiting (Advanced)

Create a simple Node.js backend or use a serverless function:

**Using Netlify Functions:**

1. Create `netlify/functions/submit-contact.js`:

```javascript
const handler = async (event) => {
  // Simple rate limiting: 1 request per 60 seconds per IP
  const clientIp = event.headers['client-ip']
  const now = Date.now()
  
  if (!rateLimitStore[clientIp]) {
    rateLimitStore[clientIp] = { count: 0, resetTime: now + 60000 }
  }
  
  const limit = rateLimitStore[clientIp]
  if (now < limit.resetTime && limit.count >= 1) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Too many requests. Try again later.' })
    }
  }
  
  if (now >= limit.resetTime) {
    limit.count = 0
    limit.resetTime = now + 60000
  }
  
  limit.count++
  
  // Forward to Formspree...
}
```

**Implementation Time:** 1-2 hours
**Cost:** Free (included with Netlify)

#### Option C: Use Dedicated Service

Services like **Vercel + rate-limit-redis** or **AWS Lambda**

**Implementation Time:** 2-3 hours
**Cost:** Usually free tier available

### Recommendation:
Start with **Option A (Formspree)** - takes 5 minutes, handles 90% of spam

**Security Level:** ⭐⭐⭐⭐ (Very Good)

---

## 🔜 STEP 4: Review Supabase Permissions

### What to Check:

#### 1. Anon Key Permissions
Currently your client uses `VITE_SUPABASE_ANON_KEY` which can:
- ✓ Read public data
- ✓ Insert/update/delete if RLS allows
- ✗ Access auth functions (good)
- ✗ Access admin endpoints (good)

**Action:** Once you implement RLS policies, the anon key can only write if authenticated. ✓

#### 2. Service Role Key
**WARNING:** Never expose your service role key in client code!

Check `.env` files and make sure:
- `VITE_SUPABASE_ANON_KEY` is in `.env` (exposed, OK - has limited permissions)
- `VITE_SUPABASE_URL` is in `.env` (exposed, OK - public info)
- `SUPABASE_SERVICE_ROLE_KEY` is NOT in `.env` (only on server)

#### 3. Database Permissions

In Supabase Dashboard → **Settings** → **Database**:

- [ ] Disable password authentication for users
- [ ] Use only OAuth or magic links
- [ ] Or use service role with strong credentials (server-side only)

#### 4. Storage Bucket Permissions

If you have image storage:

1. Go to **Storage** → Your bucket → **Policies**
2. Ensure:
   - ✓ Public read (for displaying images)
   - ✗ Public write (only authenticated admins)

**Recommended policy:**
```sql
CREATE POLICY "Public read" ON storage.objects
FOR SELECT
USING (bucket_id = 'case-studies');

CREATE POLICY "Authenticated write" ON storage.objects
FOR INSERT OR UPDATE OR DELETE
WITH CHECK (
  bucket_id = 'case-studies' AND
  auth.role() = 'authenticated'
);
```

**Security Level:** ⭐⭐⭐⭐ (Very Good)

---

## Summary of Recommended Actions

| Priority | Action | Time | Security Level |
|----------|--------|------|-----------------|
| 🔴 NOW | Set `VITE_ADMIN_PASSWORD` in `.env` | 2 min | ⭐⭐⭐ |
| 🔴 THIS WEEK | Implement Supabase Auth | 1-2 hrs | ⭐⭐⭐⭐⭐ |
| 🟠 THIS WEEK | Enable Formspree Rate Limiting | 5 min | ⭐⭐⭐⭐ |
| 🟠 NEXT WEEK | Review Supabase Permissions | 30 min | ⭐⭐⭐⭐ |

---

## Checklist

- [ ] Set `VITE_ADMIN_PASSWORD` in `.env`
- [ ] Test admin login with new password
- [ ] Create admin user in Supabase Auth
- [ ] Update RLS policies in Supabase
- [ ] Update admin login to use `supabase.auth.signInWithPassword()`
- [ ] Enable rate limiting on Formspree
- [ ] Test form submission rate limiting
- [ ] Review Supabase permissions
- [ ] Run security audit again
- [ ] Delete `.env` file from git history if it was ever committed

---

## Questions?

Refer to:
- Supabase Docs: https://supabase.com/docs
- Formspree Docs: https://formspree.io/docs
- SECURITY_AUDIT.md in this repo for detailed vulnerability report
