import { Pool } from 'pg'

// Make sure this is only run on the server side to avoid 'fs' module errors
const pool = process.env.NEXT_RUNTIME === 'nodejs'
  ? new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'gymapp',
      password: '1212',
      port: 5432,
    }) 
  : null

// Helper function to query the database
export async function query(text: string, params?: any[]) {
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