import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { ProjectCard } from "./components/ProjectCard";

export default async function HomePage() {
  // 1. Get the user session
  const session = await auth();

  // 2. Fetch Projects and Posts in parallel for speed
  const [projects] = await Promise.all([
    db.project.findMany({
      where: {
        OR: [
          { authorId: session?.user?.id }, // Moje prywatne projekty
          { private: false }         // Widoczne dla wszystkich
        ]
      },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    })
  ]);
  
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">GETMATE</h1>
          {session ? (
            <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm pr-4">
              <img src={session.user.image!} className="w-10 h-10 rounded-full" alt="profile" />
              <span className="font-semibold">{session.user.name}</span>
            </div>
          ) : (
            <Link href="/api/auth/signin" className="bg-yellow-100 text-white px-6 py-2 rounded-lg font-bold">
              Sign In
            </Link>
          )}
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Projects Column */}
          <section className="lg:col-span-2 space-y-6 border-4">
            <input className="border-2 border-blue-400 md:w-auto"
            placeholder="Fun project">
            
            </input>
              <div className="grid grid-cols-1 p-10 gap-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} currentUserId={session?.user?.id} />
                ))}
                {projects.length === 0 && <p className="text-gray-400 italic">No projects shared yet...</p>}
              </div>
          </section>



          {/* Setting Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-right">MENU</h2> 
            <div className="grid grid-cols-1 p-10 gap-4 text-right">
              <Link
                href="/new_project"
                className="w-full bg-blue-600 text-white py-2 pr-2 rounded-lg font-bold active:bg-blue-700 active:scale-95">
                New Project
              </Link>
              <Link
                href="/"
                className="w-full bg-blue-600 text-white py-2 pr-2 rounded-lg font-bold active:bg-blue-700 active:scale-95">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}