// components/ProjectCard.tsx
import { useState } from "react";
import type { Project } from "../../types/apiTypes";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (project: Project) => void;
  onRemove: (projectId: number) => void;
  ignoreActions?: boolean;
  className?: string;
}

export const ProjectCard = ({
  project,
  onClick,
  onEdit,
  onRemove,
  ignoreActions,
  className,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={classNames("relative border rounded-lg p-4  border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer h-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white text-left">{project.title}</h3>
          <p className="text-gray-400 text-left">{project.description}</p>
        </div>
        <span className="text-xs rounded-full text-gray-300">
          #{project.id}
        </span>
      </div>

      {/* Actions Bar (shown on hover) */}
      {isHovered && !ignoreActions && (
        <div
          className="absolute top-2 right-2 flex space-x-2 bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700"
          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking actions
        >
          <button
            onClick={() => onEdit(project)}
            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
            title="Edit project"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(project.id)}
            className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
            title="Delete project"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
