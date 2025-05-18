import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutRoutine } from '@/types'

interface RoutineStore {
  routines: WorkoutRoutine[]
  selectedRoutine: WorkoutRoutine | null
  isLoading: boolean
  // Actions
  fetchRoutines: () => Promise<void>
  addRoutine: (routine: Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateRoutine: (id: string, updates: Partial<WorkoutRoutine>) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>
  selectRoutine: (id: string) => void
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: [], // Start with empty array
      selectedRoutine: null,
      isLoading: false,

      fetchRoutines: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/routines')
          if (!response.ok) throw new Error('Failed to fetch routines')
          const data = await response.json()
          set({ routines: data, isLoading: false })
        } catch (error) {
          console.error('Error fetching routines:', error)
          set({ isLoading: false })
        }
      },

      addRoutine: async (routine) => {
        try {
          const response = await fetch('/api/routines', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine),
          })

          if (!response.ok) throw new Error('Failed to add routine')
          const newRoutine = await response.json()
          
          set((state) => ({
            routines: [...state.routines, newRoutine],
          }))
          
          return newRoutine
        } catch (error) {
          console.error('Error adding routine:', error)
        }
      },

      updateRoutine: async (id, updates) => {
        try {
          const response = await fetch(`/api/routines/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          })

          if (!response.ok) throw new Error('Failed to update routine')
          const updatedRoutine = await response.json()
          
          set((state) => ({
            routines: state.routines.map((routine) =>
              routine.id === id ? updatedRoutine : routine
            ),
            selectedRoutine:
              state.selectedRoutine?.id === id
                ? updatedRoutine
                : state.selectedRoutine,
          }))
        } catch (error) {
          console.error('Error updating routine:', error)
        }
      },

      deleteRoutine: async (id) => {
        try {
          const response = await fetch(`/api/routines/${id}`, {
            method: 'DELETE',
          })

          if (!response.ok) throw new Error('Failed to delete routine')
          
          set((state) => ({
            routines: state.routines.filter((routine) => routine.id !== id),
            selectedRoutine:
              state.selectedRoutine?.id === id ? null : state.selectedRoutine,
          }))
        } catch (error) {
          console.error('Error deleting routine:', error)
        }
      },

      selectRoutine: (id) => {
        const routine = get().routines.find((r) => r.id === id) || null
        set({ selectedRoutine: routine })
      },
    }),
    {
      name: 'workout-routines',
    }
  )
) 