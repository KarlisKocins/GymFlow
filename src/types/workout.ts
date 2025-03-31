/**
 * Types related to workout tracking and exercise management
 */

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description?: string;
  targetMuscles: string[];
  equipment?: string[];
}

export interface Set {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  restTime: number; // in seconds
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration: number; // in minutes
  completed: boolean;
} 