'use client';

import { useState } from "react";
import { createProject } from "../actions"; 
import { SubmitButton } from "@/app/components/SubmitButton";
import Link from "next/link";
import { TechStackSelector } from "@/app/components/TechStackSelector";

export default function NewProjectPage() {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
      {/* Powrót */}
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block">
        ← Back to home
      </Link>

      <form action={createProject} className="space-y-4">
        
        {/* Proste inputy w stylu EditProject */}
        <input 
          name="title" 
          placeholder="Project Title" 
          className="w-full p-2 border rounded"
          required 
        />

        <textarea 
          name="description" 
          placeholder="What is it about?" 
          className="w-full p-2 border rounded h-32"
          required 
        />

        {/* SWITCH (zostawiam ładny, żółty styl, żeby pasowało do zaawansowanych opcji) */}
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
          <div>
            <p className="font-bold text-gray-800">Advanced settings</p>
            <p className="text-xs text-gray-500">Add more details like GitHub or Budget</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdvanced(!isAdvanced)}
            className={`${
              isAdvanced ? 'bg-yellow-400' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
          >
            <span className={`${
                isAdvanced ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} 
            />
          </button>
        </div>

        {/* DODATKOWE POLA */}
        {isAdvanced && (
          <div className="space-y-4 p-4 border-2 border-dashed rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <label className="text-sm font-medium">GitHub Repository</label>
              <input name="github" className="w-full p-2 border rounded" placeholder="https://github.com/..." />
            </div>
            
            <div>
              <label className="text-sm font-medium">Slots</label>
              <input 
                name="slots"
                type="number"
                className="w-full p-2 border rounded"
                placeholder="1"
                min="1"
                max="20"
                defaultValue={1}
              />
            </div>

            {/* Checkbox dokładnie taki jak w EditProject */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input 
                type="checkbox" 
                id="private"
                name="private" 
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-yellow-400"
              />
              <label htmlFor="private" className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">Private Project</span>
                <span className="text-[10px] text-gray-500">Only you will see this project on the main feed</span>
              </label>
            </div>
          </div>
        )}

        <TechStackSelector />
        <SubmitButton />
      </form>
    </main>
  );
}