'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkoutStore } from '@/lib/store/workoutStore'
import WorkoutCharts from '@/components/progress/WorkoutCharts'
import {
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  CalendarIcon,
  TrophyIcon,
  ArrowLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'

export default function ProgressPage() {
  const router = useRouter()
  const { workoutHistory, fetchWorkoutHistory, isLoading, deleteWorkout } = useWorkoutStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week')

  // Fetch workout history when the component mounts
  useEffect(() => {
    fetchWorkoutHistory()
  }, [fetchWorkoutHistory])

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date()
    const filteredWorkouts = workoutHistory.filter((workout) => {
      if (selectedPeriod === 'week') {
        const weekStart = startOfWeek(now)
        const weekEnd = endOfWeek(now)
        return isWithinInterval(new Date(workout.date), { start: weekStart, end: weekEnd })
      }
      if (selectedPeriod === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return isWithinInterval(new Date(workout.date), { start: monthStart, end: monthEnd })
      }
      return true
    })

    const totalWorkouts = filteredWorkouts.length
    const totalDuration = filteredWorkouts.reduce((acc, workout) => acc + workout.duration, 0)
    const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

    // Calculate streak
    let currentStreak = 0
    let maxStreak = 0
    let tempStreak = 0
    const sortedDates = Array.from(
      new Set(workoutHistory.map(w => format(new Date(w.date), 'yyyy-MM-dd')))
    ).sort()
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0 || 
          parseISO(sortedDates[i]).getTime() - parseISO(sortedDates[i-1]).getTime() === 86400000) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
        if (i === sortedDates.length - 1 && 
            new Date().getTime() - parseISO(sortedDates[i]).getTime() <= 86400000) {
          currentStreak = tempStreak
        }
      } else {
        tempStreak = 1
        if (i === sortedDates.length - 1 && 
            new Date().getTime() - parseISO(sortedDates[i]).getTime() <= 86400000) {
          currentStreak = 1
        }
      }
    }

    return {
      totalWorkouts,
      totalDuration,
      averageDuration,
      currentStreak,
      maxStreak,
    }
  }

  const stats = calculateStats()

  // Handle workout deletion
  const handleDeleteWorkout = async (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      await deleteWorkout(id)
    }
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GymFlow Progress</h1>
            <p className="text-gray-600 mt-1">Track your fitness journey</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow hover:shadow-md transition-all"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Time Period Selector */}
        <div className="mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            {(['week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-medium">Total Workouts</h3>
                </div>
                <p className="text-3xl font-bold">{stats.totalWorkouts}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-medium">Total Time</h3>
                </div>
                <p className="text-3xl font-bold">{Math.round(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FireIcon className="h-6 w-6 text-orange-500" />
                  <h3 className="text-lg font-medium">Current Streak</h3>
                </div>
                <p className="text-3xl font-bold">{stats.currentStreak} days</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrophyIcon className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-medium">Best Streak</h3>
                </div>
                <p className="text-3xl font-bold">{stats.maxStreak} days</p>
              </div>
            </div>

            {/* Charts */}
            {workoutHistory.length > 0 && (
              <WorkoutCharts workouts={workoutHistory} selectedPeriod={selectedPeriod} />
            )}

            {/* Workout History */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Workout History</h2>
              </div>
              <div className="divide-y">
                {workoutHistory.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No workouts recorded yet. Start your fitness journey today!
                  </div>
                ) : (
                  workoutHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((workout) => (
                      <div key={workout.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <h3 className="font-medium">{workout.name}</h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {format(new Date(workout.date), 'MMM d, yyyy • h:mm a')}
                            </span>
                            <button 
                              onClick={() => handleDeleteWorkout(workout.id)}
                              className="text-gray-400 hover:text-red-500"
                              title="Delete workout"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {workout.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <ChartBarIcon className="h-4 w-4" />
                            {workout.exercises.length} exercises
                          </div>
                          <div className="flex items-center gap-1">
                            <FireIcon className="h-4 w-4" />
                            {workout.exercises.reduce(
                              (acc, exercise) => acc + exercise.sets.filter((set) => set.completed).length,
                              0
                            )}{' '}
                            sets completed
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 