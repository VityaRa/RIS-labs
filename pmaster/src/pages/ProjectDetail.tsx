import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects } from "../api/projects";
import { KanbanBoard } from "../components/KanbanBoard/KanbanBoard";
import type { Project } from "../types/apiTypes";

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        const projectsResponse = await getProjects();
        const foundProject = projectsResponse.data.find(
          (p) => p.id === parseInt(projectId)
        );

        if (!foundProject) {
          navigate("/projects");
          return;
        }

        setProject(foundProject);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  if (loading) return <div>Loading project details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="container flex start cursor-pointer" style={{color: 'white'}} onClick={() => navigate('/projects')}>
        {"<-"}
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold"  style={{color: 'white'}} >{project.title}</h1>
        <p className="text-gray-600"  style={{color: 'white'}} >{project.description}</p>
      </div>

      <h2 className="text-xl font-semibold mb-4"  style={{color: 'white'}} >Tasks</h2>
      <KanbanBoard projectId={project.id} />
    </div>
  );
};
