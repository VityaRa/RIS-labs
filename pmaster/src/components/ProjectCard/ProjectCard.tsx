import { useStatuses } from "../../contexts/StatusContext";
import type { Project } from "../../types/apiTypes";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { projectStatuses } = useStatuses();

  const getStatusName = (statusId: number) => {
    const status = projectStatuses.find((s) => s.id === statusId);
    return status?.name || `Status #${statusId}`;
  };

  return (
    <div className="h-full flex flex-col p-4 cursor-pointer" onClick={onClick}>
      <div className="flex-grow space-y-4">
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="text-gray-300 line-clamp-3">{project.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-200">
          {getStatusName(project.status_id)}
        </span>
      </div>
    </div>
  );
};
