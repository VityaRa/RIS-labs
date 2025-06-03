defmodule TaskManagerApi.ProjectStatus do
  use Ecto.Schema
  import Ecto.Changeset
  alias TaskManagerApi.Project

  @primary_key {:id, :id, autogenerate: true}
  schema "project_status" do
    field :name, :string
    field :color, :string, default: "#6b7280"
    
    # Ассоциации
    has_many :projects, Project
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(project_status, attrs) do
    project_status
    |> cast(attrs, [:name, :color])
    |> validate_required([:name])
    |> validate_length(:name, min: 3, max: 50)
    |> validate_format(:color, ~r/^#[0-9a-fA-F]{6}$/)
    |> unique_constraint(:name)
  end

  @doc """
  Предопределенные статусы для seeds.
  """
  def predefined_statuses do
    [
      %{name: "Planning", color: "#f59e0b"},
      %{name: "Active", color: "#10b981"},
      %{name: "On Hold", color: "#6366f1"},
      %{name: "Completed", color: "#64748b"},
      %{name: "Cancelled", color: "#ef4444"}
    ]
  end
end