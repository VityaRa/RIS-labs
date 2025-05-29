export interface Project {
  id: number;
  title: string;
  description: string;
  status_id: number;
}

export interface ProjectInput {
  title: string;
  description: string;
  status_id: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  project_id: number;
  status_id: number;
  deadline: string;
}

export interface TaskInput {
  title: string;
  description: string;
  project_id: number;
  status_id: number;
  deadline: string;
}

export interface Tag {
  id: number;
  title: string;
  description: string;
}

export interface TagInput {
  title: string;
  description: string;
}

export interface ProjectStatus {
  id: number;
  name: string;
}

export interface TaskStatus {
  id: number;
  name: string;
}

export interface TaskStatusInput {
  name: string;
}

export interface StandardResponse<T> {
  data: T;
  error: string | null;
}

export interface StandardArrayResponse<T> {
  data: T[];
  error: string | null;
}
