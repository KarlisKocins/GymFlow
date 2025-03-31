/**
 * Database client singleton using Prisma
 * 
 * This file sets up a singleton instance of PrismaClient to be used throughout the application.
 * It helps prevent multiple instances of PrismaClient in development environment.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use existing Prisma instance if available to prevent multiple instances during hot reloading
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, add prisma to the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 