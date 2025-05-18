import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/workouts/[id] - get a specific workout
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM workout_history WHERE id = $1', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }
    
    const row = result.rows[0]
    
    // Parse JSON fields if they are strings
    const exercises = typeof row.exercises === 'string' 
      ? JSON.parse(row.exercises) 
      : row.exercises
    
    const workout = {
      id: row.id,
      name: row.name,
      date: row.date,
      exercises,
      duration: row.duration,
      completed: row.completed
    }
    
    return NextResponse.json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    )
  }
}

// PUT /api/workouts/[id] - update a workout
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const now = new Date()
    
    // Create update query dynamically based on the fields provided
    const updates = []
    const values = []
    let paramCounter = 1
    
    if (body.name) {
      updates.push(`name = $${paramCounter++}`)
      values.push(body.name)
    }
    
    if (body.date) {
      updates.push(`date = $${paramCounter++}`)
      values.push(body.date)
    }
    
    if (body.exercises) {
      updates.push(`exercises = $${paramCounter++}`)
      values.push(JSON.stringify(body.exercises))
    }
    
    if (body.duration !== undefined) {
      updates.push(`duration = $${paramCounter++}`)
      values.push(body.duration)
    }
    
    if (body.completed !== undefined) {
      updates.push(`completed = $${paramCounter++}`)
      values.push(body.completed)
    }
    
    // Always update the updated_at timestamp
    updates.push(`updated_at = $${paramCounter++}`)
    values.push(now)
    
    // Add the ID for the WHERE clause
    values.push(params.id)
    
    const queryText = `
      UPDATE workout_history 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `
    
    const result = await query(queryText, values)
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }
    
    const row = result.rows[0]
    
    // Parse JSON fields if they are strings
    const exercises = typeof row.exercises === 'string' 
      ? JSON.parse(row.exercises) 
      : row.exercises
    
    const updatedWorkout = {
      id: row.id,
      name: row.name,
      date: row.date,
      exercises,
      duration: row.duration,
      completed: row.completed
    }
    
    return NextResponse.json(updatedWorkout)
  } catch (error) {
    console.error('Error updating workout:', error)
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    )
  }
}

// DELETE /api/workouts/[id] - delete a workout
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM workout_history WHERE id = $1 RETURNING id', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    )
  }
} 