import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { updateProfile } from "../../actions";
import Link from "next/link";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ProjectCard } from "@/app/components/ProjectCard";
import { TechStackSelector } from "@/app/components/TechStackSelector";
import React from "react";

// POPRAWKA: params jako Promise
export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  // POPRAWKA: awaitowanie parametrów
  const params = await props.params;
  const userIdFromParams = params.id;

  const session = await auth();
  const isMe = session?.user?.id === userIdFromParams;
  const STATUSES = ["Available", "Looking for projects", "Busy", "Not looking"];

  const user = await db.user.findUnique({
    where: { id: userIdFromParams },
    include: {
      projects: true,
      accounts: true,
    },
  });

  if (!user) redirect("/");

  // Fetch projects the user joined (as subscriber)
  const joinedProjects = await db.project.findMany({
    where: {
      subscribers: { has: user.id },
      ...(isMe ? {} : { private: false }),
    },
    include: { author: true },
  });

  // Projects created by user
  const createdProjects = user.projects.filter((p: any) => isMe || !p.private);

  // Completion rate: completed projects / total created
  const completedCount = user.projects.filter((p: any) => p.status === "COMPLETED").length;
  const completionRate =
    user.projects.length > 0
      ? Math.round((completedCount / user.projects.length) * 100)
      : 0;

  // Social links
  const githubAccount = user.accounts?.find((a: any) => a.provider === "github");
  const github = githubAccount ? `https://github.com/${githubAccount.providerAccountId}` : null;

  const linkedinAccount = user.accounts?.find((a: any) => a.provider === "linkedin");
  const linkedin = linkedinAccount ? `https://linkedin.com/in/${linkedinAccount.providerAccountId}` : null;

  return (
    <main className="p-8 max-w-3xl mx-auto font-mono">
      {/* Header */}
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block font-mono">
        ← Back to home
      </Link>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-28 h-28 rounded-full border-4 border-[#30364F] bg-[#F0F0DB] shadow-[6px_6px_0_#30364F] flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img src={user.image} alt={user.name || "Avatar"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">{user.name?.[0] || "?"}</span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#30364F]">{user.name || "Unknown"}</h1>
          <div className="flex gap-3 mt-2">
            {github && (
              <Link href={github} target="_blank" className="underline text-[#30364F] hover:text-[#E1D9BC]">
                GitHub
              </Link>
            )}
            {linkedin && (
              <Link href={linkedin} target="_blank" className="underline text-[#30364F] hover:text-[#E1D9BC]">
                LinkedIn
              </Link>
            )}
          </div>
        </div>
      </div>


      {/* Bio */}
      <div className="mb-6">
        <h2 className="font-bold text-[#30364F] mb-1">Bio</h2>
        {isMe ? (
          <form action={updateProfile} className="space-y-2">
            {/* Availability Badge */}
            <div className="mb-4">
              <select 
                className="bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm px-2 py-1 font-mono text-sm"
                defaultValue={user.availability || ""}
                name="availability"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <input type="hidden" name="userId" value={user.id} />
            <textarea
              name="bio"
              defaultValue={user.bio || ""}
              className="w-full border-2 border-[#30364F] bg-[#F0F0DB] rounded p-2 font-mono"
            />
            {/* Tech Stack */}
            <div className="mb-6">
              <h2 className="font-bold text-[#30364F] mb-1">Tech Stack</h2>
                  <TechStackSelector initial={user.techStack || []} mode="edit" />
            </div>
            <SubmitButton/>
          </form>
        ) : (
          <p className="bg-[#F0F0DB] border-2 border-[#30364F] rounded p-3">{user.bio || "No bio yet."}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[4px_4px_0_#30364F] p-4 text-center">
          <div className="text-2xl font-bold">{user.projects.length}</div>
          <div className="text-xs mt-1">Projects Created</div>
        </div>
        <div className="bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[4px_4px_0_#30364F] p-4 text-center">
          <div className="text-2xl font-bold">{joinedProjects.length}</div>
          <div className="text-xs mt-1">Projects Joined</div>
        </div>
        <div className="bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[4px_4px_0_#30364F] p-4 text-center">
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="text-xs mt-1">Completion Rate</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-[#30364F] mb-1">Tech Stack</h2>
        <TechStackSelector initial={user.techStack || []} mode="view" />
      </div>

      {/* Projects List */}
      <div>
        <h2 className="font-bold text-[#30364F] mb-2">Projects</h2>
        <div className="grid gap-4">
          {createdProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {joinedProjects
            .filter((p: any) => !createdProjects.some((cp: any) => cp.id === p.id))
            .map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </div>

      {/* Contact Button (Public View) */}
      {!isMe && (
        <div className="mt-8">
          <Link
            href={github || "#"}
            className="bg-[#E1D9BC] border-2 border-[#30364F] px-6 py-2 rounded shadow-[4px_4px_0_#30364F] font-mono hover:bg-[#F0F0DB]"
            target="_blank"
          >
            Contact
          </Link>
        </div>
      )}
    </main>
  );
}