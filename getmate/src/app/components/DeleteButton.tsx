'use client';


export function DeleteButton() {
  return (
    <button
      type="submit"
      className="w-full danger font-bold"
      onClick={(e) => {
        if (!confirm("Na pewno chcesz usunąć ten projekt?")) {
          e.preventDefault();
        }
      }}
    >
      Delete Project
    </button>
  );
}