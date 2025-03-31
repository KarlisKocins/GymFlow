/**
 * Types related to workout routines
 */

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedDuration: number; // in minutes
  targetMuscleGroups: string[];
  exercises: RoutineExercise[];
  createdAt: Date;
  updatedAt: Date;
  isCustom: boolean;
}

export interface RoutineExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  notes?: string;
} 