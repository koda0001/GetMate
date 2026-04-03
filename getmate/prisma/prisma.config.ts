// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.DATABASE_URL !== "production") globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

// const adapter = process.env.DATABASE_URL;

// export const db = new PrismaClient({
//   adapter,
// });