import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProject, getProjects } from "../api/projects";
import type { Project } from "../types/apiTypes";
import { ProjectCard } from "../components/ProjectCard/ProjectCard";
import { EditProjectModal } from "../components/EditProjectModal";

export const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [creatingProject, setCreatingProject] = useState<Project | null>(null);

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

  const handleRemoveProject = async (projectId: number) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setEditingProject(null);
  };

  const handleCreateProject = async () => {
    setCreatingProject({
      description: "",
      title: "",
      id: 1,
      status_id: 0,
    });
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
    <div className="min-h-screen p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4 mb-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Projects
          </h1>
          <p className="text-lg text-gray-200 opacity-80">
            Browse and manage all your projects
          </p>
        </header>

        <div
          className="grid grid-cols-3 gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
          style={{ gap: "8px" }}
        >
          <div
            key="create-project"
            className="glass-container transition-all duration-300 hover:translate-y-[-4px] "
            onClick={handleCreateProject}
          >
            <ProjectCard
              project={{
                description: "Create new project",
                title: "+",
                // @ts-ignore
                id: 'New',
                status_id: 0,
              }}
              onClick={() => {}}
              onEdit={() => {}}
              onRemove={() => {}}
              ignoreActions
              className="bg-gray-800"
            />
          </div>
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-container transition-all duration-300 hover:translate-y-[-4px] "
              onClick={() => handleProjectClick(project.id)}
            >
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
                onEdit={handleEditProject}
                onRemove={handleRemoveProject}
              />
            </div>
          ))}
          {editingProject && (
            <EditProjectModal
              project={editingProject}
              onClose={() => setEditingProject(null)}
              onProjectUpdated={handleProjectUpdated}
              onProjectCreated={() => {}}
            />
          )}
          {creatingProject && (
            <EditProjectModal
              project={null}
              onClose={() => setCreatingProject(null)}
              onProjectUpdated={handleProjectUpdated}
              title="Create project"
              onProjectCreated={(proj) => setProjects((prev) => [...prev, proj])}
            />
          )}
        </div>
      </div>
    </div>
  );
};
