"use client"

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold disabled:bg-gray-400 transition"
    >
      {pending ? "Saving to Database..." : "Save Data"}
    </button>
  );
}