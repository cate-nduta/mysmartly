// ============================================
// SET ADMIN PASSWORD SCRIPT
// Run this with: node SET-PASSWORD-SCRIPT.js
// ============================================

// First, add SUPABASE_SERVICE_ROLE_KEY to your .env.local file
// Get it from: Supabase Dashboard → Settings → API → service_role key

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'
const USERNAME = 'whooptydoo'
const NEW_PASSWORD = '@MyCK!254'

async function setAdminPassword() {
  try {
    // Import Supabase client (you may need to install: npm install @supabase/supabase-js)
    const { createClient } = require('@supabase/supabase-js')
    
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Find admin user by username
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('user_id, email, username')
      .eq('username', USERNAME.toLowerCase().trim())
      .single()

    if (adminError || !adminUser) {
      console.error('❌ Admin user not found:', adminError)
      return
    }

    console.log('✅ Found admin user:', adminUser.username)

    // Update password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      adminUser.user_id,
      { password: NEW_PASSWORD }
    )

    if (error) {
      console.error('❌ Failed to update password:', error)
      return
    }

    console.log('✅ Password updated successfully!')
    console.log('Username:', USERNAME)
    console.log('Password:', NEW_PASSWORD)
    console.log('\nYou can now login at /admin with these credentials')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setAdminPassword()

