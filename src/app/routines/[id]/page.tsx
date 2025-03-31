'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRoutineStore } from '@/lib/store/routineStore'
import { useWorkoutStore } from '@/lib/store/workoutStore'
import {
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

export default function RoutineDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { routines } = useRoutineStore()
  const { startWorkoutFromRoutine } = useWorkoutStore()

  const routine = routines.find((r) => r.id === params.id)

  useEffect(() => {
    if (!routine) {
      router.push('/routines')
    }
  }, [routine, router])

  if (!routine) return null

  const handleStartWorkout = () => {
    startWorkoutFromRoutine(routine)
    router.push('/workout')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{routine.name}</h1>
            <p className="text-gray-600 mt-1">{routine.description}</p>
          </div>
          <button
            onClick={() => router.push('/routines')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow hover:shadow-md transition-all"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Routines
          </button>
        </div>

        {/* Routine Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span>{routine.estimatedDuration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FireIcon className="h-5 w-5" />
              <span className="capitalize">{routine.difficulty} Level</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ChartBarIcon className="h-5 w-5" />
              <span>{routine.exercises.length} Exercises</span>
            </div>
          </div>

          {/* Target Muscles */}
          {routine.targetMuscleGroups && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Target Muscle Groups</h3>
              <div className="flex flex-wrap gap-2">
                {routine.targetMuscleGroups.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Exercise List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Exercises</h3>
            {routine.exercises.map((exercise, index) => (
              <div
                key={exercise.exerciseId}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">#{index + 1}</span>
                    <h4 className="font-medium">{exercise.name}</h4>
                  </div>
                  <div className="text-sm text-gray-600">
                    {exercise.sets} × {exercise.reps} reps
                  </div>
                </div>
                {exercise.notes && (
                  <p className="text-sm text-gray-600 mt-1">{exercise.notes}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>{exercise.restTime}s rest</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartWorkout}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <ChartBarIcon className="h-5 w-5" />
          Start Workout
        </button>
      </div>
    </div>
  )
} 