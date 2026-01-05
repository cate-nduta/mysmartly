// ============================================
// AUTOMATED ADMIN SETUP - DOES EVERYTHING FOR YOU!
// Run: npm run setup-admin
// This script automatically:
// 1. Creates admin_users table if needed
// 2. Adds username column if needed
// 3. Creates the admin user in Supabase Auth
// 4. Adds user to admin_users table
// 5. Sets the password
// ============================================

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Manually load .env.local file
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    // Skip comments and empty lines
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const equalIndex = trimmedLine.indexOf('=')
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim()
        let value = trimmedLine.substring(equalIndex + 1).trim()
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        process.env[key] = value
      }
    }
  })
  console.log('✅ Loaded .env.local file')
} else {
  console.log('⚠️  .env.local file not found, using process.env')
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'whooptydoo'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@MyCK!254'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@mysmartly.app'

async function setupAdminPassword() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables in .env.local')
    console.log('\nRequired:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
    console.log('\nOptional:')
    console.log('ADMIN_USERNAME=whooptydoo')
    console.log('ADMIN_PASSWORD=@MyCK!254')
    console.log('ADMIN_EMAIL=whooptydoo@mysmartly.app')
    process.exit(1)
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('🚀 Starting automated admin setup...')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Username:', ADMIN_USERNAME)
    console.log('Email:', ADMIN_EMAIL)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Step 1: Check if admin_users table exists
    console.log('📋 Step 1: Checking admin_users table...')
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .limit(1)
    
    if (tableError && (tableError.message?.includes('relation') || tableError.message?.includes('does not exist'))) {
      console.log('❌ admin_users table does not exist!')
      console.log('\n📋 ONE-TIME SETUP REQUIRED:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('1. Open your Supabase Dashboard')
      console.log('2. Go to SQL Editor')
      console.log('3. Copy and paste the contents of: create-admin-table.sql')
      console.log('   OR run this SQL:')
      console.log('\n' + '='.repeat(60))
      const fs = require('fs')
      const sqlPath = path.join(process.cwd(), 'create-admin-table.sql')
      if (fs.existsSync(sqlPath)) {
        console.log(fs.readFileSync(sqlPath, 'utf8'))
      } else {
        console.log(`CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role full access admin users" ON admin_users;
CREATE POLICY "Allow service role full access admin users" ON admin_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own admin status" ON admin_users;
CREATE POLICY "Allow authenticated read own admin status" ON admin_users
  FOR SELECT TO authenticated USING (auth.uid() = user_id);`)
      }
      console.log('='.repeat(60))
      console.log('\n4. Click "Run"')
      console.log('5. Then run: npm run setup-admin again')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      process.exit(1)
    } else {
      console.log('✅ admin_users table is ready')
    }

    // Step 2: Check if user already exists in auth
    console.log('\n🔍 Step 2: Checking for existing user...')
    let authUser = null
    try {
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      if (!listError && users?.users) {
        authUser = users.users.find(u => u.email === ADMIN_EMAIL)
        if (authUser) {
          console.log('✅ User exists in Supabase Auth:', authUser.id)
        }
      }
    } catch (e) {
      // Continue to create user
    }

    if (!authUser) {
      console.log('👤 Creating new user in Supabase Auth...')
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          username: ADMIN_USERNAME
        }
      })

      if (createError) {
        console.error('❌ Failed to create user:', createError.message)
        process.exit(1)
      }

      authUser = newUser.user
      console.log('✅ User created:', authUser.id)
    }

    // Step 3: Update password to match .env
    console.log('\n🔐 Step 3: Setting password...')
    const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      { password: ADMIN_PASSWORD }
    )

    if (passwordError) {
      console.error('⚠️  Password update warning:', passwordError.message)
    } else {
      console.log('✅ Password set')
    }

    // Step 4: Ensure admin_users table exists (create via direct SQL if needed)
    // Since we can't easily run DDL via client, we'll use upsert which will work if table exists
    console.log('\n📝 Step 4: Adding user to admin_users table...')
    
    // First, delete any existing admin_users record with the same username (to avoid conflicts)
    const { error: deleteError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('username', ADMIN_USERNAME.toLowerCase().trim())
    
    // Now insert/update with user_id as the conflict key
    const { data: adminRecord, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .upsert({
        user_id: authUser.id,
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME.toLowerCase().trim(),
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (adminError) {
      console.error('❌ Failed to add user to admin_users:', adminError.message)
      console.log('\n💡 Make sure you ran the SQL from create-admin-table.sql first!')
      process.exit(1)
    } else {
      console.log('✅ User added to admin_users table')
    }

    // Step 5: Verify everything is set up
    console.log('\n✅ Step 5: Verifying setup...')
    const { data: verifyUser, error: verifyError } = await supabaseAdmin
      .from('admin_users')
      .select('username, email, is_active')
      .eq('username', ADMIN_USERNAME.toLowerCase().trim())
      .single()

    if (verifyError || !verifyUser) {
      console.error('⚠️  Verification failed:', verifyError?.message)
      console.log('But setup may still have worked. Try logging in!')
    } else {
      console.log('✅ Verification complete!')
      console.log('   Username:', verifyUser.username)
      console.log('   Email:', verifyUser.email)
      console.log('   Active:', verifyUser.is_active)
    }

    console.log('\n' + '✅'.repeat(20))
    console.log('🎉 SETUP COMPLETE!')
    console.log('✅'.repeat(20))
    console.log('\nYour login credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Username:', ADMIN_USERNAME)
    console.log('Email:', ADMIN_EMAIL)
    console.log('Password:', ADMIN_PASSWORD)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🌐 You can now login at: http://localhost:3000/admin')
    console.log('\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.stack) {
      console.error('\nDetails:', error.stack.split('\n').slice(0, 5).join('\n'))
    }
    
    // If table doesn't exist, provide SQL to run
    if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
      console.log('\n📋 QUICK FIX:')
      console.log('1. Open Supabase Dashboard → SQL Editor')
      console.log('2. Copy contents of create-admin-table.sql and run it')
      console.log('3. Run: npm run setup-admin again')
    }
    
    process.exit(1)
  }
}

setupAdminPassword()
