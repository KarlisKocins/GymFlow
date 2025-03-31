'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRoutineStore } from '@/lib/store/routineStore'
import type { RoutineExercise } from '@/types'
import { PlusIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function CreateRoutinePage() {
  const router = useRouter()
  const { addRoutine } = useRoutineStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [category, setCategory] = useState('strength')
  const [estimatedDuration, setEstimatedDuration] = useState(45)
  const [targetMuscleGroups, setTargetMuscleGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<RoutineExercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState('')

  const handleAddExercise = () => {
    if (!selectedExercise) return

    const select = document.querySelector<HTMLSelectElement>('select[name="exercise-select"]')
    const exerciseName = select?.selectedOptions[0]?.textContent || selectedExercise

    setExercises([
      ...exercises,
      {
        exerciseId: selectedExercise,
        name: exerciseName,
        sets: 3,
        reps: 10,
        restTime: 90,
      },
    ])
    setSelectedExercise('')
  }

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index: number, updates: Partial<RoutineExercise>) => {
    setExercises(
      exercises.map((exercise, i) =>
        i === index ? { ...exercise, ...updates } : exercise
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || exercises.length === 0) return

    addRoutine({
      name,
      description,
      difficulty,
      category,
      estimatedDuration,
      targetMuscleGroups,
      exercises,
      isCustom: true,
    })

    router.push('/routines')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Routine</h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Routine Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="hiit">HIIT</option>
                    <option value="flexibility">Flexibility</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  min={1}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Exercises */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Exercises</h2>
                <div className="flex gap-4 items-center">
                  <select
                    name="exercise-select"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select an exercise</option>
                    {/* Chest */}
                    <optgroup label="Chest">
                      <option value="bench-press">Bench Press</option>
                      <option value="incline-bench-press">Incline Bench Press</option>
                      <option value="decline-bench-press">Decline Bench Press</option>
                      <option value="dumbbell-press">Dumbbell Press</option>
                      <option value="incline-dumbbell-press">Incline Dumbbell Press</option>
                      <option value="chest-dips">Chest Dips</option>
                      <option value="cable-flyes">Cable Flyes</option>
                      <option value="dumbbell-flyes">Dumbbell Flyes</option>
                      <option value="push-ups">Push-ups</option>
                    </optgroup>
                    {/* Back */}
                    <optgroup label="Back">
                      <option value="pull-ups">Pull-ups</option>
                      <option value="lat-pulldowns">Lat Pulldowns</option>
                      <option value="barbell-rows">Barbell Rows</option>
                      <option value="dumbbell-rows">Dumbbell Rows</option>
                      <option value="face-pulls">Face Pulls</option>
                      <option value="deadlift">Deadlift</option>
                    </optgroup>
                    {/* Legs */}
                    <optgroup label="Legs">
                      <option value="squats">Squats</option>
                      <option value="leg-press">Leg Press</option>
                      <option value="lunges">Lunges</option>
                      <option value="leg-extensions">Leg Extensions</option>
                      <option value="leg-curls">Leg Curls</option>
                      <option value="calf-raises">Calf Raises</option>
                    </optgroup>
                    {/* Shoulders */}
                    <optgroup label="Shoulders">
                      <option value="overhead-press">Overhead Press</option>
                      <option value="lateral-raises">Lateral Raises</option>
                      <option value="front-raises">Front Raises</option>
                      <option value="reverse-flyes">Reverse Flyes</option>
                    </optgroup>
                    {/* Arms */}
                    <optgroup label="Arms">
                      <option value="bicep-curls">Bicep Curls</option>
                      <option value="hammer-curls">Hammer Curls</option>
                      <option value="tricep-pushdowns">Tricep Pushdowns</option>
                      <option value="skull-crushers">Skull Crushers</option>
                    </optgroup>
                    {/* Core */}
                    <optgroup label="Core">
                      <option value="crunches">Crunches</option>
                      <option value="planks">Planks</option>
                      <option value="russian-twists">Russian Twists</option>
                      <option value="leg-raises">Leg Raises</option>
                    </optgroup>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    disabled={!selectedExercise}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Exercise
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {exercises.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="bg-gray-50 rounded-lg p-6 relative">
                    <div className="flex justify-between items-start mb-6">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseChange(index, { name: e.target.value })
                        }
                        placeholder="Exercise Name"
                        className="text-lg font-medium bg-transparent border-none focus:ring-0 placeholder-gray-400 w-full"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sets</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) =>
                            handleExerciseChange(index, {
                              sets: Number(e.target.value),
                            })
                          }
                          min={1}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reps</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) =>
                            handleExerciseChange(index, {
                              reps: Number(e.target.value),
                            })
                          }
                          min={1}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rest Time (seconds)
                        </label>
                        <input
                          type="number"
                          value={exercise.restTime}
                          onChange={(e) =>
                            handleExerciseChange(index, {
                              restTime: Number(e.target.value),
                            })
                          }
                          min={0}
                          step={15}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <input
                        type="text"
                        value={exercise.notes || ''}
                        onChange={(e) =>
                          handleExerciseChange(index, { notes: e.target.value })
                        }
                        placeholder="Optional notes or instructions"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ))}

                {exercises.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No exercises added yet. Select an exercise from the dropdown and click "Add Exercise" to get started.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!name || exercises.length === 0}
                >
                  Create Routine
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 