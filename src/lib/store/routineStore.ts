import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutRoutine, RoutineExercise } from '@/types'

interface RoutineStore {
  routines: WorkoutRoutine[]
  selectedRoutine: WorkoutRoutine | null
  // Actions
  addRoutine: (routine: Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRoutine: (id: string, updates: Partial<WorkoutRoutine>) => void
  deleteRoutine: (id: string) => void
  selectRoutine: (id: string) => void
}

// Sample pre-made routines
const defaultRoutines: WorkoutRoutine[] = [
  {
    id: 'ppl-push',
    name: 'Push Day (PPL)',
    description: 'Focus on chest, shoulders, and triceps. Part of the Push/Pull/Legs split.',
    difficulty: 'intermediate',
    category: 'strength',
    estimatedDuration: 60,
    targetMuscleGroups: ['chest', 'shoulders', 'triceps'],
    exercises: [
      {
        exerciseId: 'bench-press',
        name: 'Barbell Bench Press',
        sets: 4,
        reps: 8,
        restTime: 120,
        notes: 'Focus on controlled movement and full range of motion',
      },
      {
        exerciseId: 'overhead-press',
        name: 'Overhead Press',
        sets: 4,
        reps: 8,
        restTime: 120,
        notes: 'Keep core tight and avoid arching back',
      },
      {
        exerciseId: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        sets: 3,
        reps: 10,
        restTime: 90,
      },
      {
        exerciseId: 'lateral-raises',
        name: 'Lateral Raises',
        sets: 3,
        reps: 12,
        restTime: 60,
      },
      {
        exerciseId: 'tricep-pushdowns',
        name: 'Tricep Pushdowns',
        sets: 3,
        reps: 12,
        restTime: 60,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'ppl-pull',
    name: 'Pull Day (PPL)',
    description: 'Focus on back and biceps. Part of the Push/Pull/Legs split.',
    difficulty: 'intermediate',
    category: 'strength',
    estimatedDuration: 60,
    targetMuscleGroups: ['back', 'biceps', 'rear-delts'],
    exercises: [
      {
        exerciseId: 'barbell-rows',
        name: 'Barbell Rows',
        sets: 4,
        reps: 8,
        restTime: 120,
        notes: 'Keep back straight and pull to lower chest',
      },
      {
        exerciseId: 'pull-ups',
        name: 'Pull-ups',
        sets: 4,
        reps: 8,
        restTime: 120,
        notes: 'Use assisted machine if needed',
      },
      {
        exerciseId: 'face-pulls',
        name: 'Face Pulls',
        sets: 3,
        reps: 15,
        restTime: 60,
        notes: 'Focus on rear delts and external rotation',
      },
      {
        exerciseId: 'bicep-curls',
        name: 'Barbell Bicep Curls',
        sets: 3,
        reps: 12,
        restTime: 60,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'ppl-legs',
    name: 'Leg Day (PPL)',
    description: 'Focus on legs and core. Part of the Push/Pull/Legs split.',
    difficulty: 'intermediate',
    category: 'strength',
    estimatedDuration: 60,
    targetMuscleGroups: ['quads', 'hamstrings', 'calves', 'core'],
    exercises: [
      {
        exerciseId: 'squats',
        name: 'Barbell Squats',
        sets: 4,
        reps: 8,
        restTime: 180,
        notes: 'Focus on depth and keep chest up',
      },
      {
        exerciseId: 'romanian-deadlifts',
        name: 'Romanian Deadlifts',
        sets: 4,
        reps: 10,
        restTime: 120,
        notes: 'Focus on hamstring stretch and hip hinge',
      },
      {
        exerciseId: 'leg-press',
        name: 'Leg Press',
        sets: 3,
        reps: 12,
        restTime: 90,
      },
      {
        exerciseId: 'calf-raises',
        name: 'Standing Calf Raises',
        sets: 4,
        reps: 15,
        restTime: 60,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'upper-body',
    name: 'Upper Body Power',
    description: 'Upper body focused workout for building strength and muscle.',
    difficulty: 'intermediate',
    category: 'strength',
    estimatedDuration: 50,
    targetMuscleGroups: ['chest', 'back', 'shoulders', 'arms'],
    exercises: [
      {
        exerciseId: 'bench-press',
        name: 'Bench Press',
        sets: 5,
        reps: 5,
        restTime: 180,
        notes: 'Focus on power and form',
      },
      {
        exerciseId: 'rows',
        name: 'Barbell Rows',
        sets: 4,
        reps: 8,
        restTime: 120,
      },
      {
        exerciseId: 'overhead-press',
        name: 'Military Press',
        sets: 3,
        reps: 8,
        restTime: 120,
      },
      {
        exerciseId: 'dips',
        name: 'Dips',
        sets: 3,
        reps: 10,
        restTime: 90,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'full-body-hiit',
    name: 'Full Body HIIT',
    description: 'High-intensity interval training combining strength and cardio.',
    difficulty: 'advanced',
    category: 'hiit',
    estimatedDuration: 30,
    targetMuscleGroups: ['full-body'],
    exercises: [
      {
        exerciseId: 'burpees',
        name: 'Burpees',
        sets: 4,
        reps: 15,
        restTime: 30,
        notes: 'Perform as quickly as possible with good form',
      },
      {
        exerciseId: 'kettlebell-swings',
        name: 'Kettlebell Swings',
        sets: 4,
        reps: 20,
        restTime: 30,
        notes: 'Focus on hip hinge and explosive movement',
      },
      {
        exerciseId: 'thrusters',
        name: 'Dumbbell Thrusters',
        sets: 4,
        reps: 12,
        restTime: 30,
        notes: 'Combine squat and overhead press',
      },
      {
        exerciseId: 'mountain-climbers',
        name: 'Mountain Climbers',
        sets: 4,
        reps: 30,
        restTime: 30,
        notes: '30 reps total (15 each leg)',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'core-blast',
    name: 'Core & Abs Blast',
    description: 'Focused core workout to build strength and definition.',
    difficulty: 'beginner',
    category: 'core',
    estimatedDuration: 25,
    targetMuscleGroups: ['abs', 'obliques', 'lower-back'],
    exercises: [
      {
        exerciseId: 'plank',
        name: 'Plank Hold',
        sets: 3,
        reps: 60,
        restTime: 45,
        notes: '60 seconds hold, maintain straight body',
      },
      {
        exerciseId: 'crunches',
        name: 'Bicycle Crunches',
        sets: 3,
        reps: 30,
        restTime: 45,
        notes: '30 reps total (15 each side)',
      },
      {
        exerciseId: 'russian-twists',
        name: 'Russian Twists',
        sets: 3,
        reps: 20,
        restTime: 45,
        notes: '20 reps total (10 each side)',
      },
      {
        exerciseId: 'leg-raises',
        name: 'Lying Leg Raises',
        sets: 3,
        reps: 15,
        restTime: 45,
        notes: 'Keep lower back pressed against floor',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'mobility-recovery',
    name: 'Mobility & Recovery',
    description: 'Improve flexibility and aid in recovery with mobility work.',
    difficulty: 'beginner',
    category: 'flexibility',
    estimatedDuration: 30,
    targetMuscleGroups: ['full-body'],
    exercises: [
      {
        exerciseId: 'world-greatest-stretch',
        name: 'World\'s Greatest Stretch',
        sets: 2,
        reps: 10,
        restTime: 30,
        notes: '10 reps each side, move slowly and deliberately',
      },
      {
        exerciseId: 'cat-cow',
        name: 'Cat-Cow Stretch',
        sets: 2,
        reps: 20,
        restTime: 30,
        notes: '20 total movements, flow between positions',
      },
      {
        exerciseId: 'hip-flexor-stretch',
        name: 'Hip Flexor Stretch',
        sets: 3,
        reps: 30,
        restTime: 30,
        notes: 'Hold for 30 seconds each side',
      },
      {
        exerciseId: 'foam-rolling',
        name: 'Foam Rolling',
        sets: 1,
        reps: 60,
        restTime: 0,
        notes: 'Roll each major muscle group for 60 seconds',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'back-biceps-blast',
    name: 'Back & Biceps Blast',
    description: 'Complete back and biceps workout focusing on width, thickness, and arm development.',
    difficulty: 'intermediate',
    category: 'strength',
    estimatedDuration: 65,
    targetMuscleGroups: ['back', 'biceps', 'forearms'],
    exercises: [
      {
        exerciseId: 'lat-pulldowns',
        name: 'Wide-Grip Lat Pulldowns',
        sets: 4,
        reps: 12,
        restTime: 90,
        notes: 'Focus on feeling your lats stretch at the top, pull to upper chest',
      },
      {
        exerciseId: 'bent-over-rows',
        name: 'Barbell Bent-Over Rows',
        sets: 4,
        reps: 10,
        restTime: 120,
        notes: 'Keep back straight at 45 degrees, pull to lower chest',
      },
      {
        exerciseId: 'seated-cable-rows',
        name: 'Seated Cable Rows',
        sets: 3,
        reps: 12,
        restTime: 90,
        notes: 'Squeeze shoulder blades together, maintain upright posture',
      },
      {
        exerciseId: 'single-arm-rows',
        name: 'Single-Arm Dumbbell Rows',
        sets: 3,
        reps: 12,
        restTime: 60,
        notes: 'Keep back parallel to ground, focus on full range of motion',
      },
      {
        exerciseId: 'barbell-curls',
        name: 'Standing Barbell Curls',
        sets: 4,
        reps: 10,
        restTime: 90,
        notes: 'Keep elbows at sides, focus on controlled movement',
      },
      {
        exerciseId: 'hammer-curls',
        name: 'Hammer Curls',
        sets: 3,
        reps: 12,
        restTime: 60,
        notes: 'Works brachialis and forearms, alternate arms',
      },
      {
        exerciseId: 'preacher-curls',
        name: 'Preacher Curls',
        sets: 3,
        reps: 12,
        restTime: 60,
        notes: 'Focus on peak contraction, slow negative',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  },
  {
    id: 'chest-triceps-pump',
    name: 'Chest & Triceps Pump',
    description: 'Comprehensive chest and triceps workout for strength and definition.',
    difficulty: 'intermediate',
    category: 'strength',
    estimatedDuration: 60,
    targetMuscleGroups: ['chest', 'triceps', 'front-delts'],
    exercises: [
      {
        exerciseId: 'flat-bench-press',
        name: 'Flat Barbell Bench Press',
        sets: 4,
        reps: 8,
        restTime: 120,
        notes: 'Retract shoulder blades, touch bar to mid-chest',
      },
      {
        exerciseId: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        sets: 4,
        reps: 10,
        restTime: 90,
        notes: 'Bench at 30-45 degrees, focus on upper chest',
      },
      {
        exerciseId: 'cable-flyes',
        name: 'Cable Flyes',
        sets: 3,
        reps: 12,
        restTime: 60,
        notes: 'Slight bend in elbows, focus on chest stretch',
      },
      {
        exerciseId: 'dips',
        name: 'Chest Dips',
        sets: 3,
        reps: 12,
        restTime: 90,
        notes: 'Lean forward for chest emphasis, control the descent',
      },
      {
        exerciseId: 'skull-crushers',
        name: 'EZ Bar Skull Crushers',
        sets: 4,
        reps: 12,
        restTime: 90,
        notes: 'Keep upper arms vertical, lower to forehead',
      },
      {
        exerciseId: 'rope-pushdowns',
        name: 'Rope Tricep Pushdowns',
        sets: 3,
        reps: 15,
        restTime: 60,
        notes: 'Keep elbows at sides, spread rope at bottom',
      },
      {
        exerciseId: 'overhead-extension',
        name: 'Overhead Tricep Extension',
        sets: 3,
        reps: 12,
        restTime: 60,
        notes: 'Can use dumbbell or rope, focus on full extension',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
  }
]

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: defaultRoutines,
      selectedRoutine: null,

      addRoutine: (routine) => {
        const newRoutine: WorkoutRoutine = {
          ...routine,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          routines: [...state.routines, newRoutine],
        }))
      },

      updateRoutine: (id, updates) => {
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id
              ? {
                  ...routine,
                  ...updates,
                  updatedAt: new Date(),
                }
              : routine
          ),
        }))
      },

      deleteRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
          selectedRoutine:
            state.selectedRoutine?.id === id ? null : state.selectedRoutine,
        }))
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