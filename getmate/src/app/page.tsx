import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { ProjectCard } from "./components/ProjectCard";
import { ActivityFeed } from "./components/ActivityFeed";
import { FilterToolbar } from "./components/FilterToolbar";


export default async function HomePage() {
  // 1. Get the user session
  const session = await auth();

  // 2. Fetch Projects (private: false OR my own)
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

  // Fetch all user IDs from all projects' subscribers
  const userIds = Array.from(
    new Set(
      projects.flatMap((p: any) => p.subscribers.filter((id: string) => id && id.trim() !== ""))
    )
  );

  // Fetch user data for all IDs
  const users = userIds.length
    ? await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, image: true }
      })
    : [];

  // Map userId to user object
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  // Attach subscriberUsers to each project for ProjectCard
  const projectsWithUsers = projects.map((project: any) => ({
    ...project,
    subscriberUsers: project.subscribers.map((id: string) => userMap[id] || null)
  }));

  // Get search params from URL
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const q = params.get("q")?.toLowerCase() || "";
  const role = params.get("role");
  const techStack = params.getAll("techStack");
  const onlyFree = params.get("free") === "1";

  // Filtering will be handled client-side in FilterToolbar and ProjectCard.
  // The server component just passes all projectsWithUsers to the client.

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-300">
        {/* Main Feed */}
        <div className="md:col-span-3">
          <FilterToolbar />
          <div className="flex justify-end mb-8">
            <Link
              href="/new_project"
              className="bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm shadow-[4px_4px_0_#30364F] font-bold px-6 py-2 text-[#30364F] active:translate-y-1 active:shadow-none font-mono"
            >
              + New Project
            </Link>
          </div>
          <section className="space-y-8">
            {projectsWithUsers.map((project: any) => (
              <ProjectCard key={project.id} project={project} currentUserId={session?.user?.id} />
            ))}
            {projectsWithUsers.length === 0 && <p className="text-[#30364F] italic">No projects found...</p>}
          </section>
        </div>
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <ActivityFeed projects={projectsWithUsers} />
        </aside>
      </div>
    </main>
  );
}