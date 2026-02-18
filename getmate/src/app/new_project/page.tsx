'use client';

import { useState } from "react";
import { createProject } from "../actions"; // sprawdź ścieżkę do pliku z akcjami
import { SubmitButton } from "@/app/components/SubmitButton";
import Link from "next/link";

export default function NewProjectPage() {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Powrót */}
        <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block">
          ← Back to home
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black mb-6">Create New Project</h1>

          <form action={createProject} className="space-y-6">
            {/* Podstawowe dane */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Project Title
              <input 
                name="title" 
                placeholder="Cool project name..." 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                required 
              /></label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Description
              <textarea 
                name="description" 
                placeholder="What is it about?" 
                className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-yellow-400 outline-none"
                required 
              /></label>
            </div>

            {/* SWITCH */}
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
                  <input name="github" className="w-full p-2 border rounded-md" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Slots</label>
                  <input name="slots"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  placeholder="1"
                  min="1"
                  max="20"
                  defaultValue={1}
                  />
                </div>
              </div>
            )}

            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  );
}