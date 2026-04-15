import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Get these from: Supabase dashboard → Settings → API
const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: AsyncStorage,          // persist session on device
    autoRefreshToken: true,        // auto-renew tokens silently
    persistSession: true,          // keep user logged in
    detectSessionInUrl: false,     // not a web browser
  },
})
