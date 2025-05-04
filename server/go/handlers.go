package main

import (
	Response "api/response"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func getProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description, status_id FROM project")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.StatusID); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		projects = append(projects, p)
	}

	Response.Send(w, http.StatusOK, projects)
}

func getProjectTasks(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectID, err := strconv.Atoi(vars["projectId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	rows, err := db.Query("SELECT id, title, description, project_id, status_id, deadline FROM task WHERE project_id = $1", projectID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.ProjectID, &t.StatusID, &t.Deadline); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, t)
	}

	if len(tasks) == 0 {
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM project WHERE id = $1)", projectID).Scan(&exists)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !exists {
			Response.Send(w, http.StatusNotFound, "Project not found")
			return
		}
	}

	Response.Send(w, http.StatusOK, tasks)
}

func getProjectStatuses(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name FROM projectstatus")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var statuses []ProjectStatus
	for rows.Next() {
		var s ProjectStatus
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		statuses = append(statuses, s)
	}

	Response.Send(w, http.StatusOK, statuses)
}

func getTags(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description FROM tag")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Title, &t.Description); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tags = append(tags, t)
	}

	Response.Send(w, http.StatusOK, tags)
}

func getTasksByTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tagID, err := strconv.Atoi(vars["tagId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, "Invalid tag ID")
		return
	}

	rows, err := db.Query(`
		SELECT t.id, t.title, t.description, t.project_id, t.status_id, t.deadline 
		FROM task t
		JOIN tasktag tt ON t.id = tt.task_id
		WHERE tt.tag_id = $1
	`, tagID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.ProjectID, &t.StatusID, &t.Deadline); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, t)
	}

	if len(tasks) == 0 {
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM tag WHERE id = $1)", tagID).Scan(&exists)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !exists {
			Response.Send(w, http.StatusNotFound, "Tag not found")
			return
		}
	}

	Response.Send(w, http.StatusOK, tasks)
}

func getTasksByStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	statusID, err := strconv.Atoi(vars["statusId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, "Invalid status ID")
		return
	}

	rows, err := db.Query("SELECT id, title, description, project_id, status_id, deadline FROM task WHERE status_id = $1", statusID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.ProjectID, &t.StatusID, &t.Deadline); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, t)
	}

	Response.Send(w, http.StatusOK, tasks)
}

func getTaskStatuses(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name FROM taskstatuses")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var statuses []TaskStatus
	for rows.Next() {
		var s TaskStatus
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		statuses = append(statuses, s)
	}

	Response.Send(w, http.StatusOK, statuses)
}
