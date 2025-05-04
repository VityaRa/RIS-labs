package main

type Project struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	StatusID    int    `json:"status_id"`
}

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ProjectID   int    `json:"project_id"`
	StatusID    int    `json:"status_id"`
	Deadline    string `json:"deadline"`
}

type Tag struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type ProjectStatus struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type TaskStatus struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}