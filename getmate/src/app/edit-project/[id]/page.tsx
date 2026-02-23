import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { deleteProject, updateProject } from "../../actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteButton } from "@/app/components/DeleteButton";
import { SlotsGrid } from "@/app/components/SlotsGrid";
import Link from "next/link";
import { TechStackSelector } from "@/app/components/TechStackSelector";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  // Pobieramy dane projektu wraz z autorem
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      applications: { include: { user: true } },
    },
  });

  if (!project) redirect("/");

  const session = await auth();
  const isOwner = session?.user?.id === project.authorId;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      {/* Badge Autora */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 font-bold text-[#30364F] bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[4px_4px_0_#30364F]">
          Project by {project.author?.name || "Unknown"}
        </span>
      </div>

      <h1 className="text-3xl font-black mb-6 text-[#30364F]">
        {isOwner ? "Settings: " : "View: "}
        {project.title}
      </h1>

      <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block font-mono">
        ← Back to home
      </Link>

      {isOwner ? (
        /* WIDOK DLA WŁAŚCICIELA - TRYB EDYCJI */
        <form action={updateProject} className="space-y-6">
          <input type="hidden" name="projectId" value={project.id} />
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#30364F]">Project Title</label>
            <input 
              name="title" 
              defaultValue={project.title} 
              className="w-full p-3 border-2 border-[#30364F] rounded-none focus:ring-0 focus:bg-[#F0F0DB] outline-none shadow-[4px_4px_0_#30364F] transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#30364F]">Description</label>
            <textarea 
              name="description" 
              defaultValue={project.description} 
              className="w-full p-3 border-2 border-[#30364F] rounded-none h-40 focus:ring-0 focus:bg-[#F0F0DB] outline-none shadow-[4px_4px_0_#30364F] transition-all" 
            />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold uppercase text-[#30364F]">Tech Stack</label>
             <TechStackSelector initial={project.techStack || []} mode="edit" />
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold uppercase text-[#30364F]">Team Slots</label>
             <SlotsGrid project={project} mode="edit" />
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-white border-2 border-[#30364F] shadow-[4px_4px_0_#30364F]">
            <input 
              type="checkbox" 
              id="private" 
              name="private" 
              defaultChecked={project.private}
              className="w-6 h-6 border-2 border-[#30364F] text-[#30364F] focus:ring-0 accent-[#30364F]" 
            />
            <label htmlFor="private" className="flex flex-col cursor-pointer">
              <span className="text-sm font-bold text-[#30364F] uppercase">Private Project</span>
              <span className="text-[10px] text-gray-500 font-mono">Hidden from the public main feed</span>
            </label>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      ) : (
        /* WIDOK DLA GOŚCIA - TRYB PODGLĄDU */
        <div className="space-y-8">
          <div className="w-full p-6 border-2 border-[#30364F] bg-[#E1D9BC] font-mono text-[#30364F] shadow-[8px_8px_0_#30364F]">
            <div className="mb-4 font-bold uppercase tracking-widest border-b-2 border-[#30364F] pb-2 text-lg">
              // PROJECT_BRIEF
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">
              {project.description}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#30364F] tracking-widest px-1">Technologies Used</h3>
            <TechStackSelector initial={project.techStack || []} mode="view" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#30364F] tracking-widest px-1">Current Openings</h3>
            <SlotsGrid project={project} mode="view" />
          </div>
        </div>
      )}

      {/* Przycisk usuwania - Tylko dla Ownera */}
      {isOwner && (
        <form action={deleteProject} className="mt-16 pt-8 border-t-2 border-dashed border-[#30364F]/30">
          <input type="hidden" name="projectId" value={project.id} />
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-mono uppercase text-red-500">Danger Zone: Permanent Action</p>
            <DeleteButton />
          </div>
        </form>
      )}

      {isOwner && (
        <section className="mt-8">
          <h2 className="font-bold text-[#30364F] mb-2">Applicants</h2>
          {project.applications?.filter(a => a.status === "PENDING").length === 0 ? (
            <div className="text-xs text-gray-500">No pending applications.</div>
          ) : (
            <ul className="space-y-2">
              {project.applications.filter(a => a.status === "PENDING").map(a => (
                <li key={a.id} className="flex items-center gap-3 border p-2 rounded bg-[#F0F0DB]">
                  <span className="font-mono">{a.user?.name || a.userId}</span>
                  <span className="text-xs bg-[#E1D9BC] border border-[#30364F] px-2 py-1 rounded">{project.roleDefinitions[a.slotIndex]}</span>
                  <a href={`/profile/${a.userId}`} className="underline text-blue-700 text-xs">Profile</a>
                  <form action={`/api/acceptApplication`} method="POST" className="inline">
                    <input type="hidden" name="applicationId" value={a.id} />
                    <button className="bg-green-200 border-2 border-[#30364F] text-[#30364F] px-2 py-1 rounded ml-2">ACCEPT</button>
                  </form>
                  <form action={`/api/rejectApplication`} method="POST" className="inline">
                    <input type="hidden" name="applicationId" value={a.id} />
                    <button className="bg-red-200 border-2 border-[#30364F] text-[#30364F] px-2 py-1 rounded ml-2">REJECT</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}