import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { deleteProject, updateProject } from "../../actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteButton } from "@/app/components/DeleteButton";
import { SlotsGrid } from "@/app/components/SlotsGrid";
import Link from "next/link";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  // Fetch project data by ID from URL
  const project = await db.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    redirect("/"); // If project doesn't exist, redirect to home
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Project: {project.title}</h1>
        {/* Powrót */}
        <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block">
          ← Back to home
        </Link>
      <form action={updateProject} className="space-y-4">
        {/* Pass project ID as hidden field for the action */}
        <input type="hidden" name="projectId" value={project.id} />

        <input
          name="title"
          defaultValue={project.title}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          defaultValue={project.description}
          className="w-full p-2 border rounded h-32"
        />

        <SlotsGrid project={project} />
        <SubmitButton/>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <input 
            type="checkbox" 
            id="private"
            name="private" 
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-yellow-400"
          />
          <label htmlFor="private" className="flex flex-col">
            <span className="text-sm font-bold text-gray-700">Private Project</span>
            <span className="text-[10px] text-gray-500">Only you will see this project on the main feed</span>
          </label>
        </div>
      </form>
      <form action={deleteProject}>
        <input type="hidden" name="projectId" value={params.id} />
        <div className="mt-2">
          <DeleteButton />
        </div>
      </form>
    </main>
  );
}