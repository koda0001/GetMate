import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { SlotsGrid } from "@/app/components/SlotsGrid";
import Link from "next/link";

// POPRAWKA: Definicja params jako Promise
export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  // POPRAWKA: awaitowanie parametrów
  const params = await props.params;
  const projectId = params.id;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { 
      author: true,
      // Dodajemy include, żeby SlotsGrid widział imiona osób, które już dołączyły
      applications: {
        include: { user: true }
      }
    },
  });

  if (!project) return <div>Project not found</div>;

  const session = await auth();
  const isOwner = session?.user?.id === project.authorId;

  // Przygotowanie mapy imion dla SlotsGrid (tak jak w EditProjectPage)
  const subscriberNames: Record<string, string> = {};
  project.applications?.forEach(app => {
    if (app.status === "ACCEPTED" && app.user) {
      subscriberNames[app.userId] = app.user.name || "Unknown";
    }
  });

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 font-bold text-[#30364F] bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[2px_2px_0_#30364F]">
          Project by {project.author?.name || "Unknown"}
        </span>
      </div>
      <div className="flex gap-2 mb-4">
        <span className="px-2 py-1 rounded-sm font-mono text-xs font-bold border-2 border-[#30364F] bg-[#F0F0DB] text-[#30364F]">
          {project.category}
        </span>
        <span className={`px-2 py-1 rounded-sm font-mono text-xs font-bold border-2 border-[#30364F] ${
          project.status === "HIRING" ? "bg-[#E1D9BC] text-[#30364F]" :
          project.status === "IN_PROGRESS" ? "bg-[#30364F] text-[#E1D9BC]" :
          project.status === "COMPLETED" ? "bg-green-200 text-green-900" :
          "bg-red-200 text-red-900"
        }`}>
          {project.status}
        </span>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-[#30364F]">{project.title}</h1>
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block font-mono">
        ← Back to home
      </Link>
      {(project.github || project.link) && (
        <div className="mb-6 space-y-1">
          <h3 className="font-bold text-xs uppercase text-[#30364F]">Project Links</h3>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener" className="block underline text-blue-700 text-sm">GitHub</a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener" className="block underline text-blue-700 text-sm">Discord/Other</a>
          )}
        </div>
      )}

      {isOwner ? (
        /* Jeśli owner trafi tutaj, dajemy mu szybki link do edycji lub prosty form */
        <div className="space-y-4">
            <div className="p-4 bg-[#F0F0DB] border-2 border-dashed border-[#30364F] text-center mb-4">
                <p className="text-xs font-bold uppercase mb-2">You are the owner of this project</p>
                <Link 
                    href={`/edit-project/${project.id}`}
                    className="inline-block bg-[#30364F] text-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0_#E1D9BC]"
                >
                    GO TO SETTINGS
                </Link>
            </div>
            <div className="space-y-4 opacity-50 pointer-events-none">
                <SlotsGrid project={project} mode="view" subscriberNames={subscriberNames} />
            </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-full p-6 border-2 border-[#30364F] rounded-none bg-[#E1D9BC] font-mono text-[#30364F] shadow-[4px_4px_0_#30364F]">
            <div className="mb-2 font-bold uppercase text-xs border-b border-[#30364F] pb-1">// Description</div>
            <div className="whitespace-pre-wrap">{project.description}</div>
          </div>
          
          <div className="pt-4">
             <h3 className="font-bold text-xs uppercase text-[#30364F] mb-3">Team Status</h3>
             <SlotsGrid project={project} mode="view" subscriberNames={subscriberNames} />
          </div>
        </div>
      )}
    </main>
  );
}