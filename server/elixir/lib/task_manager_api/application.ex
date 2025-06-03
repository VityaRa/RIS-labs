defmodule TaskManagerApi.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      TaskManagerApi.Repo,
      # Start the Telemetry supervisor
      TaskManagerApiWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: TaskManagerApi.PubSub},
      # Start the Endpoint (http/https)
      TaskManagerApiWeb.Endpoint
      # Start a worker by calling: TaskManagerApi.Worker.start_link(arg)
      # {TaskManagerApi.Worker, arg}
    ]

    opts = [strategy: :one_for_one, name: TaskManagerApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    TaskManagerApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end