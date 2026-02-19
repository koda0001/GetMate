import React from "react";

type User = { id: string; image?: string; name?: string };
type Props = {
  users: (User | null)[];
  roles: string[];
  maxSlots: number;
};

export function UserParticipantStack({ users, roles, maxSlots }: Props) {
  return (
    <div className="flex items-center space-x-[-16px]">
      {Array.from({ length: maxSlots }).map((_, i) => {
        const user = users[i];
        const role = roles[i];
        return user ? (
          <div key={i} className="relative group">
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 border-2 border-[#30364F] rounded-sm bg-[#F0F0DB] z-10"
              style={{ boxShadow: "4px 4px 0 #30364F" }}
            />
            <div className="absolute left-1/2 -translate-x-1/2 top-12 z-20 hidden group-hover:block">
              <div className="bg-[#30364F] text-[#E1D9BC] px-3 py-1 rounded-sm border-2 border-[#30364F] font-mono text-xs shadow-lg">
                {user.name} <span className="text-[#F0F0DB]">|</span> {role}
              </div>
            </div>
          </div>
        ) : (
          <div
            key={i}
            className="w-10 h-10 flex items-center justify-center border-2 border-dotted border-[#30364F] bg-[#F0F0DB] rounded-sm z-0"
            style={{ boxShadow: "4px 4px 0 #30364F" }}
          >
            <span className="text-[#30364F] text-xl font-bold">+</span>
          </div>
        );
      })}
    </div>
  );
}
