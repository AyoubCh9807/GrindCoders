defmodule LivePlay.RoomSocketRegistry do
  def start_link(_) do
    Registry.start_link(keys: :duplicate, name: __MODULE__)
  end

  def register_socket(room_id) do
    Registry.register(__MODULE__, room_id, [])
  end

  def deregister_socket(room_id, pid) do
    Registry.unregister_match(__MODULE__, room_id, pid)
  end

  def get_sockets(room_id) do
    Registry.lookup(__MODULE__, room_id)
    |> Enum.map(fn {pid, _} -> pid end)
  end
end
