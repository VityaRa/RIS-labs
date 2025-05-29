import apiClient from "./client";
import type {
  TaskStatus,
  TaskStatusInput,
  StandardArrayResponse,
  StandardResponse,
} from "../types/apiTypes";

export const getTaskStatuses = async (): Promise<
  StandardArrayResponse<TaskStatus>
> => {
  return apiClient("/tasks/statuses");
};

export const createTaskStatus = async (
  status: TaskStatusInput
): Promise<StandardResponse<TaskStatus>> => {
  return apiClient("/tasks/statuses", "POST", status);
};
