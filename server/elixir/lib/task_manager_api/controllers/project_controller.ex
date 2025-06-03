defmodule TaskManagerApi.Controllers.ProjectController do
  use Plug.Router
  alias TaskManagerApi.Repo
  alias TaskManagerApi.Models.Project
  alias TaskManagerApi.Models.Task
  alias TaskManagerApi.Response.Wrapper
  import Ecto.Query

  plug :action

  def index(conn, _params) do
    projects = Repo.all(Project)
    Wrapper.send_response(conn, 200, projects)
  end

  def project_tasks(conn, %{"project_id" => project_id}) do
    case Integer.parse(project_id) do
      {project_id, _} ->
        query = from t in Task, where: t.project_id == ^project_id
        tasks = Repo.all(query)

        if Enum.empty?(tasks) do
          case Repo.get(Project, project_id) do
            nil -> Wrapper.send_response(conn, 404, nil, "Project not found")
            _project -> Wrapper.send_response(conn, 200, tasks)
          end
        else
          Wrapper.send_response(conn, 200, tasks)
        end

      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid project ID")
    end
  end

  def create(conn, params) do
    changeset = Project.changeset(%Project{}, params)

    case Repo.insert(changeset) do
      {:ok, project} ->
        Wrapper.send_response(conn, 201, project)
      {:error, changeset} ->
        errors = translate_errors(changeset)
        Wrapper.send_response(conn, 400, nil, errors)
    end
  end

  def update(conn, %{"id" => id} = params) do
    case Integer.parse(id) do
      {id, _} ->
        case Repo.get(Project, id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Project not found")
          
          project ->
            changeset = Project.changeset(project, params)
            
            case Repo.update(changeset) do
              {:ok, updated_project} ->
                Wrapper.send_response(conn, 200, updated_project)
              {:error, changeset} ->
                errors = translate_errors(changeset)
                Wrapper.send_response(conn, 400, nil, errors)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid project ID")
    end
  end

  def delete(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {id, _} ->
        case Repo.get(Project, id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Project not found")
          
          project ->
            case Repo.delete(project) do
              {:ok, _} ->
                Wrapper.send_response(conn, 200, %{id: id})
              {:error, changeset} ->
                errors = translate_errors(changeset)
                Wrapper.send_response(conn, 500, nil, errors)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid project ID")
    end
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
    |> Enum.map(fn {k, v} -> "#{k}: #{v}" end)
    |> Enum.join(", ")
  end
end