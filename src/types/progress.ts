/**
 * Types related to user progress and statistics
 */

export interface UserProgress {
  userId: string;
  workoutCount: number;
  totalDuration: number;
  streak: number;
  personalBests: PersonalBest[];
}

export interface PersonalBest {
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date;
} 