import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/projects";
import type { Project } from "../types/apiTypes";
import { ProjectCard } from "../components/ProjectCard/ProjectCard";

export const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        setProjects(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading projects...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        Error: {error}
      </div>
    );

  return (
    <div
      className="min-h-screen p-8 md:p-12 lg:p-16"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4 mb-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Projects
          </h1>
          <p className="text-lg text-gray-200 opacity-80">
            Browse and manage all your projects
          </p>
        </header>

        <div className="grid grid-cols-3 gap-8 md:grid-cols-2 lg:grid-cols-3" style={{gap: '8px'}}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-container transition-all duration-300 hover:translate-y-[-4px]"
              onClick={() => handleProjectClick(project.id)}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
