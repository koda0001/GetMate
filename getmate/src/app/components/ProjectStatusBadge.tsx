import React from "react";

export function ProjectStatusBadge({ project }: { project: any }) {
  const status = project.status;
  const bg =
    status === "HIRING"
      ? "bg-[#E1D9BC]"
      : status === "IN_PROGRESS"
      ? "bg-[#30364F] text-[#E1D9BC]"
      : status === "COMPLETED"
      ? "bg-green-200 text-green-900"
      : "bg-red-200 text-red-900";
  return (
    <span
      className={`sticky bottom-0 z-10 px-3 py-1 border-2 border-[#30364F] ${bg} font-mono text-xs font-bold rounded-sm select-none`}
      style={{ letterSpacing: "0.05em" }}
    >
      {status}
    </span>
  );
}
