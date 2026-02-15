"use server" // This is the "Security Guard" - it keeps this file off the front-end.

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

// Each exported function is a "Job" the front-end can ask the server to do.
export async function createProject(formData: FormData) {
  // 1. AUTHENTICATION (The Bouncer)
  const session = await auth();
  if (!session) throw new Error("Log in first!");

  // 2. DATA COLLECTION (The Ingredients)
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // 3. DATABASE EXECUTION (The Chef)
  await db.project.create({
    data: {
      title,
      description,
      authorId: session.user.id,
    },
  });

  // 4. UI UPDATE (The Notification)
  // This tells Next.js: "Hey, the list of projects changed, refresh the page!"
  revalidatePath("/");
}