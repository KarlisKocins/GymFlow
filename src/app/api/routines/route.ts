import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { WorkoutRoutine } from '@/types'

// GET /api/routines - get all routines
export async function GET() {
  try {
    const result = await query('SELECT * FROM routines ORDER BY created_at DESC')
    console.log('Raw DB result:', JSON.stringify(result.rows[0], null, 2))
    
    const routines = result.rows.map(row => {
      // Parse JSON fields if they are strings
      const targetMuscleGroups = typeof row.target_muscle_groups === 'string' 
        ? JSON.parse(row.target_muscle_groups) 
        : row.target_muscle_groups
        
      const exercises = typeof row.exercises === 'string' 
        ? JSON.parse(row.exercises) 
        : row.exercises
      
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        difficulty: row.difficulty,
        category: row.category,
        estimatedDuration: row.estimated_duration,
        targetMuscleGroups,
        exercises,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isCustom: row.is_custom
      }
    })
    
    console.log('Processed first routine:', JSON.stringify(routines[0], null, 2))
    return NextResponse.json(routines)
  } catch (error) {
    console.error('Error fetching routines:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routines' },
      { status: 500 }
    )
  }
}

// POST /api/routines - create a new routine
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = crypto.randomUUID()
    const now = new Date()
    
    const result = await query(
      'INSERT INTO routines (id, name, description, difficulty, category, estimated_duration, target_muscle_groups, exercises, created_at, updated_at, is_custom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        id,
        body.name,
        body.description,
        body.difficulty,
        body.category,
        body.estimatedDuration,
        JSON.stringify(body.targetMuscleGroups),
        JSON.stringify(body.exercises),
        now,
        now,
        body.isCustom || false
      ]
    )
    
    const newRoutine = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      description: result.rows[0].description,
      difficulty: result.rows[0].difficulty,
      category: result.rows[0].category,
      estimatedDuration: result.rows[0].estimated_duration,
      targetMuscleGroups: result.rows[0].target_muscle_groups,
      exercises: result.rows[0].exercises,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
      isCustom: result.rows[0].is_custom
    }
    
    return NextResponse.json(newRoutine)
  } catch (error) {
    console.error('Error creating routine:', error)
    return NextResponse.json(
      { error: 'Failed to create routine' },
      { status: 500 }
    )
  }
} 