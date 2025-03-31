'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  // Example data for the progress chart
  const months = ['months', 'jan', 'feb', 'mar', 'apr']
  
  // Current month for calendar
  const [currentMonth] = useState('April 2024')
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo and auth buttons */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">GymFlow</h1>
        <div className="flex gap-2">
          <Link href="/dashboard" className="px-4 py-2 rounded border border-gray-300 font-medium">
            Log in
          </Link>
          <button className="px-4 py-2 rounded bg-blue-600 text-white font-medium">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-bold mb-4">Track your workouts with ease</h2>
        <p className="text-xl text-gray-700 mb-8">
          An easy-to-use gym workout tracker to log your exercises and monitor your progress.
        </p>
        <button className="px-8 py-4 bg-blue-600 text-white text-xl font-medium rounded-md">
          Get Started
        </button>
      </section>

      {/* Main features section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Log Workouts */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Log Workouts</h3>
          <div className="bg-white rounded-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Exercise</label>
              <div className="relative">
                <select className="w-full p-2 border border-gray-300 rounded appearance-none">
                  <option>Bench Press</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Sets</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="3"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Reps</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="10"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Weight</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="60"
                />
              </div>
            </div>
            
            <button className="w-full py-4 bg-blue-600 text-white font-medium rounded">
              Add Workout
            </button>
          </div>
        </div>
        
        {/* View Progress */}
        <div>
          <h3 className="text-2xl font-bold mb-4">View Progress</h3>
          <div className="bg-white rounded-md">
            <h4 className="font-medium mb-2">Progress Over Time</h4>
            <div className="h-48 relative overflow-hidden">
              {/* Simple line chart */}
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path
                  d="M0,50 L20,45 L40,35 L60,30 L80,20 L100,5"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              {months.map((month, i) => (
                <span key={i}>{month}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Build Routine */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Build Routine</h3>
          <div className="bg-white rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <button className="text-gray-400">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <h4 className="font-medium">{currentMonth}</h4>
              <button className="text-gray-400">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Days of week */}
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="py-1 font-medium">{day}</div>
              ))}
              
              {/* Calendar days */}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isToday = day === 24;
                return (
                  <div 
                    key={i} 
                    className={`py-1 ${isToday ? 'bg-blue-600 text-white rounded-full' : ''}`}
                  >
                    {day}
                  </div>
                );
              }).filter((_, i) => i < 30)} {/* Only show days in April */}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
