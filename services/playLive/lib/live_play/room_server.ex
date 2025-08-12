defmodule LivePlay.RoomServer do
  use GenServer
  alias LivePlay.IdServer
  alias LivePlay.QuestionBank
  alias LivePlay.RoomSocketRegistry

  @max_players 2
  @countdown_time 5_000

  def start_link({room_id, name}) do
    GenServer.start_link(
      __MODULE__,
      %{
        name: name,
        room_id: room_id,
        language: "python",
        questions: [],
        players: [],
        messages: [],
        public: true,
        game_started: false,
        countdown_started: false
      },
      name: via_room(room_id)
    )
  end

  def child_spec({room_id, name}) do
    %{
      id: {:room_server, room_id},
      start: {__MODULE__, :start_link, [{room_id, name}]},
      type: :worker,
      restart: :permanent
    }
  end

  def init(state) do
    {:ok, state}
  end

  @doc "includes room check to prevent crashing"
  def call_with_check(room_id, message) do
    case Registry.lookup(LivePlay.RoomRegistry, room_id) do
      [{pid, _}] -> GenServer.call(pid, message)
      [] -> {:error, :not_found}
    end
  end

  @doc "handles registering the room id in the room registry"
  def via_room(room_id) do
    {:via, Registry, {LivePlay.RoomRegistry, room_id}}
  end

  @doc "joining a room"
  def join_room(room_id, player) do
    call_with_check(room_id, {:join_room, player})
  end

  @doc "leaving the room"
  def leave_room(room_id, player) do
    call_with_check(room_id, {:leave_room, player})
  end

  @doc "modifying the player score by a certain value"
  def modify_score(room_id, player, val) do
    call_with_check(room_id, {:modify_score, player, val})
  end

  @doc "getting the game winner"
  def get_winner(room_id) do
    call_with_check(room_id, :get_winner)
  end

  @doc "getting all the players of a specific room"
  def get_players(room_id) do
    call_with_check(room_id, :get_players)
  end

  @doc "handles getting a player's correct answers"
  def get_correct_answers(room_id, player) do
    call_with_check(room_id, {:get_correct_answers, player})
  end

  @doc "handles getting a player's incorrect answers"
  def get_incorrect_answers(room_id, player) do
    call_with_check(room_id, {:get_incorrect_answers, player})
  end

  @doc "deleting a room"
  def delete_room(room_id) do
    case Registry.lookup(LivePlay.RoomRegistry, room_id) do
      [{pid, _}] ->
        GenServer.stop(pid)
        IdServer.free_id(room_id)
        :ok

      [] ->
        :ok
    end
  end

  @doc "getting a room"
  def get_room(room_id) do
    try do
      {:ok, GenServer.call(via_room(room_id), :get_state)}
    catch
      :exit, _ -> {:error, :not_found}
    end
  end

  @doc "assign a language"
  def assign_language(room_id, language) do
    call_with_check(room_id, {:assign_language, language})
  end

  @doc "gets messages"
  def get_messages(room_id) do
    call_with_check(room_id, :get_messages)
  end

  @doc "adds a message"
  def add_message(room_id, username, message) do
    call_with_check(room_id, {:add_message, username, message})
  end

  @doc "starts a game with the given id"
  def start_game(room_id) do
    case Registry.lookup(LivePlay.RoomRegistry, room_id) do
      [{pid, _}] ->
        send(pid, :start_game)
        :ok

      [] ->
        {:error, :not_found}
    end
  end

  @doc "function to convert map keys to atoms"
  defp atomize_keys(map) when is_map(map) do
    map
    |> Enum.map(fn {k, v} ->
      key = if is_binary(k), do: String.to_existing_atom(k), else: k
      {key, v}
    end)
    |> Enum.into(%{})
  end

  @doc "function to simplify broadcasting"
  def broadcast_to_room(room_id, payload) do
    Enum.each(RoomSocketRegistry.get_sockets(room_id), fn socket_pid ->
      send(socket_pid, {:push, payload})
    end)
  end

  @doc "retreive questions"
  def get_questions(room_id, language) do
    call_with_check(room_id, {:get_questions, language})
  end

  @impl true
  def handle_call({:add_message, username, message}, _from, state) do
    case message do
      "" ->
        {:reply, {:ok, "Message cannot be empty"}, state}

      message ->
        new_state = %{
          state
          | messages: [%{username: username, message: message} | state.messages]
        }

        {:reply, {:ok, new_state}, new_state}
    end
  end

  @impl true
  def handle_call(:get_messages, _from, state) do
    case state.messages do
      [] -> {:reply, {:ok, []}, state}
      messages -> {:reply, {:ok, messages}, state}
    end
  end

  @impl true
  def handle_call({:join_room, player}, _from, state) do
    case join_player(player, state) do
      {:ok, new_state} ->
        new_state =
          if length(new_state.players) == @max_players and not new_state.countdown_started do
            # notify all clients immediately
            broadcast_to_room(new_state.room_id, %{
              event: "countdown_started",
              # send 5
              countdown: div(@countdown_time, 1000)
            })

            Process.send_after(self(), :countdown_finished, @countdown_time)

            %{new_state | countdown_started: true}
          else
            new_state
          end

        {:reply, :ok, new_state}

      {:error, reason} ->
        {:reply, {:error, reason}, state}

      :error ->
        {:reply, :error, state}
    end
  end

  defp join_player(player, state) do
    player = atomize_keys(player)

    with true <- length(state.players) < @max_players,
         false <- Enum.any?(state.players, &(&1.id == player.id)) do
      new_state = %{state | players: [player | state.players]}
      {:ok, new_state}
    else
      false -> {:error, :room_full}
      true -> {:error, :already_joined}
    end
  end

  @impl true
  def handle_call({:leave_room, player}, _from, state) do
    player = atomize_keys(player)

    case Enum.any?(state.players, &(&1.id == player.id)) do
      true ->
        updated_players = Enum.reject(state.players, &(&1.id == player.id))

        new_state =
          if length(updated_players) < @max_players and not state.started do
            %{state | players: updated_players, countdown_started: false}
          else
            %{state | players: updated_players, countdown_started: false}
          end

        {:reply, {:ok, player}, new_state}

      false ->
        # keep state unchanged, don't crash
        {:reply, {:error, :player_not_in_room}, state}
    end
  end

  @impl true
  def handle_call({:modify_score, player, val}, _from, state) do
    case Enum.find(state.players, &(&1.id == player.id)) do
      nil ->
        {:reply, {:error, :player_not_found}, state}

      target ->
        new_player = %{target | score: target.score + val}

        new_players =
          Enum.map(state.players, &if(&1.id == new_player.id, do: new_player, else: &1))

        new_state = %{state | players: new_players}
        {:reply, {:ok, new_player}, new_state}
    end
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  @impl true
  def handle_call(:get_winner, _from, state) do
    case state.players do
      [] ->
        {:reply, {:error, "no players found"}, state}

      players ->
        maximum = Enum.max_by(players, & &1.score)
        {:reply, {:ok, maximum}, state}
    end
  end

  @impl true
  def handle_call(:get_players, _from, state) do
    case state.players do
      [] -> {:reply, {:error, "no players found"}, state}
      players -> {:reply, {:ok, players}, state}
    end
  end

  @impl true
  def handle_call({:assign_language, language}, _from, state) do
    new_state = %{state | language: language}
    {:reply, {:ok, new_state}, new_state}
  end

  @impl true
  def handle_call({:get_correct_answers, player}, _from, state) do
    case Enum.find(state.players, &(&1.id == player.id)) do
      nil ->
        {:reply, {:error, :player_not_found}, state}

      target ->
        answers = target.correct_answers
        {:reply, {:ok, answers}, state}
    end
  end

  @impl true
  def handle_call({:get_incorrect_answers, player}, _from, state) do
    case Enum.find(state.players, &(&1.id == player.id)) do
      nil ->
        {:reply, {:error, :player_not_found}, state}

      target ->
        answers = target.incorrect_answers
        {:reply, {:ok, answers}, state}
    end
  end

  @impl true
  def handle_info(:countdown_finished, state) do
    # Countdown finished, start the game
    questions = QuestionBank.get_questions(state.language)
    new_state = %{state | game_started: true, countdown_started: false, questions: questions}

    broadcast_to_room(state.room_id, %{event: "game_started", questions: questions})

    {:noreply, new_state}
  end

  @impl true
  def handle_call({:get_questions, language}, _from, state) do
    questions = QuestionBank.get_questions(language)
    new_state = %{state | questions: questions}
    {:reply, {:ok, questions}, new_state}
  end
end
