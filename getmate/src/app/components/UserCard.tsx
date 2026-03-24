import Link from "next/link";

interface UserCardProps {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    bio?: string | null;
    techStack?: string[];
    availability?: string;
  };
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/profile/${user.id}`} className="group">
      <div className="border-4 border-black bg-[#FDFDEE] p-5 shadow-[8px_8px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0_0_#000] transition-all flex flex-col h-full gap-4">
        
        {/* HEADER: Zdjęcie i Nazwa */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-4 border-black bg-white overflow-hidden flex-shrink-0 shadow-[2px_2px_0_0_#000]">
            {user.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-2xl">
                ?
              </div>
            )}
          </div>
          <div>
            <h3 className="font-black text-xl uppercase leading-none group-hover:underline">
              {user.name || "Anonymous"}
            </h3>
            <span className="text-[10px] font-mono font-bold uppercase bg-black text-white px-2 py-0.5 mt-1 inline-block">
              {user.availability || "Offline"}
            </span>
          </div>
        </div>

        {/* BIO: Krótki opis */}
        {user.bio && (
          <p className="text-sm font-medium line-clamp-2 border-l-4 border-black pl-2 py-1 italic">
            "{user.bio}"
          </p>
        )}

        {/* TECH STACK: Tagi */}
        {user.techStack && user.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {user.techStack.slice(0, 4).map((tech) => (
              <span 
                key={tech} 
                className="text-[10px] font-bold border-2 border-black px-2 py-0.5 bg-[#A3E635] shadow-[2px_2px_0_0_#000]"
              >
                {tech.toUpperCase()}
              </span>
            ))}
            {user.techStack.length > 4 && (
              <span className="text-[10px] font-bold opacity-50">+{user.techStack.length - 4} MORE</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}