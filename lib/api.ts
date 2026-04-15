import { supabase } from './supabase'

const API_URL = process.env.EXPO_PUBLIC_API_URL

// Helper: get current session token and make an authenticated request
async function authFetch(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error('Not logged in')

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // This JWT token is how Node.js knows who you are
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  })
}

// ---- Food Log API calls ----

export async function logMeal(foodId: string, quantity: number, mealType: string) {
  const res = await authFetch('/api/food-log', {
    method: 'POST',
    body: JSON.stringify({ foodId, quantity, mealType }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getTodaysLogs() {
  const res = await authFetch('/api/food-log/today')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function searchFoods(query: string) {
  const res = await authFetch(`/api/foods/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
