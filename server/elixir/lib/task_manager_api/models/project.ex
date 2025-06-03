defmodule TaskManagerApi.Project do
  use Ecto.Schema
  import Ecto.Changeset
  alias TaskManagerApi.{Task, ProjectStatus}

  @primary_key {:id, :id, autogenerate: true}
  schema "project" do
    field :title, :string
    field :description, :string
    field :status_id, :integer
    
    # Ассоциации
    belongs_to :status, ProjectStatus, foreign_key: :status_id
    has_many :tasks, Task
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:title, :description, :status_id])
    |> validate_required([:title, :status_id])
    |> validate_length(:title, min: 3, max: 100)
    |> validate_length(:description, max: 500)
    |> foreign_key_constraint(:status_id)
  end

  @doc """
  Создает changeset для создания нового проекта с валидацией.
  """
  def create_changeset(project, attrs) do
    project
    |> changeset(attrs)
    |> validate_status_exists()
  end

  defp validate_status_exists(changeset) do
    status_id = get_field(changeset, :status_id)
    if status_id && TaskManagerApi.Repo.get(ProjectStatus, status_id) do
      changeset
    else
      add_error(changeset, :status_id, "does not exist")
    end
  end
end