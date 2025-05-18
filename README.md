# GymFlow 💪

A modern, intuitive workout tracking application built with Next.js, TypeScript, and PostgreSQL. Track your fitness journey, crush your goals! 🎯

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

- **Persistent Storage** 💾
  - PostgreSQL database integration
  - RESTful API endpoints
  - Secure data management
  - Server-side validation

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns
- **Icons**: Heroicons
- **Database**: PostgreSQL
- **API**: Next.js API Routes

## 🚀 Getting Started

### Prerequisites 📋

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

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

3. Set up the database:

```bash
# Create a PostgreSQL database named 'gymapp'
# Then run the SQL setup scripts to create tables
```

4. Configure environment variables:
   
Create a `.env.local` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/gymapp
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser. 🌐

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── workout/          # Workout-related components
│   └── progress/         # Progress tracking components
├── lib/                  # Utilities and store
│   ├── db/              # Database connection and helpers
│   └── store/           # Zustand state management
├── pages/                # Pages and API routes
│   └── api/             # Backend API endpoints
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

### 💾 Database Integration
- PostgreSQL for persistent data storage
- RESTful API endpoints for CRUD operations
- Server-side validation and error handling
- Optimized queries for performance

## 🌐 API Endpoints

The application provides the following API endpoints:

- `GET /api/exercises` - Fetch all available exercises
- `GET /api/routines` - Fetch all workout routines
- `POST /api/routines` - Create a new workout routine
- `DELETE /api/routines/:id` - Delete a workout routine
- `GET /api/history` - Fetch workout history
- `POST /api/history` - Save a completed workout
- `DELETE /api/history/:id` - Delete workout history entry

## 🤝 Contributing

1. Fork the repository 🍴
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 🎉


- [Next.js](https://nextjs.org/) ⚡
- [Tailwind CSS](https://tailwindcss.com/) 🎨
- [Heroicons](https://heroicons.com/) 🎯
- [Chart.js](https://www.chartjs.org/) 📊
- [PostgreSQL](https://www.postgresql.org/) 🐘

