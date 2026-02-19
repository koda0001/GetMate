import { PrismaClient } from "@prisma/client";

const adapter = process.env.DATABASE_URL;

export const db = new PrismaClient({
  adapter,
});
