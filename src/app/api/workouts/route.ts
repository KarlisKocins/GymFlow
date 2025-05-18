import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { Workout } from '@/types'

// GET /api/workouts - get all workout history
export async function GET() {
  try {
    const result = await query('SELECT * FROM workout_history ORDER BY date DESC')
    
    const workouts = result.rows.map(row => {
      // Parse JSON fields if they are strings
      const exercises = typeof row.exercises === 'string' 
        ? JSON.parse(row.exercises) 
        : row.exercises
      
      return {
        id: row.id,
        name: row.name,
        date: row.date,
        exercises,
        duration: row.duration,
        completed: row.completed
      }
    })
    
    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Error fetching workout history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workout history' },
      { status: 500 }
    )
  }
}

// POST /api/workouts - add a new workout to history
export async function POST(request: Request) {
  try {
    const workout = await request.json()
    const now = new Date()
    
    const result = await query(
      'INSERT INTO workout_history (id, name, date, exercises, duration, completed, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        workout.id || crypto.randomUUID(),
        workout.name,
        workout.date || now,
        JSON.stringify(workout.exercises),
        workout.duration,
        workout.completed || true,
        now,
        now
      ]
    )
    
    const savedWorkout = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      date: result.rows[0].date,
      exercises: result.rows[0].exercises,
      duration: result.rows[0].duration,
      completed: result.rows[0].completed
    }
    
    return NextResponse.json(savedWorkout)
  } catch (error) {
    console.error('Error saving workout:', error)
    return NextResponse.json(
      { error: 'Failed to save workout' },
      { status: 500 }
    )
  }
} 