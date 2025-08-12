defmodule LivePlay.IdServer do

  use GenServer

  def start_link(_initial_value \\ 0) do
    GenServer.start_link(__MODULE__, %{last_id: 0, free_ids: []}, name: __MODULE__)
  end

  def generate_id() do
    GenServer.call(__MODULE__, :generate_id)
  end

  def free_id(id) do
    GenServer.cast(__MODULE__, {:free_id, id})
  end

  @impl true
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_call(:generate_id, _from, state) do
    # state is last id
    if length(state.free_ids) > 0 do
      new_id = Enum.min_by(state.free_ids, & &1)
      updated = Enum.reject(state.free_ids, & &1 == new_id)
      {:reply, new_id, %{state | free_ids: updated}}
    else
    new_id = state.last_id + 1
    new_state = %{state | last_id: new_id}
    {:reply, new_id, new_state}
    end
  end

  @impl true
  def handle_cast({:free_id, id}, state) do
    {:noreply, %{state | free_ids: [id | state.free_ids]}}
  end

end
