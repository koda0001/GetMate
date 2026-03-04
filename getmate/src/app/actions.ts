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
  const roleDefinitions = formData.getAll("slot_role") as string[];
  const techStack = formData.getAll("techStack") as string[]; // <-- NEW
  
  // 3. DATABASE EXECUTION (The Chef)
  await db.project.create({
    data: {
      title,
      description,
      github,
      slots,
      subscribers: Array(slots).fill(""),
      roleDefinitions: roleDefinitions.length === slots ? roleDefinitions : Array(slots).fill("Programmer"),
      private: isPrivate,
      techStack, // <-- NEW
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
  const roleDefinitions = formData.getAll("slot_role") as string[];
  const isPrivate = formData.get("private") === "on";
  const techStack = formData.getAll("techStack") as string[]; // <-- NEW
  
  
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
      roleDefinitions: roleDefinitions.length === slots ? roleDefinitions : Array(slots).fill("Programmer"),
      authorId: session.user.id,
      private: isPrivate,
      techStack, // <-- NEW
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

// Recruitment: User applies for a slot (creates Application with PENDING status)
export async function joinProject(projectId: string, slotIndex: number, role: string) {
  const session = await auth();
  if (!session) throw new Error("Log in first!");
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { applications: true }
  });
  if (!project) throw new Error("Project not found");
  // Check if user already applied for this slot and role
  const existingApp = await db.application.findFirst({
    where: {
      userId: session.user.id,
      projectId,
      slotIndex,
      role,
      status: { in: ["PENDING", "ACCEPTED","REJECTED"] }
    }
  });
  if (existingApp) throw new Error("You already applied for this slot!");
  // Check if slot is already filled
  if (project.subscribers[slotIndex] && project.subscribers[slotIndex].trim() !== "") {
    throw new Error("Slot already taken!");
  }
  await db.application.create({
    data: {
      userId: session.user.id,
      projectId,
      slotIndex,
      role,
      status: "PENDING"
    }
  });
  await db.notification.create({
    data: {
      userId: project.authorId, // powiadomienie leci do właściciela
      title: "New Application",
      message: `${session.user.name} applied for ${role} in ${project.title}`,
      link: `/edit-project/${project.id}`,
    }
});
  revalidatePath("/");
}

// Recruitment: Owner accepts an application
export async function acceptApplication(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Log in first!");
  const applicationId = formData.get("applicationId") as string;
  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: { project: true }
  });
  if (!application) throw new Error("Application not found");
  if (application.project.authorId !== session.user.id) throw new Error("Not your project!");
  // Find first empty slot for the role
  const project = application.project;
  const role = application.role;
  let slotToFill = -1;
  for (let i = 0; i < project.roleDefinitions.length; i++) {
      if (project.roleDefinitions[i] === role && (!project.subscribers[i] || project.subscribers[i]?.trim() === "")) {      slotToFill = i;
      break;
    }
  }
  if (slotToFill === -1) throw new Error("No empty slot for this role!");
  const newSubscribers = [...project.subscribers];
  newSubscribers[slotToFill] = application.userId;
  await db.$transaction([
    db.project.update({
      where: { id: project.id },
      data: { subscribers: newSubscribers }
    }),
    db.application.update({
      where: { id: applicationId },
      data: { status: "ACCEPTED", slotIndex: slotToFill }
    }),
    db.application.updateMany({
      where: {
        projectId: project.id,
        slotIndex: slotToFill,
        status: "PENDING",
        id: { not: applicationId }
      },
      data: { status: "REJECTED" }
    })
  ]);
  await db.notification.create({
    data: {
      userId: application.userId, // powiadomienie leci do aplikanta
      title: "Accepted",
      message: `You where accepted for ${role} in ${project.title}`,
      link: `/edit-project/${project.id}`,
  }
  });
  revalidatePath("/");
}

// Recruitment: Owner rejects an application
export async function rejectApplication(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Log in first!");
  const applicationId = formData.get("applicationId") as string;
  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: { project: true }
  });
  
  if (!application) throw new Error("Application not found");
  if (application.project.authorId !== session.user.id) throw new Error("Not your project!");
  
  await db.application.update({
    where: { id: applicationId },
    data: { status: "REJECTED" }
  });

  await db.notification.create({
    data: {
      userId: application.userId,
      title: "Rejected",
      // POPRAWKA: używamy danych z obiektu application
      message: `You were rejected from ${application.role} in ${application.project.title}`,
      link: `/edit-project/${application.project.id}`,
    }
  });
  revalidatePath("/");
}
// Update user profile (bio, social links, etc.)
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Log in first!");

  const userId = formData.get("userId") as string;
  if (session.user.id !== userId) throw new Error("You can only update your own profile!");

  const availability = formData.get("availability") as string;
  const bio = formData.get("bio") as string;
  const techStack = formData.getAll("techStack") as string[];
  // Optionally handle github/linkedin fields if you want to store them directly
  // const github = formData.get("github") as string;
  // const linkedin = formData.get("linkedin") as string;

  await db.user.update({
    where: { id: userId },
    data: { 
      availability,
      bio,
      techStack
    },
  });
  // tu trzeba jakis wait czy cos bo update leci w serwer ale strona sie za szybko updatuje i przez to 
  //nie widac zmian w tym polu wyboru, ale jak sie juz odwiezy strone to zmiany sie pokazujo
  revalidatePath(`/profile/${userId}`);
}

export async function markNotificationAsRead(id: string) {
  await db.notification.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/"); // Odświeża dane w komponentach Server Components
}