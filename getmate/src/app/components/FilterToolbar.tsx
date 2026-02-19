'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ROLE_OPTIONS = [
  "Programmer", "Graphic Designer", "Project Manager"
];

const TECH_OPTIONS = [
  "React", "Next.js", "Node.js", "Python", "Django", "Flask", "TypeScript", "JavaScript", "C#", "Java", "Go", "Rust", "PostgreSQL", "MongoDB"
];

export function FilterToolbar({ roles = ROLE_OPTIONS, techs = TECH_OPTIONS }: { roles?: string[], techs?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [techStack, setTechStack] = useState<string[]>(searchParams.getAll("techStack") || []);
  const [onlyFree, setOnlyFree] = useState(searchParams.get("free") === "1");

  // Update URL params on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (role) params.set("role", role);
    techStack.forEach(t => params.append("techStack", t));
    if (onlyFree) params.set("free", "1");
    router.replace(`/?${params.toString()}`);
    // eslint-disable-next-line
  }, [search, role, techStack, onlyFree]);

  return (
    <form
      className="flex flex-wrap gap-3 items-center bg-[#E1D9BC] border-4 border-[#30364F] rounded-3xl px-6 py-4 mb-8 shadow-[4px_4px_0_#30364F]"
      onSubmit={e => e.preventDefault()}
    >
      <input
        className="flex-1 min-w-[120px] bg-[#F0F0DB] border-2 border-[#30364F] rounded-sm px-3 py-1 font-mono text-sm"
        placeholder="Search projects..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select
        className="bg-[#F0F0DB] border-2 border-[#30364F] rounded-sm px-2 py-1 font-mono text-sm"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="">All Roles</option>
        {roles.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="flex gap-1 flex-wrap items-center">
        <span className="font-mono text-xs">Tech:</span>
        {techs.map(t => (
          <label key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F0F0DB] border-2 border-[#30364F] rounded-sm font-mono text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={techStack.includes(t)}
              onChange={e => {
                setTechStack(ts => e.target.checked ? [...ts, t] : ts.filter(x => x !== t));
              }}
              className="accent-[#30364F]"
            />
            {t}
          </label>
        ))}
      </div>
      <label className="flex items-center gap-2 ml-2 font-mono text-xs">
        <input
          type="checkbox"
          checked={onlyFree}
          onChange={e => setOnlyFree(e.target.checked)}
          className="accent-[#30364F]"
        />
        Only with free spots
      </label>
    </form>
  );
}