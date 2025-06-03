
defmodule TaskManagerApi.Response.Wrapper do
  defstruct [:data, :error]

  @doc """
  Wraps successful response data
  """
  def wrap(data) do
    %__MODULE__{data: data, error: nil}
  end

  @doc """
  Wraps error message
  """
  def wrap_error(error) do
    %__MODULE__{data: nil, error: error}
  end

  @doc """
  Sends a JSON response with the given status code and data
  """
  def send_response(conn, status_code, data, error \\ nil) do
    response = if error, do: wrap_error(error), else: wrap(data)
    
    conn
    |> Plug.Conn.put_resp_content_type("application/json")
    |> Plug.Conn.send_resp(status_code, Jason.encode!(response))
  end
end