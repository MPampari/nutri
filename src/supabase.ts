import { createClient } from '@supabase/supabase-js'

// Admin client — bypasses RLS, use only on the server
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper: create a user-scoped client from a JWT token
// This client acts as the authenticated user — respects RLS
export function supabaseAsUser(accessToken: string) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    }
  )
}
