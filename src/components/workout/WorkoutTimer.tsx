import { useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useWorkoutStore } from '@/lib/store/workoutStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function WorkoutTimer() {
  const { activeTimer, stopTimer } = useWorkoutStore()
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!activeTimer) return

    setTimeLeft(activeTimer.remainingTime)
    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(interval)
          stopTimer()
          // Play sound
          new Audio('/timer-end.mp3').play().catch(() => {})
          return 0
        }
        return time - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTimer, stopTimer])

  if (!activeTimer) return null

  const percentage = (timeLeft / activeTimer.remainingTime) * 100

  return (
    <div className="fixed bottom-0 right-0 left-0 md:left-auto md:bottom-4 md:right-4 bg-white md:bg-transparent shadow-lg md:shadow-none z-50">
      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex-1 mr-3">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{timeLeft}s</span>
            <button
              onClick={stopTimer}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Cancel timer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="w-32 h-32">
          <div className="relative">
            <CircularProgressbar
              value={percentage}
              text={`${timeLeft}s`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: `rgb(59, 130, 246)`,
                textColor: '#1a1a1a',
                trailColor: '#d6d6d6',
              })}
            />
            <button
              onClick={stopTimer}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
              title="Cancel timer"
            >
              <XMarkIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 