'use client';


export function DeleteButton() {    
    return (        
        <button 
      type="submit"
      onClick={(e) => {
        // To zadziała, bo to Client Component!
        if (!confirm("Na pewno chcesz usunąć ten projekt?")) {
          e.preventDefault(); 
        }
      }}
      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-bold"
    >
      Delete Project
    </button>
    );

}