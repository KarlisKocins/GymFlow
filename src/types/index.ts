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

export interface UserProgress {
  userId: string;
  workoutCount: number;
  totalDuration: number;
  streak: number;
  personalBests: {
    exerciseId: string;
    weight: number;
    reps: number;
    date: Date;
  }[];
} 