package main

import (
	Response "api/response"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func getProjects(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description, status_id FROM project")
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.StatusID); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		projects = append(projects, p)
	}

	Response.Send(w, http.StatusOK, projects, "")
}

func getProjectTasks(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectID, err := strconv.Atoi(vars["projectId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid project ID")
		return
	}

	rows, err := db.Query("SELECT id, title, description, project_id, status_id, deadline FROM task WHERE project_id = $1", projectID)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.ProjectID, &t.StatusID, &t.Deadline); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		tasks = append(tasks, t)
	}

	if len(tasks) == 0 {
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM project WHERE id = $1)", projectID).Scan(&exists)
		if err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		if !exists {
			Response.Send(w, http.StatusNotFound, nil, "Project not found")
			return
		}
	}

	Response.Send(w, http.StatusOK, tasks, "")
}

func getProjectStatuses(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name FROM projectstatus")
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var statuses []ProjectStatus
	for rows.Next() {
		var s ProjectStatus
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		statuses = append(statuses, s)
	}

	Response.Send(w, http.StatusOK, statuses, "")
}

func getTags(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description FROM tag")
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Title, &t.Description); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		tags = append(tags, t)
	}

	Response.Send(w, http.StatusOK, tags, "")
}

func getTasksByTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tagID, err := strconv.Atoi(vars["tagId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid tag ID")
		return
	}

	rows, err := db.Query(`
		SELECT t.id, t.title, t.description, t.project_id, t.status_id, t.deadline 
		FROM task t
		JOIN tasktag tt ON t.id = tt.task_id
		WHERE tt.tag_id = $1
	`, tagID)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.ProjectID, &t.StatusID, &t.Deadline); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		tasks = append(tasks, t)
	}

	if len(tasks) == 0 {
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM tag WHERE id = $1)", tagID).Scan(&exists)
		if err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		if !exists {
			Response.Send(w, http.StatusNotFound, nil, "Tag not found")
			return
		}
	}

	Response.Send(w, http.StatusOK, tasks, "")
}

func getTasksByStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	statusID, err := strconv.Atoi(vars["statusId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid status ID")
		return
	}

	rows, err := db.Query("SELECT id, title, description, project_id, status_id, deadline FROM task WHERE status_id = $1", statusID)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.ProjectID, &t.StatusID, &t.Deadline); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		tasks = append(tasks, t)
	}

	Response.Send(w, http.StatusOK, tasks, "")
}

func getTaskStatuses(w http.ResponseWriter, r *http.Request) {
	log.Printf("getTaskStatuses request started")

	rows, err := db.Query("SELECT id, name FROM taskstatuses")
	log.Printf("queried")
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()
	log.Printf("test1")

	var statuses []TaskStatus
	for rows.Next() {
		var s TaskStatus
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		statuses = append(statuses, s)
	}
	log.Printf("2")

	Response.Send(w, http.StatusOK, statuses, "")
}

func getAllTasks(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, title, description, project_id, status_id, deadline 
		FROM task
		ORDER BY deadline ASC
	`)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(
			&t.ID,
			&t.Title,
			&t.Description,
			&t.ProjectID,
			&t.StatusID,
			&t.Deadline,
		); err != nil {
			Response.Send(w, http.StatusInternalServerError, nil, err.Error())
			return
		}
		tasks = append(tasks, t)
	}

	if err = rows.Err(); err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	Response.Send(w, http.StatusOK, tasks, "")
}

// Project CRUD
func createProject(w http.ResponseWriter, r *http.Request) {
	var p Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	err := db.QueryRow(`
        INSERT INTO project (title, description, status_id)
        VALUES ($1, $2, $3)
        RETURNING id
    `, p.Title, p.Description, p.StatusID).Scan(&p.ID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	Response.Send(w, http.StatusCreated, p, "")
}

func updateProject(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectID, err := strconv.Atoi(vars["projectId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid project ID")
		return
	}

	var p Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	result, err := db.Exec(`
        UPDATE project 
        SET title = $1, description = $2, status_id = $3
        WHERE id = $4
    `, p.Title, p.Description, p.StatusID, projectID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		Response.Send(w, http.StatusNotFound, nil, "Project not found")
		return
	}

	p.ID = projectID
	Response.Send(w, http.StatusOK, p, "")
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectID, err := strconv.Atoi(vars["projectId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid project ID")
		return
	}

	result, err := db.Exec("DELETE FROM project WHERE id = $1", projectID)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		Response.Send(w, http.StatusNotFound, nil, "Project not found")
		return
	}

	Response.Send(w, http.StatusNoContent, nil, "")
}

// Task CRUD
func createTask(w http.ResponseWriter, r *http.Request) {
	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	err := db.QueryRow(`
        INSERT INTO task (title, description, project_id, status_id, deadline)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `, t.Title, t.Description, t.ProjectID, t.StatusID, t.Deadline).Scan(&t.ID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	Response.Send(w, http.StatusCreated, t, "")
}

func updateTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["taskId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid task ID")
		return
	}

	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	result, err := db.Exec(`
        UPDATE task 
        SET title = $1, description = $2, project_id = $3, status_id = $4, deadline = $5
        WHERE id = $6
    `, t.Title, t.Description, t.ProjectID, t.StatusID, t.Deadline, taskID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		Response.Send(w, http.StatusNotFound, nil, "Task not found")
		return
	}

	t.ID = taskID
	Response.Send(w, http.StatusOK, t, "")
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["taskId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid task ID")
		return
	}

	result, err := db.Exec("DELETE FROM task WHERE id = $1", taskID)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		Response.Send(w, http.StatusNotFound, nil, "Task not found")
		return
	}

	Response.Send(w, http.StatusNoContent, nil, "")
}

// Tag CRUD
func createTag(w http.ResponseWriter, r *http.Request) {
	var t Tag
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	err := db.QueryRow(`
        INSERT INTO tag (title, description)
        VALUES ($1, $2)
        RETURNING id
    `, t.Title, t.Description).Scan(&t.ID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	Response.Send(w, http.StatusCreated, t, "")
}

func updateTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tagID, err := strconv.Atoi(vars["tagId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid tag ID")
		return
	}

	var t Tag
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	result, err := db.Exec(`
        UPDATE tag 
        SET title = $1, description = $2
        WHERE id = $3
    `, t.Title, t.Description, tagID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		Response.Send(w, http.StatusNotFound, nil, "Tag not found")
		return
	}

	t.ID = tagID
	Response.Send(w, http.StatusOK, t, "")
}

func deleteTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tagID, err := strconv.Atoi(vars["tagId"])
	if err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid tag ID")
		return
	}

	result, err := db.Exec("DELETE FROM tag WHERE id = $1", tagID)
	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		Response.Send(w, http.StatusNotFound, nil, "Tag not found")
		return
	}

	Response.Send(w, http.StatusNoContent, nil, "")
}

// Status CRUD (similar for ProjectStatus and TaskStatus)
func createTaskStatus(w http.ResponseWriter, r *http.Request) {
	var s TaskStatus
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		Response.Send(w, http.StatusBadRequest, nil, "Invalid request payload")
		return
	}

	err := db.QueryRow(`
        INSERT INTO taskstatuses (name)
        VALUES ($1)
        RETURNING id
    `, s.Name).Scan(&s.ID)

	if err != nil {
		Response.Send(w, http.StatusInternalServerError, nil, err.Error())
		return
	}

	Response.Send(w, http.StatusCreated, s, "")
}

// Add similar update/delete methods for statuses
