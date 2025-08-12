defmodule LivePlayWeb.Router do
  use LivePlayWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
    plug CORSPlug, origin: ["http://localhost:3000"]
  end

  scope "/api", LivePlayWeb do
    pipe_through :api
    get("/rooms", RoomController, :get_rooms)
    post("/rooms/:room_id", RoomController, :get_room)
    post("/rooms/:room_id/start", RoomController, :start_game)
    delete("/rooms/:room_id", RoomController, :delete_room)
    post("/rooms", RoomController, :create_room)
    post("/rooms/:room_id/leave", RoomController, :leave_room)
    post("/rooms/:room_id/join", RoomController, :join_room)
    get("/rooms/:room_id/winner", RoomController, :get_winner)
    get("/rooms/:room_id/players", RoomController, :get_players)
    get("/rooms/:room_id/messages", RoomController, :get_messages)
    post("/rooms/:room_id/messages", RoomController, :add_message)
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:live_play, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through([:fetch_session, :protect_from_forgery])

      live_dashboard("/dashboard", metrics: LivePlayWeb.Telemetry)
      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end
