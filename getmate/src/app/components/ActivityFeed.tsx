import React from "react";

type Activity = {
  type: "join" | "create";
  user?: { name: string };
  project: { title: string };
  role?: string;
};

export async function ActivityFeed({ projects }: { projects: any[] }) {
  // Mock activities: last 5 projects, show who joined which slot
  const activities: Activity[] = [];

  projects.slice(0, 5).forEach((project) => {
    // Project creation
    activities.push({
      type: "create",
      user: project.author,
      project,
    });
    // Joins
    project.subscriberUsers?.forEach((user: any, i: number) => {
      if (user) {
        activities.push({
          type: "join",
          user,
          project,
          role: project.roleDefinitions?.[i] || "Member",
        });
      }
    });
  });

  // Show most recent first
  activities.reverse();

  return (
    <div className="border-2 border-[#30364F] bg-[#F0F0DB] rounded-sm p-4 shadow-[4px_4px_0_#30364F]">
      <div className="font-mono text-xs font-bold mb-2 text-[#30364F]">Activity Feed</div>
      <ul className="space-y-2">
        {activities.slice(0, 8).map((act, idx) => (
          <li
            key={idx}
            className="font-mono text-xs px-2 py-1 rounded-sm border-l-4 border-[#30364F] bg-[#E1D9BC] text-[#30364F] shadow-[2px_2px_0_#30364F]"
            style={{ whiteSpace: "pre-line" }}
          >
            {act.type === "create" ? (
              <>
                <span className="font-bold">{act.user?.name || "Someone"}</span>{" "}
                created project <span className="font-bold">{act.project.title}</span>
              </>
            ) : (
              <>
                <span className="font-bold">{act.user?.name || "Someone"}</span>{" "}
                joined <span className="font-bold">{act.project.title}</span> as{" "}
                <span className="font-bold">{act.role}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
