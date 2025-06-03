defmodule TaskManagerApi.Controllers.TaskController do
  use Plug.Router
  alias TaskManagerApi.Repo
  alias TaskManagerApi.Models.Task
  alias TaskManagerApi.Models.Tag
  alias TaskManagerApi.Response.Wrapper
  import Ecto.Query

  plug :action

  def index(conn, _params) do
    query = from t in Task, order_by: [asc: t.deadline]
    tasks = Repo.all(query)
    Wrapper.send_response(conn, 200, tasks)
  end

  def project_tasks(conn, %{"project_id" => project_id}) do
    # Реализация уже есть в ProjectController
    TaskManagerApi.Controllers.ProjectController.project_tasks(conn, %{"project_id" => project_id})
  end

  def by_status(conn, %{"status_id" => status_id}) do
    case Integer.parse(status_id) do
      {status_id, _} ->
        query = from t in Task, where: t.status_id == ^status_id
        tasks = Repo.all(query)
        Wrapper.send_response(conn, 200, tasks)
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid status ID")
    end
  end

  def by_tag(conn, %{"tag_id" => tag_id}) do
    case Integer.parse(tag_id) do
      {tag_id, _} ->
        case Repo.get(Tag, tag_id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Tag not found")
            
          _tag ->
            query = from t in Task,
              join: tt in "tasktag", on: t.id == tt.task_id,
              where: tt.tag_id == ^tag_id,
              select: t
            
            tasks = Repo.all(query)
            
            if Enum.empty?(tasks) do
              Wrapper.send_response(conn, 200, [])
            else
              Wrapper.send_response(conn, 200, tasks)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid tag ID")
    end
  end

  def create(conn, params) do
    changeset = Task.changeset(%Task{}, params)

    case Repo.insert(changeset) do
      {:ok, task} ->
        Wrapper.send_response(conn, 201, task)
      {:error, changeset} ->
        errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
        Wrapper.send_response(conn, 400, nil, errors)
    end
  end

  def update(conn, %{"id" => id} = params) do
    case Integer.parse(id) do
      {id, _} ->
        case Repo.get(Task, id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Task not found")
            
          task ->
            changeset = Task.changeset(task, params)
            
            case Repo.update(changeset) do
              {:ok, updated_task} ->
                Wrapper.send_response(conn, 200, updated_task)
              {:error, changeset} ->
                errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
                Wrapper.send_response(conn, 400, nil, errors)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid task ID")
    end
  end

  def delete(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {id, _} ->
        case Repo.get(Task, id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Task not found")
            
          task ->
            case Repo.delete(task) do
              {:ok, _} ->
                Wrapper.send_response(conn, 200, %{id: id})
              {:error, changeset} ->
                errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
                Wrapper.send_response(conn, 500, nil, errors)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid task ID")
    end
  end
end