'use client';


import { useState } from "react";

export function SlotsGrid({ project }: { project: any }) {
  const ROLE_OPTIONS = [
    "Programmer",
    "Graphic Designer",
    "Project Manager"
  ];
  const [slotsCount, setSlotsCount] = useState(project?.slots || 1);
  const [sixSlots, setSixSlots] = useState(slotsCount > 5);
  const [roleDefinitions, setRoleDefinitions] = useState<string[]>(
    project?.roleDefinitions || Array(slotsCount).fill(ROLE_OPTIONS[0])
  );

  const handleSlotsChange = (value: string) => {
    const num = parseInt(value) || 1;
    setSlotsCount(num);
    setSixSlots(num > 5);
    setRoleDefinitions((prev) => {
      const arr = [...prev];
      arr.length = num;
      for (let i = 0; i < num; i++) arr[i] = arr[i] || ROLE_OPTIONS[0];
      return arr;
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
        />
      </div>
      <div className={`grid gap-4 transition-all duration-300 ${sixSlots ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {Array.from({ length: slotsCount }).map((_, i) => (
          <div key={i} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-200">
            <label className="text-xs font-bold text-gray-400">Slot #{i + 1}</label>
            <input
              name="slot_description"
              placeholder={`Opis dla slotu ${i + 1}`}
              defaultValue={project.subscribers?.[i] || ""}
              className="flex-1 p-2 border rounded"
            />
            <select
              name="slot_role"
              value={roleDefinitions[i]}
              onChange={e => handleRoleChange(i, e.target.value)}
              className="p-2 border rounded bg-white"
            >
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}