import { useState, useEffect } from 'react'
import { useWorkoutStore } from '@/lib/store/workoutStore'
import { useExerciseStore } from '@/lib/store/exerciseStore'
import type { Exercise } from '@/types'
import { format } from 'date-fns'
import { 
  PlusIcon, 
  XMarkIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  InformationCircleIcon,
  MinusIcon,
  AdjustmentsHorizontalIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'

// Define a mapping type between DB exercise and Exercise type used in this component
interface DBExercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
}

export default function WorkoutTracker() {
  const { 
    currentWorkout, 
    workoutHistory, 
    addExercise, 
    removeExercise,
    updateSet, 
    startTimer,
    addSet,
    removeSet,
    updateExerciseRestTime,
    stopTimer
  } = useWorkoutStore()
  const { exercises, exercisesByGroup, fetchExercises, isLoading } = useExerciseStore()
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [collapsedExercises, setCollapsedExercises] = useState<string[]>([])
  const [editingRestTime, setEditingRestTime] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  const getPreviousWorkoutData = (exerciseId: string) => {
    // Find the most recent workout that included this exercise
    const previousWorkout = workoutHistory
      .slice()
      .reverse()
      .find(workout => 
        workout.exercises.some(exercise => exercise.exerciseId === exerciseId)
      )

    if (!previousWorkout) return null

    const exerciseData = previousWorkout.exercises.find(
      exercise => exercise.exerciseId === exerciseId
    )

    if (!exerciseData) return null

    // Get the last completed set
    const lastCompletedSet = exerciseData.sets
      .filter(set => set.completed)
      .pop()

    return {
      date: previousWorkout.date,
      sets: exerciseData.sets,
      lastSet: lastCompletedSet
    }
  }

  const handleAddExercise = () => {
    if (!selectedExercise) return

    addExercise({
      exerciseId: selectedExercise.id,
      sets: [
        {
          id: crypto.randomUUID(),
          weight: 0,
          reps: 0,
          completed: false,
          restTime: 90,
        },
      ],
    })
    setSelectedExercise(null)
  }

  // Convert DB exercise to our component's Exercise type
  const mapToComponentExercise = (dbExercise: DBExercise): Exercise => {
    return {
      id: dbExercise.id,
      name: dbExercise.name,
      category: dbExercise.muscleGroup,
      targetMuscles: [dbExercise.muscleGroup], // Using muscleGroup as targetMuscle as a simplification
    };
  };

  const handleSetComplete = (exerciseId: string, setId: string, restTime: number) => {
    updateSet(exerciseId, setId, { completed: true })
    startTimer(exerciseId, setId, restTime)
  }

  const handleUndoComplete = (exerciseId: string, setId: string) => {
    updateSet(exerciseId, setId, { completed: false })
    stopTimer() // Stop the rest timer if it's running
  }

  const handleUpdateRestTime = (exerciseId: string, newRestTime: number) => {
    updateExerciseRestTime(exerciseId, newRestTime)
    setEditingRestTime(null)
  }

  const toggleExerciseCollapse = (exerciseId: string) => {
    setCollapsedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!currentWorkout) return null

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedExercise?.id || ''}
            onChange={(e) => {
              const exerciseId = e.target.value;
              const foundExercise = exercises.find(ex => ex.id === exerciseId);
              if (foundExercise) {
                setSelectedExercise(mapToComponentExercise(foundExercise as DBExercise));
              }
            }}
            disabled={isLoading}
          >
            <option value="">Select an exercise</option>
            {Object.keys(exercisesByGroup).sort().map((groupName) => (
              <optgroup key={groupName} label={groupName}>
                {exercisesByGroup[groupName].map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            onClick={handleAddExercise}
            disabled={!selectedExercise || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        {isLoading && (
          <div className="mt-2 text-sm text-gray-500">Loading exercises...</div>
        )}
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {currentWorkout.exercises.map((exercise) => {
          const isCollapsed = collapsedExercises.includes(exercise.id)
          const completedSets = exercise.sets.filter((set) => set.completed).length
          const totalSets = exercise.sets.length
          const previousData = getPreviousWorkoutData(exercise.exerciseId)
          const exerciseDetails = exercises.find(ex => ex.id === exercise.exerciseId) as DBExercise | undefined

          return (
            <div key={exercise.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Exercise Header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExerciseCollapse(exercise.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isCollapsed ? (
                        <ChevronDownIcon className="h-5 w-5" />
                      ) : (
                        <ChevronUpIcon className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {exerciseDetails ? exerciseDetails.name : exercise.exerciseId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {completedSets} of {totalSets} sets completed
                        {exerciseDetails?.muscleGroup && (
                          <span className="ml-2 text-xs text-gray-400">
                            {exerciseDetails.muscleGroup}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Rest Time Button */}
                    <button
                      onClick={() => setEditingRestTime(exercise.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      title="Change rest time"
                    >
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </button>
                    {/* Add Set Button */}
                    <button
                      onClick={() => addSet(exercise.id)}
                      className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Add set"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                    {/* Remove Exercise Button */}
                    <button
                      onClick={() => setShowDeleteConfirm(exercise.id)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                      title="Remove exercise"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === exercise.id && (
                  <div className="mt-3 flex items-center justify-between p-3 bg-red-50 rounded-md">
                    <p className="text-sm text-red-600">Remove this exercise and all its sets?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          removeExercise(exercise.id)
                          setShowDeleteConfirm(null)
                        }}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Rest Time Editor */}
                {editingRestTime === exercise.id && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Rest Time: {formatTime(exercise.sets[0].restTime)}</span>
                      <button
                        onClick={() => setEditingRestTime(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={300}
                        step={15}
                        value={exercise.sets[0].restTime}
                        onChange={(e) => handleUpdateRestTime(exercise.id, Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex gap-2 text-xs text-gray-500">
                        <button
                          onClick={() => handleUpdateRestTime(exercise.id, 30)}
                          className={`px-2 py-1 rounded ${
                            exercise.sets[0].restTime === 30 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          30s
                        </button>
                        <button
                          onClick={() => handleUpdateRestTime(exercise.id, 60)}
                          className={`px-2 py-1 rounded ${
                            exercise.sets[0].restTime === 60 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          1:00
                        </button>
                        <button
                          onClick={() => handleUpdateRestTime(exercise.id, 90)}
                          className={`px-2 py-1 rounded ${
                            exercise.sets[0].restTime === 90 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          1:30
                        </button>
                        <button
                          onClick={() => handleUpdateRestTime(exercise.id, 120)}
                          className={`px-2 py-1 rounded ${
                            exercise.sets[0].restTime === 120 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          2:00
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 px-1">
                      <span>0:00</span>
                      <span>1:00</span>
                      <span>2:00</span>
                      <span>3:00</span>
                      <span>4:00</span>
                      <span>5:00</span>
                    </div>
                  </div>
                )}

                {/* Previous Workout Info */}
                {previousData && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <InformationCircleIcon className="h-4 w-4" />
                    <span>
                      Last workout ({format(new Date(previousData.date), 'MMM d')}):
                      {previousData.lastSet && (
                        <span className="font-medium">
                          {' '}
                          {previousData.lastSet.weight}kg × {previousData.lastSet.reps} reps
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Sets */}
              {!isCollapsed && (
                <div className="p-4">
                  <div className="space-y-3">
                    {exercise.sets.map((set, index) => (
                      <div
                        key={set.id}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          set.completed ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <span className="w-8 text-center text-gray-500 font-medium">
                          #{index + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) =>
                                updateSet(exercise.id, set.id, {
                                  weight: Number(e.target.value),
                                })
                              }
                              className="w-full px-3 py-1 border border-gray-300 rounded-md"
                              disabled={set.completed}
                            />
                            {previousData && index < previousData.sets.length && (
                              <div className="text-xs text-gray-500 mt-1">
                                Previous: {previousData.sets[index].weight}kg
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) =>
                                updateSet(exercise.id, set.id, {
                                  reps: Number(e.target.value),
                                })
                              }
                              className="w-full px-3 py-1 border border-gray-300 rounded-md"
                              disabled={set.completed}
                            />
                            {previousData && index < previousData.sets.length && (
                              <div className="text-xs text-gray-500 mt-1">
                                Previous: {previousData.sets[index].reps} reps
                              </div>
                            )}
                          </div>
                          <div className="col-span-2 flex items-end gap-2">
                            {!set.completed ? (
                              <>
                                <button
                                  onClick={() => handleSetComplete(exercise.id, set.id, set.restTime)}
                                  className="flex-1 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                  Complete
                                </button>
                                {/* Remove Set Button */}
                                {exercise.sets.length > 1 && (
                                  <button
                                    onClick={() => removeSet(exercise.id, index)}
                                    className="px-2 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                                    title="Remove set"
                                  >
                                    <MinusIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className="flex-1 flex items-center">
                                <div className="flex-1 flex items-center justify-center text-green-600 gap-1">
                                  <CheckIcon className="h-4 w-4" />
                                  Completed
                                </div>
                                <button
                                  onClick={() => handleUndoComplete(exercise.id, set.id)}
                                  className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
                                  title="Undo completion"
                                >
                                  <ArrowUturnLeftIcon className="h-4 w-4" />
                                  Undo
                                </button>
                              </div>
                            )}
                            <div className="flex items-center text-gray-500 gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {set.restTime}s
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 