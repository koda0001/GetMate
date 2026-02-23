"use client";
import { useEffect, useState } from "react";
import { FilterToolbar } from "./FilterToolbar";
import { ProjectCard } from "./ProjectCard";
import Link from "next/link";

export default function ProjectsFeed({ projects, currentUserId }: { projects: any[], currentUserId?: string }) {
  const [filters, setFilters] = useState({ q: "", role: "", techStack: [] as string[], onlyFree: false });
  const [filtered, setFiltered] = useState(projects);

  useEffect(() => {
    let filteredProjects = projects;
    if (filters.q) {
      filteredProjects = filteredProjects.filter(p =>
        p.title.toLowerCase().includes(filters.q.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.q.toLowerCase())
      );
    }
    if (filters.role) {
      filteredProjects = filteredProjects.filter(p =>
        p.roleDefinitions?.includes(filters.role)
      );
    }
    if (filters.techStack.length > 0) {
      filteredProjects = filteredProjects.filter(p =>
        filters.techStack.every(t => p.techStack?.includes(t))
      );
    }
    if (filters.onlyFree) {
      filteredProjects = filteredProjects.filter(p =>
        (p.subscribers?.filter((s: string) => !s)?.length ?? 0) > 0
      );
    }
    setFiltered(filteredProjects);
  }, [filters, projects]);

  return (
    <>
      <FilterToolbar onChange={setFilters} />
      <div className="flex justify-end mb-8">
        <Link
          href="/new_project"
          className="bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm shadow-[4px_4px_0_#30364F] font-bold px-6 py-2 text-[#30364F] active:translate-y-1 active:shadow-none font-mono"
        >
          + New Project
        </Link>
      </div>
      <section className="space-y-8">
        {filtered.map((project: any) => (
          <ProjectCard key={project.id} project={project} currentUserId={currentUserId} />
        ))}
        {filtered.length === 0 && <p className="text-[#30364F] italic">No projects found...</p>}
      </section>
    </>
  );
}