defmodule LivePlay.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      LivePlayWeb.Telemetry,
      {Phoenix.PubSub, name: LivePlay.PubSub},
      {Finch, name: LivePlay.Finch},
      #Id server
      LivePlay.IdServer,

      #Registries
      {Registry, keys: :unique, name: LivePlay.RoomRegistry},
      {Registry, keys: :unique, name: LivePlay.SocketRegistry},
      {Registry, keys: :duplicate, name: LivePlay.RoomSocketRegistry},

      #Supervisors
      {LivePlay.RoomSupervisor, []},
      {LivePlay.SocketSupervisor, []},

      LivePlayWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: LivePlay.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    LivePlayWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
