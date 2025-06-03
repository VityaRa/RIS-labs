import Config

config :task_manager_api,
  ecto_repos: [TaskManagerApi.Repo]

config :task_manager_api, TaskManagerApi.Repo,
  database: "task_manager_api",
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  pool_size: 10

config :task_manager_api, TaskManagerApiWeb.Endpoint,
  url: [ip: {127, 0, 0, 1}, port: 4000],
  secret_key_base: "1234",
  render_errors: [view: TaskManagerApi.ErrorView, accepts: ~w(json)],
  pubsub: [name: TaskManagerApi.PubSub, adapter: Phoenix.PubSub.PG2]

if Mix.env() == :dev do
  config :mix_test_watch,
    clear: true
end