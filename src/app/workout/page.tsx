'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkoutStore } from '@/lib/store/workoutStore'
import WorkoutTracker from '@/components/workout/WorkoutTracker'
import WorkoutTimer from '@/components/workout/WorkoutTimer'
import { 
  ClockIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'

export default function WorkoutPage() {
  const router = useRouter()
  const { currentWorkout, startWorkout, completeWorkout } = useWorkoutStore()
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [workoutName, setWorkoutName] = useState('')

  const handleStartWorkout = (e: React.FormEvent) => {
    e.preventDefault()
    startWorkout(workoutName || 'My Workout')
  }

  const handleCompleteWorkout = () => {
    completeWorkout()
    router.push('/progress')
  }

  // Calculate workout duration
  const getWorkoutDuration = () => {
    if (!currentWorkout) return '0:00'
    const duration = Math.floor(
      (new Date().getTime() - new Date(currentWorkout.date).getTime()) / 1000
    )
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentWorkout) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Start New Workout</h1>
            <p className="text-gray-600 mb-6">Track your progress with GymFlow</p>
            <form onSubmit={handleStartWorkout} className="space-y-4">
              <div>
                <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Name
                </label>
                <input
                  type="text"
                  id="workoutName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="My Workout"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Start Workout
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentWorkout.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <ClockIcon className="h-4 w-4 mr-1" />
                {getWorkoutDuration()}
              </div>
            </div>
            <button
              onClick={() => setShowConfirmEnd(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              End Workout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <WorkoutTracker />
      </div>

      {/* Timer */}
      <WorkoutTimer />

      {/* End Workout Confirmation Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold">End Workout?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this workout? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteWorkout}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Complete Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 