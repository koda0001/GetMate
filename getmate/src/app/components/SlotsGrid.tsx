'use client';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { joinProject } from "../actions";
import { useRouter } from "next/navigation";


export function SlotsGrid({ 
  project, 
  mode = 'edit',
  subscriberNames = {},
  }: { 
  project: any,
  mode?: 'edit' | 'view',
  subscriberNames?: Record<string, string>
  }) {
  const ROLE_OPTIONS = [
    "Programmer",
    "Graphic Designer",
    "Project Manager"
  ];
  const [slotsCount, setSlotsCount] = useState(project?.slots || 1);
  const router = useRouter();
  const [roleDefinitions, setRoleDefinitions] = useState<string[]>(
    project?.roleDefinitions?.length > 0 
      ? [...project.roleDefinitions] 
      : Array.from({ length: slotsCount }, () => ROLE_OPTIONS[0])
  );
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isEdit = mode === 'edit';
  const handleJoin = async (slotIndex: number, role :string) => {
    try {
      await joinProject(project.id, slotIndex, role);
      alert("Dołączono do projektu!");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

const handleSlotsChange = (value: string) => {
    const num = parseInt(value) || 1;
    setSlotsCount(num);
    
    setRoleDefinitions((prev: string[]) => {
      // 1. Tworzymy nową, pustą tablicę o rozmiarze 'num'
      const nextRoles: string[] = [];
      
      // 2. Wypełniamy ją ręcznie, gwarantując TS-owi, że każdy element to string
      for (let i = 0; i < num; i++) {
        const existingRole = prev[i];
        // Jeśli rola istnieje, bierzemy ją, jeśli nie - bierzemy domyślną
        nextRoles.push(existingRole ?? ROLE_OPTIONS[0] ?? "Programmer");
      }
      
      return nextRoles;
    });
  };

  const handleRoleChange = (i: number, value: string) => {
    setRoleDefinitions((prev) => {
      const arr = [...prev];
      arr[i] = value;
      return arr;
    });
  };


  return (
    <div className="space-y-4">
      {isEdit ? (
        <div>
          <label className="text-sm font-medium">Slots</label>
          <input
            name="slots"
            type="number"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
            min="1"
            max="20"
            value={slotsCount}
            onChange={(e) => handleSlotsChange(e.target.value)}
            disabled={!isLoggedIn}
          />
          {!isLoggedIn && (
              <div className="ml-2 text-xs text-[#30364F] font-mono bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm px-2 py-1 shadow-[2px_2px_0_#30364F]">
                Sign in to participate
              </div>
          )}
        </div>
      ) : null}
      <div className="grid gap-4 transition-all duration-300 grid-cols-1">
        {Array.from({ length: slotsCount }).map((_, i) => {
          const subscriber = project.subscribers?.[i];
          const subscriberId = project.subscribers?.[i]; // To jest ID (string)
          const role = roleDefinitions[i] || ROLE_OPTIONS[0];
          const subscriberName = subscriberId ? subscriberNames[subscriberId] : null;
          if (isEdit) {
            return (
              <div key={i} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                <label className="text-xs font-bold text-gray-400">Slot #{i + 1}</label>
                <div className="flex-1 px-2 py-1 border rounded bg-[#E1D9BC] text-sm font-mono text-[#30364F]">
                  {subscriberName || "Empty slot"}
                </div>
                <select
                  name="slot_role"
                  value={role}
                  onChange={e => handleRoleChange(i, e.target.value)}
                  className="p-2 border rounded bg-white"
                  disabled={!isLoggedIn}
                >
                  {ROLE_OPTIONS.map(roleOpt => (
                    <option key={roleOpt} value={roleOpt}>{roleOpt}</option>
                  ))}
                </select>
                {!isLoggedIn && (
                  <div className="ml-2 text-xs text-[#30364F] font-mono bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm px-2 py-1 shadow-[2px_2px_0_#30364F]">
                    Sign in to participate
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div key={i} className="flex gap-2 items-center border-2 border-[#30364F] bg-[#E1D9BC] rounded p-2 shadow-[2px_2px_0_#30364F]">
                <span className="text-xs font-bold text-[#30364F]">Slot #{i + 1}</span>
                <span className="text-xs font-mono px-2 py-1 bg-white rounded border-2 border-[#30364F]">{role}</span>
                {subscriber ? (
                  <div className="flex items-center gap-2">
                    {/* Replace with user avatar/name if available */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#30364F]" />
                    <span className="font-bold text-[#30364F]">{subscriberName}</span>
                  </div>
                ) : (
                  isLoggedIn ? (
                    <button
                      className="ml-2 px-3 py-1 font-bold text-[#30364F] bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[2px_2px_0_#30364F] hover:bg-[#F7E9A0] transition"
                      onClick={e => { e.stopPropagation(); handleJoin(i, role ?? "Programmer"); }}
                    >
                      Join as {role}
                    </button>
                  ) : (
                    <div className="relative group">
                      <button
                        className="ml-2 px-3 py-1 font-bold text-[#30364F] bg-[#E1D9BC] border-2 border-[#30364F] rounded shadow-[2px_2px_0_#30364F] opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Join as {role}
                      </button>
                      <div className="absolute left-1/2 -translate-x-1/2 top-10 z-20 hidden group-hover:block">
                        <div className="bg-[#30364F] text-[#E1D9BC] px-3 py-1 rounded-sm border-2 border-[#30364F] font-mono text-xs shadow-lg">
                          Sign in to participate
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}