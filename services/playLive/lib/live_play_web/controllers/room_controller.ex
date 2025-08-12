defmodule LivePlayWeb.RoomController do
  use LivePlayWeb, :controller
  alias LivePlay.RoomServer

  def create_room(conn, %{"name" => name}) do
    # Generate a new room id from IdServer
    room_id = LivePlay.IdServer.generate_id()

    case DynamicSupervisor.start_child(
           LivePlay.RoomSupervisor,
           {LivePlay.RoomServer, {room_id, name}}
         ) do
      {:ok, _pid} ->
        IO.puts("room created successfully")
        json(conn, %{status: "ok", room_id: room_id, room_name: name})

      {:error, {:already_started, _pid}} ->
        send_error(conn, 409, "Room already exists")

      {:error, reason} ->
        send_error(conn, 500, "Failed to create room: #{inspect(reason)}")
    end
  end

  # get the current rooms
  def get_rooms(conn, _params) do
    room_ids = Registry.select(LivePlay.RoomRegistry, [{{:"$1", :_, :_}, [], [:"$1"]}])
    IO.inspect(room_ids, label: "room ids")

    rooms =
      Enum.map(room_ids, fn room_id ->
        case RoomServer.get_room(room_id) do
          {:ok, room} -> room
          {:error, :not_found} -> nil
          _ -> nil
        end
      end)
      |> Enum.reject(&is_nil/1)

    IO.inspect(rooms, label: "final collected rooms (not nil)")

    json(conn, %{rooms: rooms})
  end

  # get a specific room
  def get_room(conn, %{"room_id" => room_id_str}) do
    case Integer.parse(room_id_str) do
      {room_id, _} ->
        case RoomServer.get_room(room_id) do
          {:ok, room} -> json(conn, %{status: "ok", room: room})
          {:error, :room_not_found} -> send_error(conn, 400, "Room not found")
        end

      :error ->
        send_error(conn, 400, "Invalid room ID")
    end
  end

  # delete a room
  def delete_room(conn, %{"room_id" => room_id_str}) do
    {room_id, _} = Integer.parse(room_id_str)

    case Integer.parse(room_id_str) do
      {room_id, _} ->
        case RoomServer.delete_room(room_id) do
          :ok -> json(conn, %{status: "ok", message: "room successfully deleted"})
        end

      :error ->
        send_error(conn, 400, "Invalid room ID")
    end
  end

  # join a room
  def join_room(conn, %{"room_id" => room_id, "player" => player}) do
    case Integer.parse(room_id) do
      {room_id, _} ->
        case RoomServer.join_room(room_id, player) do
          :ok -> json(conn, %{status: "ok", message: "player successfully joined the room"})
          {:error, reason} -> json(conn, %{status: "error", message: inspect(reason)})
        end

      :error ->
        conn
        |> put_status(400)
        |> json(%{status: "error", message: "invalid room ID"})
    end
  end

  # leave a room
  def leave_room(conn, %{"room_id" => room_id, "player" => player}) do
    case Integer.parse(room_id) do
      {room_id, _} ->
        case RoomServer.leave_room(room_id, player) do
          {:ok, _player} ->
            json(conn, %{status: "ok", message: "player successfully left the room"})

          {:error, :player_not_in_room} ->
            json(conn, %{status: "error", message: "player not in the current room"})
        end

      :error ->
        conn
        |> put_status(400)
        |> json(%{status: "error", message: "invalid room ID"})
    end
  end

  # get winner

  def get_winner(conn, %{"room_id" => room_id}) do
    case RoomServer.get_winner(room_id) do
      {:ok, maximum} -> json(conn, %{status: "ok", winner: maximum})
      {:error, reason} -> json(conn, %{status: "error", message: inspect(reason)})
    end
  end

  # get players
  def get_players(conn, %{"room_id" => room_id}) do
    case RoomServer.get_players(room_id) do
      {:ok, players} -> json(conn, %{status: "ok", players: players})
      {:error, reason} -> json(conn, %{status: "error", message: inspect(reason)})
    end
  end

  # assign a language
  def assign_language(conn, %{"room_id" => room_id_str, "language" => language}) do
    case Integer.parse(room_id_str) do
      {room_id, _} ->
        room = RoomServer.assign_language(room_id, language)
        json(conn, %{status: "ok", room: room})

      :error ->
        json(conn, %{status: "error", message: "Failed to start room"})
    end
  end

  # get messages
  def get_messages(conn, %{"room_id" => room_id_str}) do
    case Integer.parse(room_id_str) do
      {room_id, _} ->
        messages = RoomServer.get_messages(room_id)
        json(conn, %{status: "ok", messages: messages})

      :error ->
        json(conn, %{status: "error", message: "Failed to retreive messages"})
    end
  end

  # add a message
  def add_message(conn, %{"room_id" => room_id_str, "message" => message}) do
    case Integer.parse(room_id_str) do
      {room_id, _} ->
        room = RoomServer.add_message(room_id, message)
        json(conn, %{status: "ok", updated_room: room})

      :error ->
        json(conn, %{status: "error", message: "Failed to retreive messages"})
    end
  end

  # start the actual game
  def start_game(conn, %{"room_id" => room_id_str}) do
    case Integer.parse(room_id_str) do
      {room_id, _} ->
        RoomServer.start_game(room_id)
        json(conn, %{status: "ok", message: "Game starting in 5 seconds", started: false})

      :error ->
        json(conn, %{status: "error", message: "Failed to start game"})
    end
  end


  # get questions
  def start_game(conn, %{"room_id" => room_id_str, "language"=>language}) do
    case Integer.parse(room_id_str) do
      {room_id, _} ->
        questions = RoomServer.get_questions(room_id, language)
        json(conn, %{status: "ok", message: "retreived questions", questions: questions})

      :error ->
        json(conn, %{status: "error", message: "Failed to start game"})
    end
  end

  # error helper function
  defp send_error(conn, status, message) do
    conn
    |> put_status(status)
    |> json(%{status: "error", message: message})
  end
end
