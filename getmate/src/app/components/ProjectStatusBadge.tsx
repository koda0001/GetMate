import React from "react";

export function ProjectStatusBadge({ project }: { project: any }) {
  let status = "";
  if (project.private) {
    status = "IDEA";
  } else if (project.subscribers.some((id: string) => !id || id.trim() === "")) {
    status = "RECRUITING";
  } else {
    status = "IN PROGRESS";
  }

  const bg =
    status === "IDEA"
      ? "bg-[#E1D9BC]/60"
      : status === "RECRUITING"
      ? "bg-[#30364F]/10"
      : "bg-[#30364F]/20";

  return (
    <span
      className={`sticky bottom-0 z-10 px-3 py-1 border-2 border-[#30364F] ${bg} text-[#30364F] font-mono text-xs font-bold rounded-sm select-none`}
      style={{ letterSpacing: "0.05em" }}
    >
      {status}
    </span>
  );
}
