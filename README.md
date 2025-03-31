# GymFlow 💪

A modern, intuitive workout tracking application built with Next.js and TypeScript. Track your fitness journey, crush your goals! 🎯

## ✨ Features

- **Workout Tracking** 📝
  - Create and track custom workouts
  - Log sets, reps, and weights
  - ⏱️ Automatic rest timer
  - ⌚ Track workout duration
  - ↩️ Undo completed sets

- **Pre-made Routines** 📋
  - Access professional workout routines
  - Multiple categories (Strength, HIIT, Core)
  - 🎚️ Difficulty levels (Beginner, Intermediate, Advanced)
  - ✏️ Create and save custom routines

- **Progress Analytics** 📊
  - 📈 Visual workout history
  - ⏲️ Duration tracking
  - 📉 Exercise frequency charts
  - 🔥 Workout streak tracking

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns
- **Icons**: Heroicons

## 🚀 Getting Started

### Prerequisites 📋

- Node.js (v18 or higher)
- npm or yarn

### Installation 💻

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gymflow.git
cd gymflow
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. 🌐

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── workout/          # Workout-related components
│   └── progress/         # Progress tracking components
├── lib/                  # Utilities and store
│   └── store/           # Zustand state management
└── types/               # TypeScript type definitions
```

## 🎯 Key Features Explained

### 💪 Workout Tracking
- ▶️ Start a new workout session
- ➕ Add exercises from a comprehensive exercise library
- 📝 Track sets, reps, and weights
- ⏱️ Automatic rest timer between sets
- ✅ Mark sets as complete/incomplete

### 📋 Workout Routines
- 🔍 Browse pre-made workout routines
- 🏷️ Filter by category and difficulty
- ✨ Create custom routines
- ▶️ Start workouts from routines

### 📊 Progress Tracking
- 📈 View workout history
- ⏲️ Analyze workout duration trends
- 📉 Track exercises per workout
- 🔥 Monitor workout streaks

## 🤝 Contributing

1. Fork the repository 🍴
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 🎉

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) ⚡
- [Tailwind CSS](https://tailwindcss.com/) 🎨
- [Heroicons](https://heroicons.com/) 🎯
- [Chart.js](https://www.chartjs.org/) 📊
