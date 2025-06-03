defmodule TaskManagerApi.TaskStatus do
  use Ecto.Schema
  import Ecto.Changeset
  alias TaskManagerApi.Task

  @primary_key {:id, :id, autogenerate: true}
  schema "task_status" do
    field :name, :string
    field :color, :string, default: "#6b7280"
    field :is_completed, :boolean, default: false
    
    # Ассоциации
    has_many :tasks, Task
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(task_status, attrs) do
    task_status
    |> cast(attrs, [:name, :color, :is_completed])
    |> validate_required([:name, :is_completed])
    |> validate_length(:name, min: 3, max: 50)
    |> validate_format(:color, ~r/^#[0-9a-fA-F]{6}$/)
    |> unique_constraint(:name)
  end

  @doc """
  Предопределенные статусы задач для seeds.
  """
  def predefined_statuses do
    [
      %{name: "Backlog", color: "#9ca3af", is_completed: false},
      %{name: "To Do", color: "#3b82f6", is_completed: false},
      %{name: "In Progress", color: "#f59e0b", is_completed: false},
      %{name: "In Review", color: "#6366f1", is_completed: false},
      %{name: "Done", color: "#10b981", is_completed: true},
      %{name: "Cancelled", color: "#ef4444", is_completed: true}
    ]
  end
end