/**
 * Central export file for all components
 * This simplifies imports by allowing: 
 * import { ComponentName } from '@/components'
 */

// Workout components
export { default as WorkoutTracker } from './workout/WorkoutTracker';
export { default as WorkoutTimer } from './workout/WorkoutTimer';

// Progress components
export { default as WorkoutCharts } from './progress/WorkoutCharts';

// Page components
export { default as HomePage } from '@/app/page';
export { default as DashboardPage } from '@/app/dashboard/page';
export { default as ProgressPage } from '@/app/progress/page';
export { default as WorkoutPage } from '@/app/workout/page';
export { default as RoutinesPage } from '@/app/routines/page';

// Layout components
export { default as RootLayout } from '@/app/layout'; 