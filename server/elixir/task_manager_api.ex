defmodule TaskManagerApi do
  @moduledoc """
  Основной модуль приложения TaskManager API.
  """

  use Application

  @impl true
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
    ]

    opts = [strategy: :one_for_one, name: TaskManagerApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    TaskManagerApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end