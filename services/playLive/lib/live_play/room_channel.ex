defmodule LivePlay.RoomChannel do
  use Phoenix.Channel
  alias LivePlay.RoomServer
  alias LivePlay.RoomSocketRegistry

  # client joins room:room_id on join
  def join("room:" <> room_id, _payload, socket) do
    {:ok, _} = RoomSocketRegistry.register_socket(room_id)
    {:ok, assign(socket, :room_id, room_id)}
  end

  def terminate(_reason, socket) do
    RoomSocketRegistry.deregister_socket(socket.assigns.room_id, self())
    :ok
  end

  @impl true
  def handle_info({:push, %{event: event} = payload}, socket) do
    push(socket, event, Map.delete(payload, :event))
    {:noreply, socket}
  end

  # handle leave
  @impl true
  def handle_in("leave_room", %{"player" => player}, socket) do
    room_id = socket.assigns.room_id

    case RoomServer.leave_room(room_id, player) do
      {:ok, msg} -> {:reply, {:ok, %{msg: "player ##{player["id"]} left"}}, socket}
      {:error, reason} -> {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  @doc "handle modifying score"
  @impl true
  def handle_in("modify_score", %{"player" => player, "val" => val}, socket) do
    room_id = socket.assigns.room_id

    case RoomServer.modify_score(room_id, player, val) do
      {:ok, updated_players} ->
        {:reply, {:ok, %{"updated_players" => updated_players}}, socket}

      error ->
        {:reply, error, socket}
    end
  end

  @impl true
  @doc "handle deleting a room"
  def handle_in("delete_room", _payload, socket) do
    room_id = socket.assigns.room_id

    :ok = RoomServer.delete_room(room_id)
    {:reply, {:ok, %{msg: "Room successfully deleted"}}, socket}
  end

  @impl true
  @doc """
  handles getting a room
  """
  def handle_in("get_room", _payload, socket) do
    room_id = socket.assigns.room_id

    case RoomServer.get_room(room_id) do
      {:ok, room} -> {:reply, {:ok, %{room: room}}, socket}
      {:error, reason} -> {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  @doc "handle  assigning a language"
  def handle_in("assign_language", %{"language" => language}, socket) do
    room_id = socket.assigns.room_id

    case RoomServer.assign_language(room_id, language) do
      {:ok, room} -> {:reply, {:ok, %{room: room}}, socket}
      {:error, :not_found} -> {:reply, {:error, %{msg: "Room not found"}}, socket}
    end
  end

  def handle_in("message:new", %{"username" => username, "message" => message}, socket) do
    broadcast!(socket, "message:new", %{message: message, username: username})

    # Reply with :ok or whatever you want
    {:reply, {:ok, %{msg: "Message sent"}}, socket}
  end
end
