"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import GlareHover from "@/components/UI/GlareHover";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface Player {
  id: number;
  username: string | "Guest";
  score: number | 0;
}

interface Room {
  room_id: number;
  name: string;
  players: Player[];
  public: boolean;
  timer_ref: null;
  started: boolean;
  countdown_started: boolean;
}


export default function Lobby() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>("");
  // const [deleteId, setDeleteId] = useState<number>(0); USED FOR DEBUGGING
  const [createBool, setCreateBool] = useState<boolean>(false);
  const [joinBool, setJoinBool] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>("");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const [joined, setJoined] = useState<number>(0);
  //Gathering info
  const [username, setUsername] = useState<string>("");
  const [id, setId] = useState<number>(0);

  const [joining, setJoining] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsername("Guest");
      return;
    }
    try {
      const decoded = jwtDecode<{ username: string; id: number }>(token);
      setUsername(decoded.username);
      setId(decoded.id);
    } catch (error) {
      setUsername("Guest");
    }
  }, []);

  const deleteRoom = async (id: number) => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${id}`
      );
      if (!res.data) return;
      await fetchRooms();
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };
  const deleteAllRooms = async () => {
    try {
      setLoading(true);
      setErr(null);
      const promises = rooms.map((room) =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${room.room_id}`
        )
      );
      const results = await Promise.allSettled(promises);
      const failed = results.filter((r) => r.status == "rejected");
      if (failed.length > 0) {
        setErr(`failed to delete ${failed.length} room(s)`);
      }
      await fetchRooms();
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //createRoom("My room")
    fetchRooms();
  }, []);

  const joinPublicRoom = async (roomId: number) => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${roomId}/join`,
        {
          room_id: roomId,
          player: { username: username, id: id, score: 0 },
        }
      );
      if (!res.data) return;
      await fetchRooms();
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const leaveRoom = async (roomId: number) => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${roomId}/leave`,
        {
          room_id: roomId,
          player: { username: username, id: id, score: 0 },
        }
      );
      if (!res.data) return;
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms`
      );
      if (!res.data) return;
      setRooms(res.data.rooms);
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreation = async () => {
    try {
      const rName = roomName.trim();
      if (rName.length > 16 || rName.length < 4) {
        setErr("Room name must be 5-16 characters long");
        return;
      }
      setLoading(true);
      setErr(null);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms`,
        {
          name: roomName,
        }
      );
      if (!res.data) return;
      await fetchRooms();
      setCreateBool(false);
      setRoomName("");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(() => {
      fetchRooms();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!rooms) {
    return (
      <div className="grid place-items-center my-5 text-center">
        <div style={{ height: "600px", position: "relative" }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
              className="animate-pulse"
            >
              Error: {err}
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }

  if (joining) {
    return (
      <div className="grid place-items-center my-5 text-center">
        <div style={{ height: "600px", position: "relative" }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
              className="animate-pulse"
            >
              Joining room...
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }

  loading && <p>Loading...</p>;
  err && <p>error: {err} </p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">
        Public Rooms
      </h1>
      <button
        onClick={() => {
          fetchRooms();
        }}
      >
        Fetch rooms
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {rooms.map((room, i) => {
          const colorClass =
            i % 7 === 0
              ? "shiny-text-cyan"
              : i % 6 === 0
              ? "shiny-text-pink"
              : i % 5 === 0
              ? "shiny-text-green"
              : i % 4 === 0
              ? "shiny-text-yellow"
              : i % 3 === 0
              ? "shiny-text-red"
              : i % 2 === 0
              ? "shiny-text-blue"
              : "shiny-text-javascript";

          return (
            <div
              key={room.room_id}
              className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] p-4 aspect-square flex flex-col justify-between"
            >
              <div>
                <p
                  className={`text-xl font-semibold mb-2 truncate border-b pb-1 ${colorClass}`}
                >
                  {room.name} (id: {room.room_id})
                </p>
                <div className="overflow-y-hidden text-sm text-white/80 font-mono space-y-1 max-h-24">
                  {room.players.map((player: Player, j: number) => (
                    <div key={player.id + j}>
                      #{j + 1}: {player.username}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-white/50">
                <span>{1 ? "🌐 Public" : "🔒 Private"}</span>
                <span>
                  {room.players.length} player
                  {room.players.length !== 1 ? "s" : ""}
                </span>
              </div>

              <p>joined: {room.room_id == joined ? "yes" : "no"} </p>

              {joined != room.room_id && (
                <button
                  disabled={joined != 0 || room.players.length >= 2}
                  onClick={async () => {
                    if (joined == 0 && room.players.length < 2) {
                      joinPublicRoom(room.room_id);
                      setJoining(true);
                      localStorage.setItem("currentRoom", String(room.room_id));
                      router.push(`/multiplayer/lobby/${room.room_id}`);
                    }
                  }}
                  className={`
                    mt-3 w-full py-1.5 rounded-md hover:cursor-pointer active:scale-95
                     text-white font-semibold text-sm transition-all duration-200
                   ${
                     room.players.length > 3
                       ? "bg-red-700 hover:bg-red-600"
                       : "bg-indigo-500 hover:bg-indigo-600"
                   }
                    `}
                >
                  <p>{room.players.length >= 2 ? "Room full!" : "Join"}</p>
                </button>
              )}
              {joined == room.room_id && (
                <button
                  onClick={() => {
                    leaveRoom(room.room_id);
                    setJoined(0);
                    fetchRooms();
                  }}
                  className={`
                    mt-3 w-full py-1.5 rounded-md hover:cursor-pointer active:scale-95
                     text-white font-semibold text-sm transition-all duration-200
                     bg-red-700 hover:bg-red-600
                    `}
                >
                  {"Leave room"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div
        className="fixed top-1/2 left-1/2 w-[350px] max-w-full bg-gray-900 bg-opacity-90 border border-indigo-600 rounded-lg p-6 shadow-lg
                -translate-x-1/2 translate-y-[150%]"
      >
        <div className="flex gap-4 justify-center">
          <button
            className="
        flex-1
        py-3
        rounded-md
        bg-indigo-600
        text-white
        font-semibold
        text-lg
        transition
        duration-300
        hover:bg-indigo-700
        active:scale-95
        shadow-md
        focus:outline-none focus:ring-2 focus:ring-indigo-400
        hover:cursor-pointer
      "
          >
            Join Room
          </button>

          <button
            onClick={() => {
              setCreateBool(true);
            }}
            className="
        flex-1
        py-3
        rounded-md
        bg-green-600
        text-white
        font-semibold
        text-lg
        transition
        duration-300
        hover:bg-green-700
        active:scale-95
        shadow-md
        focus:outline-none focus:ring-2 focus:ring-green-400
        hover:cursor-pointer
      "
          >
            Create Room
          </button>
        </div>
      </div>

      {createBool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-slideUp border border-gray-700">
            {/* Modal Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Create a Room</h2>
              <p className="text-sm text-gray-400 mt-1">
                Set your room details below. You can make it private or public.
              </p>
            </div>

            {/* Room Name */}
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm">
                Room Name
              </label>
              <input
                spellCheck={false}
                type="text"
                value={roomName.slice(0, 16)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRoomName(e.target.value)
                }
                placeholder="Enter room name"
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500
            focus:border-indigo-500 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 transition"
              />
            </div>

            {/* Privacy Option */}
            <div className="flex items-start space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <input
                id="privacy_checkbox"
                type="checkbox"
                checked={privateRoom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPrivateRoom(e.target.checked)
                }
                className="mt-1 h-5 w-5 text-indigo-500 rounded focus:ring-indigo-500 cursor-pointer bg-gray-900 border-gray-700"
              />
              <label
                htmlFor="privacy_checkbox"
                className="flex flex-col cursor-pointer select-none"
              >
                <span className="text-gray-300 font-medium">Private Room</span>
                <span className="text-gray-500 text-sm">
                  Private rooms can only be accessed by name and won’t appear in
                  public lists.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => setCreateBool(false)}
                className="px-5 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700 active:scale-95 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRoomCreation}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
                disabled={roomName.trim().length < 4}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*  DEBUG:
      <button
      onClick={() => {fetchRooms()}}
      >Fetch rooms</button>
      <button
      onClick={() => {deleteAllRooms()}}
      >delete all</button>
      <button
      onClick={() => {deleteRoom(deleteId)}}
      >Delete room</button>
      <input type="text" className="p-4 border border-b-white bg-amber-100/20" value={deleteId} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setDeleteId(Number(e.target.value))} />
    
*/
