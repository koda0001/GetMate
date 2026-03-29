// src/app/users/page.tsx
import { db } from "@/server/db";
import { UserSearch } from "../components/UserSearch";
import Link from "next/link";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  // W Next.js 15+ searchParams to Promise!
  const { query } = await searchParams;

  const users = await db.user.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { techStack: { hasSome: [query] } }, // Jeśli szukasz po technologiach
      ]
    } : {},
    orderBy: { name: 'asc' }
  });

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-8 block font-mono">
        ← Back to home
      </Link>
      <h1 className="text-3xl font-bold mb-8 text-[#30364F]">Community Members</h1>
      
      <UserSearch />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <Link 
              href={`/profile/${user.id}`} 
              key={user.id}
              className="border-2 border-[#30364F] p-4 bg-[#E1D9BC] shadow-[4px_4px_0_#30364F] hover:-translate-y-1 hover:shadow-[6px_6px_0_#30364F] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#30364F] flex-shrink-0 overflow-hidden">
                   {user.image && <img src={user.image} alt={user.name || ""} />}
                </div>
                <div>
                  <h3 className="font-bold text-[#30364F]">{user.name}</h3>
                  <p className="text-xs font-mono opacity-70">{user.availability || "No status"}</p>
                </div>
              </div>
              
              {user.techStack && user.techStack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {user.techStack.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 bg-white border border-[#30364F] rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-[#30364F] opacity-50">
            No users found matching "{query}"
          </div>
        )}
      </div>
    </main>
  );
}