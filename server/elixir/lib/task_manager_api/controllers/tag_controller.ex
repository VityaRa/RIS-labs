defmodule TaskManagerApi.Controllers.TagController do
  use Plug.Router
  alias TaskManagerApi.Repo
  alias TaskManagerApi.Models.Tag
  alias TaskManagerApi.Response.Wrapper
  import Ecto.Query

  plug :action

  def index(conn, _params) do
    tags = Repo.all(Tag)
    Wrapper.send_response(conn, 200, tags)
  end

  def create(conn, params) do
    changeset = Tag.changeset(%Tag{}, params)

    case Repo.insert(changeset) do
      {:ok, tag} ->
        Wrapper.send_response(conn, 201, tag)
      {:error, changeset} ->
        errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
        Wrapper.send_response(conn, 400, nil, errors)
    end
  end

  def update(conn, %{"id" => id} = params) do
    case Integer.parse(id) do
      {id, _} ->
        case Repo.get(Tag, id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Tag not found")
            
          tag ->
            changeset = Tag.changeset(tag, params)
            
            case Repo.update(changeset) do
              {:ok, updated_tag} ->
                Wrapper.send_response(conn, 200, updated_tag)
              {:error, changeset} ->
                errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
                Wrapper.send_response(conn, 400, nil, errors)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid tag ID")
    end
  end

  def delete(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {id, _} ->
        case Repo.get(Tag, id) do
          nil ->
            Wrapper.send_response(conn, 404, nil, "Tag not found")
            
          tag ->
            case Repo.delete(tag) do
              {:ok, _} ->
                Wrapper.send_response(conn, 204, nil)
              {:error, changeset} ->
                errors = TaskManagerApi.Controllers.ProjectController.translate_errors(changeset)
                Wrapper.send_response(conn, 500, nil, errors)
            end
        end
        
      :error ->
        Wrapper.send_response(conn, 400, nil, "Invalid tag ID")
    end
  end
end