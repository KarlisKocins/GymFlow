import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/routines/[id] - get a specific routine
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM routines WHERE id = $1', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      )
    }
    
    const row = result.rows[0]
    
    // Parse JSON fields if they are strings
    const targetMuscleGroups = typeof row.target_muscle_groups === 'string' 
      ? JSON.parse(row.target_muscle_groups) 
      : row.target_muscle_groups
      
    const exercises = typeof row.exercises === 'string' 
      ? JSON.parse(row.exercises) 
      : row.exercises
    
    const routine = {
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
    
    return NextResponse.json(routine)
  } catch (error) {
    console.error('Error fetching routine:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routine' },
      { status: 500 }
    )
  }
}

// PUT /api/routines/[id] - update a routine
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const now = new Date()
    
    const updatedFields: string[] = []
    const values: any[] = []
    let paramCount = 1
    
    // Build dynamic update statement
    Object.entries(body).forEach(([key, value]) => {
      let dbField = key
      let dbValue = value
      
      // Convert camelCase to snake_case and handle special fields
      if (key === 'estimatedDuration') dbField = 'estimated_duration'
      else if (key === 'targetMuscleGroups') {
        dbField = 'target_muscle_groups'
        dbValue = JSON.stringify(value)
      }
      else if (key === 'exercises') dbValue = JSON.stringify(value)
      else if (key === 'isCustom') dbField = 'is_custom'
      else if (key === 'createdAt') {
        dbField = 'created_at'
        dbValue = new Date(value as string)
      }
      else if (key === 'updatedAt') {
        dbField = 'updated_at'
        dbValue = new Date(value as string)
      }
      // Convert camelCase to snake_case
      else dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      
      updatedFields.push(`${dbField} = $${paramCount}`)
      values.push(dbValue)
      paramCount++
    })
    
    // Always update the updated_at timestamp
    updatedFields.push(`updated_at = $${paramCount}`)
    values.push(now)
    paramCount++
    
    // Add ID as the last parameter
    values.push(params.id)
    
    const result = await query(
      `UPDATE routines SET ${updatedFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      )
    }
    
    const updatedRoutine = {
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
    
    return NextResponse.json(updatedRoutine)
  } catch (error) {
    console.error('Error updating routine:', error)
    return NextResponse.json(
      { error: 'Failed to update routine' },
      { status: 500 }
    )
  }
}

// DELETE /api/routines/[id] - delete a routine
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM routines WHERE id = $1 RETURNING id', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error('Error deleting routine:', error)
    return NextResponse.json(
      { error: 'Failed to delete routine' },
      { status: 500 }
    )
  }
} 