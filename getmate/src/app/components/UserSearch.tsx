// src/app/components/UserSearch.tsx
'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Zatrzymujemy przeładowanie strony
    const formData = new FormData(e.currentTarget);
    const term = formData.get('query')?.toString();

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <div className="relative flex-1">
        <input
          name="query"
          type="text"
          placeholder="Search users..."
          className="w-full p-4 border-2 border-[#30364F] bg-[#F0F0DB] shadow-[4px_4px_0_#30364F] outline-none focus:bg-white font-mono text-[#30364F]"
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
      <button 
        type="submit"
        className="px-6 py-4 bg-[#30364F] text-[#E1D9BC] font-bold border-2 border-[#30364F] shadow-[4px_4px_0_#E1D9BC] hover:bg-[#40486b] active:translate-y-1 active:shadow-none transition-all"
      >
        SEARCH
      </button>
    </form>
  );
}