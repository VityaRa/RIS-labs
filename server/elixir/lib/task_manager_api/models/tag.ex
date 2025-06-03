defmodule TaskManagerApi.Tag do
  use Ecto.Schema
  import Ecto.Changeset
  alias TaskManagerApi.{Task, TaskTag}

  @primary_key {:id, :id, autogenerate: true}
  schema "tag" do
    field :title, :string
    field :description, :string
    
    # Ассоциации
    many_to_many :tasks, Task, join_through: TaskTag
    
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(tag, attrs) do
    tag
    |> cast(attrs, [:title, :description])
    |> validate_required([:title])
    |> validate_length(:title, min: 2, max: 50)
    |> validate_length(:description, max: 200)
    |> unique_constraint(:title)
  end

  @doc """
  Changeset для создания тега с дополнительной валидацией.
  """
  def create_changeset(tag, attrs) do
    tag
    |> changeset(attrs)
    |> maybe_generate_color()
  end

  defp maybe_generate_color(changeset) do
    if get_change(changeset, :color) do
      changeset
    else
      put_change(changeset, :color, generate_random_color())
    end
  end

  defp generate_random_color do
    "#" <> Enum.take_random('0123456789ABCDEF', 6) |> to_string()
  end
end