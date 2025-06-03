defmodule TaskManagerApi.Controllers.StatusController do
  use Plug.Router
  alias TaskManagerApi.Repo
  alias TaskManagerApi.Models.ProjectStatus
  alias TaskManagerApi.Models.TaskStatus
  alias TaskManagerApi.Response.Wrapper

  plug :action

  def project_statuses(conn, _params) do
    statuses = Repo.all(ProjectStatus)
    Wrapper.send_response(conn, 200, statuses)
  end

  def task_statuses(conn, _params) do
    statuses = Repo.all(TaskStatus)
    Wrapper.send_response(conn, 200, statuses)
  end

  def create_task_status(conn, params) do
    changeset = TaskStatus.changeset(%TaskStatus{}, params)

    case Repo.insert(changeset) do
      {:ok, status} ->
        Wrapper.send_response(conn, 201, status)
      {:error, changeset} ->
        errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
        Wrapper.send_response(conn, 400, nil, errors)
    end
  end

  # Аналогичные методы для project statuses можно добавить по необходимости
end