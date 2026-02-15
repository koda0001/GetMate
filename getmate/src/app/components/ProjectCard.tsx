"use client"

export function ProjectCard({ project }: { project: any }) {

  
  return ( 
    
    <div key={project.id} className="bg-yellow-100 grid grid-cols-2 p-6 rounded-2 border-4 border-blue-300 hover:border-blue-500 transition-all">
      <div>
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
        <div className="flex items-center gap-2 mt-auto">
          <img src={project.author.image!} className="w-6 h-6 rounded-full" />
          <span className="text-xs text-gray-500">By {project.author.name}</span>
        </div>
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2">free spots</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">4/5</p>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-400 transition">Join</button>
      </div>
    </div>
  );
}