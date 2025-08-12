defmodule LivePlay.SocketServer do
  alias LivePlay.RoomServer
  use GenServer
  use Phoenix.Channel
  alias LivePlay.Player

  def start_link({client_id, username}) do
    GenServer.start_link(__MODULE__, {client_id, username}, name: via(client_id))
  end

  def send_message(msg, client_id) do
    GenServer.cast(via(client_id), {:send_message, msg})
  end

  def via(client_id) do
    {:via, Registry, {LivePlay.SocketRegistry, {client_id}}}
  end

  # Forwarding to RoomServer
  def join_room(room_id, player), do: RoomServer.join_room(room_id, player)
  def leave_room(room_id, player), do: RoomServer.leave_room(room_id, player)
  def modify_score(room_id, player, val), do: RoomServer.modify_score(room_id, player, val)
  def assign_language(room_id, language), do: RoomServer.assign_language(room_id, language)
  def get_winner(room_id), do: RoomServer.get_winner(room_id)
  def get_correct_answers(room_id, player), do: RoomServer.get_correct_answers(room_id, player)
  def get_questions(room_id, language), do: RoomServer.get_questions(room_id, language)

  def get_incorrect_answers(room_id, player),
    do: RoomServer.get_incorrect_answers(room_id, player)

  # ----- GenServer callbacks -----
  def init({client_id, username}) do
    IO.puts("Socket ready for player #{client_id}")

    {:ok,
     %Player{
       id: client_id,
       username: username,
       score: 0,
       correct_answers: 0,
       incorrect_answers: 0
     }}
  end

  @impl true
  def handle_info({:push, payload}, socket) do
    push(socket, payload.event, Map.drop(payload, [:event]))
    {:noreply, socket}
  end
end
