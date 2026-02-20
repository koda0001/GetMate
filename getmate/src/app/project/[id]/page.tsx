import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { SlotsGrid } from "@/app/components/SlotsGrid";
import Link from "next/link";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: { author: true },
  });
  if (!project) return <div>Project not found</div>;

  const session = await auth();
  const isOwner = session?.user?.id === project.authorId;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 font-bold text-[#30364F] bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[2px_2px_0_#30364F]">
          Project by {project.author?.name || "Unknown"}
        </span>
      </div>
      <h1 className="text-2xl font-bold mb-6">{project.title}</h1>
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block">
        ← Back to home
      </Link>
      {isOwner ? (
        <form action="/api/updateProject" className="space-y-4">
          <input type="hidden" name="projectId" value={project.id} />
          <input name="title" defaultValue={project.title} className="w-full p-2 border rounded" />
          <textarea name="description" defaultValue={project.description} className="w-full p-2 border rounded h-32" />
          {/* Add other editable fields as needed */}
          <SlotsGrid project={project} mode="edit" />
          {/* Add SubmitButton, DeleteButton, etc. */}
        </form>
      ) : (
        <div className="space-y-4">
          <div className="w-full p-2 border-2 border-[#30364F] rounded bg-[#E1D9BC] font-mono text-[#30364F]">
            <div className="mb-2 font-bold">Description:</div>
            <div>{project.description}</div>
          </div>
          {/* Add other read-only fields as needed */}
          <SlotsGrid project={project} mode="view" />
        </div>
      )}
    </main>
  );
}
