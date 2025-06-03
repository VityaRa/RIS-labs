
defmodule TaskManagerApi.Router do
  use Plug.Router
  use Plug.ErrorHandler
  alias TaskManagerApi.Response.Wrapper

  plug CORSPlug, origin: "*"
  plug :match
  plug Plug.Parsers, parsers: [:json], json_decoder: Jason
  plug :dispatch

  # Project routes
  get "/api/projects" do
    TaskManagerApi.ProjectController.get_projects(conn)
  end

  get "/api/projects/:project_id/tasks" do
    TaskManagerApi.ProjectController.get_project_tasks(conn, %{"project_id" => project_id})
  end

  # ... другие маршруты ...

  match _ do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, Jason.encode!(Wrapper.wrap_error("Not Found")))
  end

  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(conn.status, Jason.encode!(Wrapper.wrap_error("Something went wrong")))
  end
end