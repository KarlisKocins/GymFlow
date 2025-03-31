# Types Documentation

This directory contains TypeScript types and interfaces used throughout the GymApp application.

## Directory Structure

- `index.ts` - Re-exports all types from the subdirectories
- `workout.ts` - Types related to workout tracking and exercises
- `routine.ts` - Types related to workout routines
- `progress.ts` - Types related to user progress and statistics

## Core Types

### Workout Types

#### Exercise
Represents a specific exercise that can be performed.

```typescript
interface Exercise {
  id: string;
  name: string;
  category: string;
  description?: string;
  targetMuscles: string[];
  equipment?: string[];
}
```

#### Set
Represents a single set of an exercise within a workout.

```typescript
interface Set {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  restTime: number; // in seconds
}
```

#### WorkoutExercise
Links an exercise to a specific workout with its sets.

```typescript
interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: Set[];
  notes?: string;
}
```

#### Workout
Represents a complete workout session.

```typescript
interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration: number; // in minutes
  completed: boolean;
}
```

### Routine Types

#### WorkoutRoutine
Represents a reusable workout template.

```typescript
interface WorkoutRoutine {
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
```

#### RoutineExercise
Defines an exercise within a routine template.

```typescript
interface RoutineExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  notes?: string;
}
```

### Progress Types

#### UserProgress
Tracks overall user progress metrics.

```typescript
interface UserProgress {
  userId: string;
  workoutCount: number;
  totalDuration: number;
  streak: number;
  personalBests: PersonalBest[];
}
```

#### PersonalBest
Records a user's best performance for a specific exercise.

```typescript
interface PersonalBest {
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date;
}
```

## Usage

Import types from the centralized index file:

```typescript
import { Workout, Exercise, WorkoutRoutine } from '@/types';

// Use the types
const myWorkout: Workout = {
  // ...workout properties
};
```

## Type Extensions

When adding new types:

1. Add the type to the appropriate file based on its domain
2. Ensure the type is properly exported
3. Add JSDoc comments to document the type's purpose and usage 