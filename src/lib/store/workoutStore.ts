import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Workout, WorkoutExercise, Set, WorkoutRoutine } from '@/types'

interface WorkoutStore {
  currentWorkout: Workout | null
  workoutHistory: Workout[]
  activeTimer: {
    exerciseId: string
    setId: string
    remainingTime: number
  } | null
  isLoading: boolean
  // Actions
  fetchWorkoutHistory: () => Promise<void>
  startWorkout: (name: string) => void
  startWorkoutFromRoutine: (routine: WorkoutRoutine) => void
  addExercise: (exercise: Omit<WorkoutExercise, 'id'>) => void
  removeExercise: (exerciseId: string) => void
  updateSet: (exerciseId: string, setId: string, updates: Partial<Set>) => void
  addSet: (exerciseId: string) => void
  removeSet: (exerciseId: string, setIndex: number) => void
  updateExerciseRestTime: (exerciseId: string, restTime: number) => void
  startTimer: (exerciseId: string, setId: string, duration: number) => void
  stopTimer: () => void
  completeWorkout: () => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      workoutHistory: [],
      activeTimer: null,
      isLoading: false,
      
      fetchWorkoutHistory: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/workouts')
          if (!response.ok) throw new Error('Failed to fetch workout history')
          const data = await response.json()
          set({ workoutHistory: data, isLoading: false })
        } catch (error) {
          console.error('Error fetching workout history:', error)
          set({ isLoading: false })
        }
      },

      startWorkout: (name: string) => {
        set({
          currentWorkout: {
            id: crypto.randomUUID(),
            name,
            date: new Date(),
            exercises: [],
            duration: 0,
            completed: false,
          },
        })
      },

      startWorkoutFromRoutine: (routine: WorkoutRoutine) => {
        const exercises: WorkoutExercise[] = routine.exercises.map((exercise) => ({
          id: crypto.randomUUID(),
          exerciseId: exercise.exerciseId,
          notes: exercise.notes,
          sets: Array.from({ length: exercise.sets }, () => ({
            id: crypto.randomUUID(),
            weight: 0,
            reps: exercise.reps,
            completed: false,
            restTime: exercise.restTime,
          })),
        }))

        set({
          currentWorkout: {
            id: crypto.randomUUID(),
            name: routine.name,
            date: new Date(),
            exercises,
            duration: 0,
            completed: false,
          },
        })
      },

      addExercise: (exercise) => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        const newExercise = {
          ...exercise,
          id: crypto.randomUUID(),
        }

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: [...currentWorkout.exercises, newExercise],
          },
        })
      },

      removeExercise: (exerciseId) => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.filter(
              (exercise) => exercise.id !== exerciseId
            ),
          },
        })
      },

      addSet: (exerciseId) => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                const lastSet = exercise.sets[exercise.sets.length - 1]
                return {
                  ...exercise,
                  sets: [
                    ...exercise.sets,
                    {
                      id: crypto.randomUUID(),
                      weight: lastSet?.weight || 0,
                      reps: lastSet?.reps || 0,
                      completed: false,
                      restTime: lastSet?.restTime || 90,
                    },
                  ],
                }
              }
              return exercise
            }),
          },
        })
      },

      removeSet: (exerciseId, setIndex) => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.filter((_, index) => index !== setIndex),
                }
              }
              return exercise
            }),
          },
        })
      },

      updateExerciseRestTime: (exerciseId, restTime) => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => ({
                    ...set,
                    restTime,
                  })),
                }
              }
              return exercise
            }),
          },
        })
      },

      updateSet: (exerciseId, setId, updates) => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map((exercise) =>
              exercise.id === exerciseId
                ? {
                    ...exercise,
                    sets: exercise.sets.map((set) =>
                      set.id === setId ? { ...set, ...updates } : set
                    ),
                  }
                : exercise
            ),
          },
        })
      },

      startTimer: (exerciseId, setId, duration) => {
        set({
          activeTimer: {
            exerciseId,
            setId,
            remainingTime: duration,
          },
        })
      },

      stopTimer: () => {
        set({ activeTimer: null })
      },

      completeWorkout: async () => {
        const currentWorkout = get().currentWorkout
        if (!currentWorkout) return

        const completedWorkout = {
          ...currentWorkout,
          completed: true,
          duration: Math.floor(
            (new Date().getTime() - new Date(currentWorkout.date).getTime()) / 60000
          ),
        }

        try {
          // Save to the database
          const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(completedWorkout),
          })

          if (!response.ok) throw new Error('Failed to save workout')
          const savedWorkout = await response.json()

          // Update local state
          set((state) => ({
            currentWorkout: null,
            workoutHistory: [savedWorkout, ...state.workoutHistory],
          }))
        } catch (error) {
          console.error('Error saving workout:', error)
          // Even if server save fails, update local state
          set((state) => ({
            currentWorkout: null,
            workoutHistory: [completedWorkout, ...state.workoutHistory],
          }))
        }
      },
      
      deleteWorkout: async (id) => {
        try {
          const response = await fetch(`/api/workouts/${id}`, {
            method: 'DELETE',
          })

          if (!response.ok) throw new Error('Failed to delete workout')
          
          // Update local state
          set((state) => ({
            workoutHistory: state.workoutHistory.filter(workout => workout.id !== id)
          }))
        } catch (error) {
          console.error('Error deleting workout:', error)
        }
      }
    }),
    {
      name: 'workout-storage',
    }
  )
) 