'use client'

import Link from 'next/link'
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to GymFlow</h1>
          <p className="text-lg text-gray-600">
            Track your workouts, follow routines, and achieve your fitness goals
          </p>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Start Workout */}
          <Link
            href="/workout"
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center group"
          >
            <div className="bg-blue-100 rounded-full p-4 mb-4 group-hover:bg-blue-200 transition-colors">
              <PlayIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Start Empty Workout</h2>
            <p className="text-gray-600">Begin a new workout session</p>
          </Link>

          {/* Routines */}
          <Link
            href="/routines"
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center group"
          >
            <div className="bg-green-100 rounded-full p-4 mb-4 group-hover:bg-green-200 transition-colors">
              <ClipboardDocumentListIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Routines</h2>
            <p className="text-gray-600">Browse and create workout routines</p>
          </Link>

          {/* Progress */}
          <Link
            href="/progress"
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center group"
          >
            <div className="bg-purple-100 rounded-full p-4 mb-4 group-hover:bg-purple-200 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Progress</h2>
            <p className="text-gray-600">Track your fitness journey</p>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose GymFlow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Smart Workout Tracking</h3>
              <p className="text-gray-600">Automatically track sets, reps, and rest times with our intuitive interface</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Pre-made Routines</h3>
              <p className="text-gray-600">Access professionally designed workout routines or create your own</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Progress Analytics</h3>
              <p className="text-gray-600">Visualize your progress with detailed charts and statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 