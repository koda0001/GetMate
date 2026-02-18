'use client';

import { useState } from "react";

export function SlotsGrid({ project }: { project: any }) {
  const [slotsCount, setSlotsCount] = useState(project?.slots || 1);
  const [sixSlots, setSixSlots] = useState(slotsCount > 5); // Inicjalizacja na starcie
    console.log("project data",project)
  // Funkcja obsługująca zmianę
  const handleSlotsChange = (value: string) => {
    const num = parseInt(value) || 1;
    setSlotsCount(num);
    
    // Sprawdzamy 'num', a nie 'slotsCount', bo 'num' jest aktualne!
    if (num > 5) {
      setSixSlots(true);
    } else {
      setSixSlots(false);
    }
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

      {/* Dynamiczna siatka */}
      <div className={`grid gap-4 transition-all duration-300 ${
        sixSlots ? 'grid-cols-2' : 'grid-cols-1'
      }`}>
        {Array.from({ length: slotsCount }).map((_, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-200">
            <label className="text-xs font-bold text-gray-400">Slot Info #{i + 1}</label>
            <input
              name={"slot_description"}
              placeholder={`Opis dla slotu ${i + 1}`}
              defaultValue={project.subscribers?.[i] || ""}
              className="w-full p-2 border rounded-md bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}