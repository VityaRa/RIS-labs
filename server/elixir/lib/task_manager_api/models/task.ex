defmodule TaskManagerApi.Task do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query
  alias TaskManagerApi.{Project, TaskStatus, Tag, TaskTag}

  @primary_key {:id, :id, autogenerate: true}
  schema "task" do
    field :title, :string
    field :description, :string
    field :deadline, :utc_datetime
    field :project_id, :integer
    field :status_id, :integer
    
    # Ассоциации
    belongs_to :project, Project
    belongs_to :status, TaskStatus, foreign_key: :status_id
    many_to_many :tags, Tag, join_through: TaskTag
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :description, :project_id, :status_id, :deadline])
    |> validate_required([:title, :project_id, :status_id])
    |> validate_length(:title, min: 3, max: 100)
    |> validate_length(:description, max: 1000)
    |> validate_deadline()
    |> foreign_key_constraint(:project_id)
    |> foreign_key_constraint(:status_id)
  end

  defp validate_deadline(changeset) do
    deadline = get_field(changeset, :deadline)
    
    if deadline && DateTime.compare(deadline, DateTime.utc_now()) == :lt do
      add_error(changeset, :deadline, "cannot be in the past")
    else
      changeset
    end
  end

  @doc """
  Changeset для обновления задачи с дополнительными проверками.
  """
  def update_changeset(task, attrs) do
    task
    |> changeset(attrs)
    |> validate_project_exists()
    |> validate_status_exists()
  end

  defp validate_project_exists(changeset) do
    project_id = get_field(changeset, :project_id)
    if project_id && TaskManagerApi.Repo.get(Project, project_id) do
      changeset
    else
      add_error(changeset, :project_id, "does not exist")
    end
  end

  defp validate_status_exists(changeset) do
    status_id = get_field(changeset,