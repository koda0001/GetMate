"use client"

import Link from "next/link";
// import { useSession } from "next-auth/react"; // Jeśli używasz NextAuth

export function ProjectCard({ project }: { project: any }) {
  // Pobieramy ID aktualnego użytkownika (opcjonalnie, do logiki przycisku)
  // const { data: session } = useSession();
  // const userId = session?.user?.id;

  const occupied = project.subscribers?.length || 0;
  const total = project.slots || 0;
  const free = total - occupied;
  const isFull = free <= 0;
  
  // Sprawdzenie czy zalogowany user już jest zapisany
  // const isSubscribed = project.subscribers.includes(userId);

  return (
    <Link href={`/edit-project/${project.id}`}>
      <div className="bg-yellow-100 grid grid-cols-2 p-6 rounded-2xl border-4 border-blue-300 hover:border-blue-500 transition-all shadow-sm">
        
        {/* Lewa strona: Info o projekcie */}
        <div className="flex flex-col border-r border-blue-200 pr-4">
          <h3 className="text-xl font-bold mb-2 truncate">{project.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>
          
          <div className="mt-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-gray-400">Active</span>
          </div>
        </div>

        {/* Prawa strona: Sloty i Join */}
        <div className="pl-4 flex flex-col justify-center text-center">
          <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">
            Free Spots
          </span>
          
          <div className="my-2">
            <span className={`text-4xl font-black ${isFull ? 'text-red-500' : 'text-gray-900'}`}>
              {free}
            </span>
            <span className="text-xl font-bold text-gray-400">/{total}</span>
          </div>

          <button 
            disabled={isFull}
            className={`w-full py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              isFull 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {isFull ? "CLOSED" : "JOIN NOW"}
          </button>
        </div>

      </div>
    </Link>
  );
}