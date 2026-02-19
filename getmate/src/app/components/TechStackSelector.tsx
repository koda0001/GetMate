'use client';
import React, { useState } from "react";

const PREDEFINED_TECHS = [
  "React", "Next.js", "Node.js", "Python", "Django", "Flask", "TypeScript", "JavaScript", "C#", "Java", "Go", "Rust", "PostgreSQL", "MongoDB"
];

export function TechStackSelector({ initial = [], name = "techStack" }: { initial?: string[], name?: string }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    tag = tag.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  return (
    <div>
      <label className="block font-mono text-xs mb-1">Tech Stack</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm font-mono text-xs font-bold shadow-[2px_2px_0_#30364F]"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-[#30364F] hover:text-red-600 font-bold"
              onClick={() => removeTag(tag)}
              tabIndex={-1}
            >×</button>
            <input type="hidden" name={name} value={tag} />
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm px-2 py-1 font-mono text-sm"
          placeholder="Add tech and press Enter"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
            }
          }}
          list="techstack-list"
        />
        <datalist id="techstack-list">
          {PREDEFINED_TECHS.map(t => <option key={t} value={t} />)}
        </datalist>
        <select
          className="bg-[#E1D9BC] border-2 border-[#30364F] rounded-sm px-2 py-1 font-mono text-sm"
          onChange={e => {
            if (e.target.value) addTag(e.target.value);
          }}
          value=""
        >
          <option value="">+ Choose</option>
          {PREDEFINED_TECHS.filter(t => !tags.includes(t)).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}