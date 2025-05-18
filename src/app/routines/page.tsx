'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRoutineStore } from '@/lib/store/routineStore'
import {
  ClockIcon,
  FireIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

export default function RoutinesPage() {
  const router = useRouter()
  const { routines, deleteRoutine, fetchRoutines, isLoading } = useRoutineStore()
  const [filter, setFilter] = useState<string>('all')
  
  // Fetch routines when the component mounts
  useEffect(() => {
    fetchRoutines()
  }, [fetchRoutines])

  const filteredRoutines = routines.filter((routine) => {
    if (filter === 'all') return true
    if (filter === 'custom') return routine.isCustom
    return routine.category === filter
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GymFlow Routines</h1>
            <p className="text-gray-600 mt-1">Choose or create your perfect workout routine</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Dashboard
            </button>
            <Link
              href="/routines/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              Create Routine
            </Link>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            {(['all', 'strength', 'hiit', 'core', 'custom'] as const).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === category
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && routines.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No routines found.</p>
            <Link 
              href="/routines/create" 
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Your First Routine
            </Link>
          </div>
        )}

        {/* Routines Grid */}
        {!isLoading && filteredRoutines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((routine) => (
              <div
                key={routine.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-2">{routine.name}</h3>
                    {routine.isCustom && (
                      <button
                        onClick={() => deleteRoutine(routine.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{routine.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {routine.estimatedDuration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <FireIcon className="h-4 w-4" />
                      {routine.difficulty}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {routine.exercises.slice(0, 3).map((exercise) => (
                      <div
                        key={exercise.exerciseId}
                        className="text-sm text-gray-600"
                      >
                        • {exercise.name} ({exercise.sets} × {exercise.reps})
                      </div>
                    ))}
                    {routine.exercises.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{routine.exercises.length - 3} more exercises
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => router.push(`/routines/${routine.id}`)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Start Workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 