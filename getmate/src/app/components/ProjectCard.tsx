'use client';
import { joinProject } from "../actions";
import Link from "next/link";

export function ProjectCard({ project, currentUserId }: { project: any, currentUserId?: string }) {
  const occupied = project.subscribers?.filter((id: string) => id.trim() !== "").length || 0;
  const total = project.slots || 0;
  const free = total - occupied;
  const isFull = free <= 0;
  const isSubscribed = project.subscribers.includes(currentUserId);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault(); // ZATRZYMUJE przekierowanie do edycji!
    try {
      await joinProject(project.id);
      alert("Dołączono do projektu!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="relative">
      <Link href={`/edit-project/${project.id}`}>
        <div className="bg-yellow-100 grid grid-cols-2 p-6 rounded-2xl border-4 border-blue-300 hover:border-blue-500 transition-all shadow-sm">
          
          {/* Lewa strona: Info o projekcie */}
          <div className="flex flex-col border-r border-blue-200 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold mb-2 truncate">{project.title}</h3>
              {project.private && (
                <span className="bg-gray-200 text-gray-600 p-1 rounded-md text-[10px] mb-2">
                  🔒 Private
                </span>
              )}
            </div>
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
              onClick={handleJoin}
              disabled={isFull || isSubscribed}
              className={`w-full py-2 rounded-xl font-bold ... ${
                isFull || isSubscribed ? 'bg-gray-200' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubscribed ? "ALREADY JOINED" : isFull ? "CLOSED" : "JOIN NOW"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}