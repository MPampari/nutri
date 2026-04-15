import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../supabase'

// Extend Express's Request type to include our user
declare global {
  namespace Express {
    interface Request { user?: { id: string; email: string } }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' })
  }

  const token = authHeader.split(' ')[1]

  // Ask Supabase to verify this token — returns the user if valid
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  // Attach user info to the request — available in all route handlers
  req.user = { id: user.id, email: user.email! }
  next()
}
