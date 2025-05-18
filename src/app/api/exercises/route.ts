import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/exercises - get all exercises
export async function GET() {
  try {
    const result = await query('SELECT * FROM exercises ORDER BY muscle_group, name')
    
    const exercises = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      muscleGroup: row.muscle_group,
      description: row.description
    }))
    
    return NextResponse.json(exercises)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    )
  }
}

// POST /api/exercises - create a new exercise
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const now = new Date()
    
    const result = await query(
      'INSERT INTO exercises (id, name, muscle_group, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        body.id,
        body.name,
        body.muscleGroup,
        body.description || '',
        now,
        now
      ]
    )
    
    const newExercise = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      muscleGroup: result.rows[0].muscle_group,
      description: result.rows[0].description
    }
    
    return NextResponse.json(newExercise)
  } catch (error) {
    console.error('Error creating exercise:', error)
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    )
  }
} 