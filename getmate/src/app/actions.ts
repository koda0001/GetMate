"use server" // This is the "Security Guard" - it keeps this file off the front-end.

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Each exported function is a "Job" the front-end can ask the server to do.
export async function createProject(formData: FormData) {
  // 1. AUTHENTICATION (The Bouncer)
  const session = await auth();
  if (!session) throw new Error("Log in first!");

  // 2. DATA COLLECTION (The Ingredients)
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const github = formData.get("github") as string;
  const slots = Number(formData.get("slots"));
  const isPrivate = formData.get("private") === "on";


  // 3. DATABASE EXECUTION (The Chef)
  await db.project.create({
    data: {
      title,
      description,
      github,
      slots,
      subscribers: Array(slots).fill(""),
      private: isPrivate,
      authorId: session.user.id,
    },
  });

  // 4. UI UPDATE (The Notification)
  // This tells Next.js: "Hey, the list of projects changed, refresh the page!"
  redirect("/");
}


export async function updateProject(formData: FormData) {
  // 1. AUTHENTICATION (The Bouncer)
  const session = await auth();
  if (!session) throw new Error("Log in first!");
  
  // 2. DATA COLLECTION (The Ingredients)
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const github = formData.get("github") as string;
  const slots = Number(formData.get("slots"));
  const subscribers = formData.getAll("slot_description") as string[];
  const isPrivate = formData.get("private") === "on";

  
  
  // 3. AUTHENTICATION (The Bouncer)
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { authorId: true }
  });
  if (!project || project.authorId !== session.user.id) {
    throw new Error("To nie Twój projekt, ziomeczku!");
  }
  
  // 3. DATABASE EXECUTION (The Chef)
  await db.project.update({
    where: {
      id: projectId
    },
    data: {
      title: title,
      description: description,
      github: github,
      slots: slots,
      subscribers: subscribers,
      authorId: session.user.id,
      private: isPrivate,
    },
  });

  // 4. UI UPDATE (The Notification)
  // This tells Next.js: "Hey, the list of projects changed, refresh the page!"
  redirect("/");
}

export async function deleteProject(formData: FormData) {
  // 1. AUTHENTICATION (The Bouncer)
  const session = await auth();
  if (!session) throw new Error("Log in first!");

  // 2. DATA COLLECTION (The Ingredients)
  const projectId = formData.get("projectId") as string;

  // 3. AUTHENTICATION (The Bouncer)
  const project = await db.project.findUnique({
  where: { id: projectId },
  select: { authorId: true }
  });
  if (!project || project.authorId !== session.user.id) {
  throw new Error("To nie Twój projekt, ziomeczku!");
  }

  // 3. DATABASE EXECUTION (The Chef)
  await db.project.delete({
    where: {
      id: projectId
    }
  });

  // 4. UI UPDATE (The Notification)
  // This tells Next.js: "Hey, the list of projects changed, refresh the page!"
  redirect("/");
}

export async function joinProject(projectId: string) {
  const session = await auth();
  if (!session) throw new Error("Log in first!");

  const project = await db.project.findUnique({
    where: { id: projectId }
  });

  if (!project) throw new Error("Project not found");

  const subscribers = [...project.subscribers];
  const firstEmptyIndex = subscribers.findIndex(s => s.trim() === "");

  if (firstEmptyIndex === -1) {
    throw new Error("No empty slots available!");
  }

  if (subscribers.includes(session.user.id)) {
    throw new Error("You already joined!");
  }

  // Zastępujemy pusty string identyfikatorem użytkownika
  subscribers[firstEmptyIndex] = session.user.id;

  await db.project.update({
    where: { id: projectId },
    data: { subscribers }
  });

  revalidatePath("/");
}