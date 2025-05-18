import { create } from 'zustand'

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  description?: string
}

interface ExerciseStore {
  exercises: Exercise[]
  exercisesByGroup: Record<string, Exercise[]>
  isLoading: boolean
  // Actions
  fetchExercises: () => Promise<void>
}

export const useExerciseStore = create<ExerciseStore>()((set) => ({
  exercises: [],
  exercisesByGroup: {},
  isLoading: false,
  
  fetchExercises: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/exercises')
      if (!response.ok) throw new Error('Failed to fetch exercises')
      
      const data: Exercise[] = await response.json()
      
      // Group exercises by muscle group
      const groupedExercises: Record<string, Exercise[]> = {}
      data.forEach(exercise => {
        if (!groupedExercises[exercise.muscleGroup]) {
          groupedExercises[exercise.muscleGroup] = []
        }
        groupedExercises[exercise.muscleGroup].push(exercise)
      })
      
      set({ 
        exercises: data, 
        exercisesByGroup: groupedExercises,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching exercises:', error)
      set({ isLoading: false })
    }
  }
})) 