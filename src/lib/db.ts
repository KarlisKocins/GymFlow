import { config } from 'dotenv'
config()
import { Pool } from 'pg'

// Use environment variables for database connection
const pool = process.env.NEXT_RUNTIME === 'nodejs'
  ? new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    }) 
  : null

// Helper function to query the database
export async function query(text: string, params?: (string | number | boolean | Date | object)[] | undefined) {
  if (!pool) {
    throw new Error('Database connection not available on client side')
  }
  
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export default pool 