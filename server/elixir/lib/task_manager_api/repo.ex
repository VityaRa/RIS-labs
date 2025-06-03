
defmodule TaskManagerApi.Repo do
  use Ecto.Repo,
    otp_app: :task_manager_api,
    adapter: Ecto.Adapters.Postgres
end