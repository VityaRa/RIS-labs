import apiClient from "./client";
import type {
  Project,
  ProjectInput,
  ProjectStatus,
  StandardArrayResponse,
  StandardResponse,
  Task,
} from "../types/apiTypes";

export const getProjects = async (): Promise<
  StandardArrayResponse<Project>
> => {
  return apiClient("/projects");
};

export const createProject = async (
  project: ProjectInput
): Promise<StandardResponse<Project>> => {
  return apiClient("/projects", "POST", project);
};

export const updateProject = async (
  id: number,
  project: ProjectInput
): Promise<StandardResponse<Project>> => {
  return apiClient(`/projects/${id}`, "PUT", project);
};

export const deleteProject = async (id: number): Promise<void> => {
  return apiClient(`/projects/${id}`, "DELETE");
};

export const getProjectTasks = async (
  projectId: number
): Promise<StandardArrayResponse<Task>> => {
  return apiClient(`/projects/${projectId}/tasks`);
};

export const getProjectStatuses = async (): Promise<
  StandardArrayResponse<ProjectStatus>
> => {
  return apiClient("/projects/statuses");
};
