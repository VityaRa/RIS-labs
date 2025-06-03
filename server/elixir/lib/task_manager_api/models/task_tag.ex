defmodule TaskManagerApi.TaskTag do
  use Ecto.Schema
  alias TaskManagerApi.{Task, Tag}

  @primary_key false
  schema "task_tag" do
    belongs_to :task, Task, primary_key: true
    belongs_to :tag, Tag, primary_key: true
    
    timestamps(type: :utc_datetime)
  end

  @doc """
  Changeset для создания связи задачи и тега.
  """
  def changeset(task_tag, attrs) do
    task_tag
    |> Ecto.Changeset.cast(attrs, [:task_id, :tag_id])
    |> Ecto.Changeset.validate_required([:task_id, :tag_id])
    |> Ecto.Changeset.foreign_key_constraint(:task_id)
    |> Ecto.Changeset.foreign_key_constraint(:tag_id)
    |> Ecto.Changeset.unique_constraint([:task_id, :tag_id], name: :task_tag_task_id_tag_id_index)
  end