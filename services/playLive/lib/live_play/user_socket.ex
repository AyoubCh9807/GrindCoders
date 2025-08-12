defmodule LivePlayWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", LivePlay.RoomChannel

  # You can add authentication here if you want, for example:
  # def connect(%{"token" => token}, socket, _connect_info) do
  #   # verify token and assign user_id
  #   {:ok, assign(socket, :user_id, verified_user_id)}
  # end
  #
  # def connect(_params, socket, _connect_info), do: :error

  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
