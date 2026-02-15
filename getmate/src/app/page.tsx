import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { createProject } from "./actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ProjectCard } from "./components/ProjectCard";

export default async function HomePage() {
  // 1. Get the user session
  const session = await auth();

  // 2. Fetch Projects and Posts in parallel for speed
  const [projects, posts] = await Promise.all([
    db.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    }),
    db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { createdBy: true },
    }),
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
                <ProjectCard key={project.id} project={project} />
              ))}
              {projects.length === 0 && <p className="text-gray-400 italic">No projects shared yet...</p>}
            </div>
          </section>

          <div className="bg-white p-6 rounded-xl border-2 border-dashed mb-8">
              <h2 className="text-xl font-bold mb-4">Start a New Project</h2>
              <form action={createProject} className="space-y-4">
                <input 
                  name="title" 
                  placeholder="Project Title" 
                  className="w-full p-2 border rounded-md"
                  required 
                />
                <textarea 
                  name="description" 
                  placeholder="Describe your idea..." 
                  className="w-full p-2 border rounded-md h-24"
                  required 
                />
                <SubmitButton />
              </form>
            </div>

          {/* Social Posts Column */}
          <aside className="space-y-6">
            <h2 className="text-2xl font-bold">💬 Recent Updates</h2> 
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-gray-800 mb-3">{post.name}</p>
                  <div className="flex items-center gap-2">
                    <img src={post.createdBy.image!} className="w-5 h-5 rounded-full" />
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                      {post.createdBy.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}