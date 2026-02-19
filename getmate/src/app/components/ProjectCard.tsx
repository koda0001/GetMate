'use client';
import { UserParticipantStack } from "./UserParticipantStack";
import { joinProject } from "../actions";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import Link from "next/link";
import React from "react";

import { useRouter } from "next/navigation";

export function ProjectCard({ project, currentUserId }: { project: any, currentUserId?: string }) {
  const router = useRouter();
  const handleJoin = async (slotIndex: number) => {
    try {
      await joinProject(project.id, slotIndex);
      alert("Dołączono do projektu!");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div
      className="card grid grid-cols-2 gap-6 items-start cursor-pointer hover:bg-[#e7e7c7] transition-colors"
      onClick={() => router.push(`/edit-project/${project.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") router.push(`/edit-project/${project.id}`); }}
    >
      {/* Status Badge */}
      {/* Left: Title, Description, Participants */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-extrabold font-mono">{project.title}</h3>
          {project.private && (
            <span className="bg-[#30364F] text-[#E1D9BC] px-2 py-1 rounded-sm font-mono text-xs">🔒 PRIVATE</span>
          )}
        </div>
        <p className="font-mono text-base">{project.description}</p>
        <UserParticipantStack
          users={project.subscriberUsers}
          roles={project.roleDefinitions}
          maxSlots={project.slots}
        />
      </div>
      {/* Right: Slots & Join */}
      <div className="flex flex-col gap-2" onClick={e => e.stopPropagation()}>
        {project.roleDefinitions?.map((role: string, i: number) => {
          const userId = project.subscribers[i];
          const user = project.subscriberUsers?.[i];
          const isSubscribed = project.subscribers.includes(currentUserId);
          return (
            <div key={i} className="flex items-center gap-2 border-2 border-[#30364F] rounded-sm bg-[#F0F0DB] px-2 py-1 font-mono">
              <span className="font-bold text-[#30364F]">{role}</span>
              {userId && user ? (
                <div className="flex items-center gap-2">
                  <img src={user.image} alt={user.name} className="w-6 h-6 rounded-sm border-2 border-[#30364F]" />
                  <span className="text-sm">{user.name}</span>
                </div>
              ) : (
                <button
                  className="ml-auto px-3 py-1 bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm shadow-[4px_4px_0_#30364F] font-bold active:translate-y-1 active:shadow-none"
                  disabled={!!userId || isSubscribed}
                  onClick={e => { e.stopPropagation(); handleJoin(i); }}
                >
                  Join as {role}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {/* Tech Stack Tags */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="col-span-2 flex flex-wrap gap-2 mt-4">
          {project.techStack.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm font-mono text-xs font-bold shadow-[2px_2px_0_#30364F]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <ProjectStatusBadge project={project} />
    </div>
  );
}