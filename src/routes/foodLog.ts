import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { supabaseAdmin } from '../supabase'

export const foodLogRouter = Router()

// POST /api/food-log — log a meal
foodLogRouter.post('/', requireAuth, async (req, res) => {
  const { foodId, quantity, mealType } = req.body
  const userId = req.user!.id       // set by requireAuth middleware

  const { data, error } = await supabaseAdmin
    .from('food_log')
    .insert({ user_id: userId, food_id: foodId, quantity, meal_type: mealType })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// GET /api/food-log/today — get today's logs with nutrition info
foodLogRouter.get('/today', requireAuth, async (req, res) => {
  const userId = req.user!.id
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data, error } = await supabaseAdmin
    .from('food_log')
    .select(`
      id, quantity, meal_type, logged_at,
      food_database (
        food_name, category,
        nutrition_data ( calories, protein, carbs, fats )
      )
    `)
    .eq('user_id', userId)
    .gte('logged_at', todayStart.toISOString())
    .order('logged_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/food-log/:id — delete a log entry (only own entries)
foodLogRouter.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('food_log')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id)   // safety: only delete own rows

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})
