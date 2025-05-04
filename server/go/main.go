package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)


var (
	dbHost     = os.Getenv("POSTGRES_HOST")
	dbPort     = os.Getenv("POSTGRES_PORT")
	dbUser     = os.Getenv("POSTGRES_USER")
	dbPassword = os.Getenv("POSTGRES_PASSWORD")
	dbName     = os.Getenv("POSTGRES_DB")
)

var db *sql.DB

func main() {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	fmt.Println(connStr)

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected")

	r := mux.NewRouter()

	r.HandleFunc("/api/projects", getProjects).Methods("GET")
	r.HandleFunc("/api/projects/{projectId}/tasks", getProjectTasks).Methods("GET")
	r.HandleFunc("/api/projects/statuses", getProjectStatuses).Methods("GET")
	r.HandleFunc("/api/tags", getTags).Methods("GET")
	r.HandleFunc("/api/tasks/{tagId}", getTasksByTag).Methods("GET")
	r.HandleFunc("/api/tasks/{statusId}", getTasksByStatus).Methods("GET")
	r.HandleFunc("/api/tasks/statuses", getTaskStatuses).Methods("GET")

	fmt.Println("Server is running on port 3000...")
	log.Fatal(http.ListenAndServe(":3000", r))
}

