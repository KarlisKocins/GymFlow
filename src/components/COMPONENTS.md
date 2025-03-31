# Components Documentation

This directory contains reusable React components used throughout the GymApp application.

## Directory Structure

- `/workout/` - Components related to workout tracking and management
- `/progress/` - Components related to visualizing progress and statistics

## Main Components

### Workout Components

#### WorkoutTracker
The main component for tracking an active workout. Allows users to:
- Add exercises from a comprehensive exercise library
- Track sets, reps, and weights
- Mark sets as complete
- Manage rest times between sets
- View previous workout data

Usage:
```tsx
import { WorkoutTracker } from '@/components';

export default function WorkoutPage() {
  return (
    <div>
      <WorkoutTracker />
    </div>
  );
}
```

#### WorkoutTimer
A countdown timer component for rest periods between exercise sets. Features:
- Circular progress bar visualization
- Automatic sound notification when timer ends
- Close button to cancel the timer

Usage:
```tsx
import { WorkoutTimer } from '@/components';

export default function WorkoutPage() {
  return (
    <div>
      <WorkoutTimer />
    </div>
  );
}
```

### Progress Components

#### WorkoutCharts
Visualizes workout data with various charts:
- Workout frequency by day/week
- Exercise distribution
- Duration trends

Usage:
```tsx
import { WorkoutCharts } from '@/components';

export default function ProgressPage() {
  return (
    <div>
      <WorkoutCharts workouts={workouts} selectedPeriod="week" />
    </div>
  );
}
```

## Best Practices

1. **Component Structure**:
   - Use functional components with React hooks
   - Keep components focused on a single responsibility
   - Extract complex logic to custom hooks

2. **State Management**:
   - Use Zustand stores for global state
   - Keep component state local when possible

3. **Styling**:
   - Use Tailwind CSS for consistent styling
   - Follow the project's color scheme and design patterns

4. **Performance**:
   - Memoize expensive calculations with useMemo
   - Prevent unnecessary re-renders with useCallback
   - Use the React DevTools profiler to identify bottlenecks 