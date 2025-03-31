# Database Schema Documentation

This document describes the database schema for the GymApp application, implemented using Prisma ORM.

## Overview

The database schema includes models for:

- **Workouts**: Completed workout sessions
- **Exercises**: Individual exercises performed during workouts
- **Progress**: Tracking user fitness metrics over time

## Schema Details

```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Workout {
  id        String     @id @default(uuid())
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  exercises Exercise[]
}

model Exercise {
  id        String   @id @default(uuid())
  name      String
  sets      Int
  reps      Int
  weight    Float?
  workout   Workout  @relation(fields: [workoutId], references: [id])
  workoutId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Progress {
  id        String   @id @default(uuid())
  date      DateTime @default(now())
  weight    Float?
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Model Relationships

- **Workout to Exercise**: One-to-many relationship. A workout can have multiple exercises.

## Usage with Prisma Client

The Prisma client is set up as a singleton in `src/lib/db.ts` to prevent multiple instances during development. Here's how to use it:

```typescript
import { prisma } from '@/lib/db';

// Create a new workout
async function createWorkout() {
  const workout = await prisma.workout.create({
    data: {
      name: 'Monday Strength Training',
      exercises: {
        create: [
          {
            name: 'Bench Press',
            sets: 3,
            reps: 10,
            weight: 135.5,
          },
        ],
      },
    },
  });
  
  return workout;
}

// Get workouts with their exercises
async function getWorkouts() {
  const workouts = await prisma.workout.findMany({
    include: {
      exercises: true,
    },
  });
  
  return workouts;
}
```

## Development Workflow

1. **Make Schema Changes**: Edit the `schema.prisma` file
2. **Generate Prisma Client**: Run `npx prisma generate`
3. **Apply Database Changes**: Run `npx prisma db push`
4. **View Database**: Run `npx prisma studio` to view and edit data

## Production Considerations

For production deployment:

1. **Use a Production Database**: Configure a PostgreSQL or MySQL database
2. **Set up Migrations**: Use `prisma migrate` to manage database changes
3. **Connection Pooling**: Consider using connection pooling for improved performance
4. **Environment Variables**: Store database connection strings in environment variables 