import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { foodLogRouter } from './routes/foodLog'

const app = express()

app.use(cors({
  origin: true,   // allow all origins in dev; restrict in production
}))
app.use(express.json())

// Mount routes
app.use('/api/food-log', foodLogRouter)

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || '3000'
app.listen(+PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
