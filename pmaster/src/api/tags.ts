import apiClient from "./client";
import type {
  Tag,
  TagInput,
  StandardArrayResponse,
  StandardResponse,
} from "../types/apiTypes";

export const getTags = async (): Promise<StandardArrayResponse<Tag>> => {
  return apiClient("/tags");
};

export const createTag = async (
  tag: TagInput
): Promise<StandardResponse<Tag>> => {
  return apiClient("/tags", "POST", tag);
};

export const updateTag = async (
  id: number,
  tag: TagInput
): Promise<StandardResponse<Tag>> => {
  return apiClient(`/tags/${id}`, "PUT", tag);
};

export const deleteTag = async (id: number): Promise<void> => {
  return apiClient(`/tags/${id}`, "DELETE");
};
