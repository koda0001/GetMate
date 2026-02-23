import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { ProjectCard } from "./components/ProjectCard";
import { ActivityFeed } from "./components/ActivityFeed";
import { FilterToolbar } from "./components/FilterToolbar";



import ProjectsFeedClient from "./components/ProjectsFeedClient";

export default async function HomePage() {
  const session = await auth();
  const projects = await db.project.findMany({
    where: {
      OR: [
        { private: false },
        { authorId: session?.user?.id }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  const userIds = Array.from(
    new Set(
      projects.flatMap((p: any) => p.subscribers.filter((id: string) => id && id.trim() !== ""))
    )
  );
  const users = userIds.length
    ? await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, image: true }
      })
    : [];
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));
  const projectsWithUsers = projects.map((project: any) => ({
    ...project,
    subscriberUsers: project.subscribers.map((id: string) => userMap[id] || null)
  }));

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-300">
        <div className="md:col-span-3">
          <ProjectsFeedClient projects={projectsWithUsers} currentUserId={session?.user?.id} />
        </div>
        <aside className="md:col-span-1">
          <ActivityFeed projects={projectsWithUsers} />
        </aside>
      </div>
    </main>
  );
}