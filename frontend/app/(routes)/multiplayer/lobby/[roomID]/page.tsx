"use client";

import { useEffect, useState, useRef } from "react";
import { Socket, Channel } from "phoenix";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Player {
  id: number;
  username: string;
  score: number;
}

interface Message {
  username: string;
  message: string;
}

interface Question {
  title: string;
  answers: string[];
  correct_answers: string[]
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


export default function RoomId() {
  const [status, setStatus] = useState("Connecting...");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("Guest");
  const [userId, setUserId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)

  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const channelRef = useRef<Channel | null>(null);

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsername("Guest");
      setUserId(null);
      return;
    }
    try {
      const decoded = jwtDecode<{ username: string; id: number }>(token);
      setUsername(decoded.username);
      setUserId(decoded.id);
    } catch {
      setUsername("Guest");
      setUserId(null);
    }
  }, []);

  // Load room ID from localStorage
  useEffect(() => {
    const id = Number(localStorage.getItem("currentRoom"));
    if (isNaN(id)) {
      setErrorMsg("Invalid room ID");
      setTimeout(() => router.push("/multiplayer/lobby"), 2000);
      return;
    }
    setRoomId(id);
  }, [router]);

  // Fetch current room
  const fetchRoom = async () => {
    if (!roomId) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${roomId}`,
        { room_id: String(roomId) }
      );
      setCurrentRoom(res.data?.room)
      console.log("room: ", res?.data.room)
    } catch (err) {
      console.error("Failed to fetch room", err);
    }
  };

  // Connect to Phoenix channel
  useEffect(() => {
    if (!roomId || userId === null) return;

    const socket = new Socket("ws://localhost:4000/socket", {
      params: { user_id: userId, username },
    });

    socket.connect();
    socketRef.current = socket;

    const channel = socket.channel(`room:${roomId}`, {});
    channelRef.current = channel;

    // Join channel
    channel
      .join()
      .receive("ok", () => {
        setStatus(`✅ Connected to Room ${roomId}`);
        // Announce join
        channel.push("message:new", {
          username: "Game",
          message: `${username} has joined the room`,
        });
        // Initial room fetch
        fetchRoom();
      })
      .receive("error", (err: any) => {
        console.error("Join error", err);
        setStatus("❌ Failed to join room");
        setErrorMsg(err?.reason || "Could not connect");
        setTimeout(() => router.push("/multiplayer/lobby"), 2000);
      });

    // Listen for new messages
    channel.on("message:new", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Optional: listen for room updates if backend broadcasts them
    // channel.on("room:updated", (payload) => {
    //   setPlayers(payload.players || []);
    // });

    // Cleanup
    return () => {
      // Notify others before leaving
      if (channelRef.current && username) {
        channel.push("message:new", {
          username: "Game",
          message: `${username} has left the room`,
        });
      }

      if (channelRef.current) {
        channel.leave();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      socketRef.current = null;
      channelRef.current = null;
    };
  }, [roomId, userId, username]);

  // Poll for room updates (fallback if no real-time player updates)
  useEffect(() => {
    if (!roomId) return;

    const poll = setInterval(() => {
      fetchRoom();
    }, 3000);

    return () => clearInterval(poll);
  }, [roomId]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !channelRef.current) return;
    channelRef.current.push("message:new", { username, message: input });
    setInput("");
  };

  // Leave room (REST call)
  const leaveRoom = async () => {
    if (!roomId || !userId) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${roomId}/leave`,
        {
          room_id: roomId,
          player: { id: userId, username, score: 0 },
        }
      );
      
    } catch (err) {
      console.error("Leave failed", err);
    }
  };

  // Disconnect and clean up
  const disconnect = async () => {
    // Let cleanup in useEffect handle socket/channel
    await leaveRoom();
    localStorage.removeItem("currentRoom");
    router.push("/multiplayer/lobby");
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    const container = document.querySelector(".h-72");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  //start game
  const startGame = async() => {
    try {
      setLoading(true)
      setErrorMsg(null)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_ROOM_SERVER}/api/rooms/${roomId}/start`, {
        room_id: roomId
      })
      setStarted(res.data.started)
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Failed to start room")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white font-mono p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full border border-indigo-600/50 rounded-2xl shadow-2xl shadow-indigo-900/70 p-6 backdrop-blur-sm relative"
      >
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
          Room #{roomId ?? "N/A"}
        </h1>

        <div className="flex flex-wrap gap-4 mb-5 text-sm text-indigo-200 border-b border-indigo-700 pb-3">
          <span>
            You: <strong className="text-cyan-300">{username}</strong>
          </span>
          <span>
            Players: <strong className="text-violet-300">{currentRoom?.players.length}</strong>
          </span>
          <span>
            Status: <strong className="text-green-300">{status}</strong>
          </span>
          <span>
            started: <strong className="text-green-300">{started}</strong>
          </span>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto rounded-lg border border-indigo-600/60 bg-indigo-950/40 p-4 mb-5 scroll-smooth">
          {messages.length === 0 ? (
            <p className="text-indigo-400 italic">No messages yet...</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded ${
                  msg.username === "Game"
                    ? "text-yellow-300 italic text-sm opacity-90"
                    : "bg-indigo-900/30"
                }`}
              >
                <span className="font-bold text-cyan-300">{msg.username}</span>
                :{" "}
                <span className={msg.username === "Game" ? "" : "text-purple-200"}>
                  {msg.message}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-indigo-900/70 border border-indigo-500/60 text-white placeholder-indigo-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={sendMessage}
            disabled={!channelRef.current || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-600 disabled:from-gray-600 text-white font-medium rounded-xl shadow active:scale-95 transition"
          >
            Send
          </button>
          <button
            onClick={disconnect}
            className="px-5 py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-900 hover:to-red-700 text-white font-medium rounded-xl shadow active:scale-95 transition"
          >
            Leave
          </button>
          <button
            onClick={startGame}
            className="px-5 py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-900 hover:to-red-700 text-white font-medium rounded-xl shadow active:scale-95 transition"
          >
            Start game
          </button>
        </div>

        {/* Error Toast */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-900/95 text-red-200 px-6 py-3 rounded-lg shadow-lg font-medium pointer-events-none"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}