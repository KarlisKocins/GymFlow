import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { format, startOfWeek, eachDayOfInterval, subWeeks } from 'date-fns'
import type { Workout } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface WorkoutChartsProps {
  workouts: Workout[]
  selectedPeriod: 'week' | 'month' | 'all'
}

export default function WorkoutCharts({ workouts, selectedPeriod }: WorkoutChartsProps) {
  // Prepare data for workout duration over time
  const prepareDurationData = () => {
    const now = new Date()
    let dates: Date[]
    let dateFormat: string

    if (selectedPeriod === 'week') {
      dates = eachDayOfInterval({
        start: startOfWeek(now),
        end: now,
      })
      dateFormat = 'EEE'
    } else if (selectedPeriod === 'month') {
      dates = eachDayOfInterval({
        start: subWeeks(now, 4),
        end: now,
      })
      dateFormat = 'MMM d'
    } else {
      // For 'all', show last 30 days
      dates = eachDayOfInterval({
        start: subWeeks(now, 12),
        end: now,
      })
      dateFormat = 'MMM d'
    }

    const labels = dates.map(date => format(date, dateFormat))
    const data = dates.map(date => {
      const dayWorkouts = workouts.filter(
        workout => format(new Date(workout.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      return dayWorkouts.reduce((acc, workout) => acc + workout.duration, 0)
    })

    return { labels, data }
  }

  // Prepare data for exercises per workout
  const prepareExerciseData = () => {
    const recentWorkouts = workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .reverse()

    return {
      labels: recentWorkouts.map(w => format(new Date(w.date), 'MMM d')),
      data: recentWorkouts.map(w => w.exercises.length),
    }
  }

  const durationData = prepareDurationData()
  const exerciseData = prepareExerciseData()

  const durationChartData: ChartData<'line'> = {
    labels: durationData.labels,
    datasets: [
      {
        label: 'Workout Duration (minutes)',
        data: durationData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  }

  const exerciseChartData: ChartData<'bar'> = {
    labels: exerciseData.labels,
    datasets: [
      {
        label: 'Exercises per Workout',
        data: exerciseData.data,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Workout Duration Trend</h3>
        <div className="h-[300px]">
          <Line data={durationChartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Exercises per Workout</h3>
        <div className="h-[300px]">
          <Bar data={exerciseChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
} 