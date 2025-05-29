import apiClient from "./client";
import type {
  Task,
  TaskInput,
  StandardArrayResponse,
  StandardResponse,
} from "../types/apiTypes";

export const getTasks = async (): Promise<StandardArrayResponse<Task>> => {
  return apiClient("/tasks");
};

export const createTask = async (
  task: TaskInput
): Promise<StandardResponse<Task>> => {
  return apiClient("/tasks", "POST", task);
};

export const updateTask = async (
  id: number,
  task: TaskInput
): Promise<StandardResponse<Task>> => {
  return apiClient(`/tasks/${id}`, "PUT", task);
};

export const deleteTask = async (id: number): Promise<void> => {
  return apiClient(`/tasks/${id}`, "DELETE");
};

export const getTasksByTag = async (
  tagId: number
): Promise<StandardArrayResponse<Task>> => {
  return apiClient(`/tasks/tag/${tagId}`);
};

export const getTasksByStatus = async (
  statusId: number
): Promise<StandardArrayResponse<Task> | null> => {
  return apiClient(`/tasks/status/${statusId}`);
};
