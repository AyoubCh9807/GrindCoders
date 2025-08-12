"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import GlareHover from "@/components/UI/GlareHover";
import { easeInOut, motion } from "framer-motion";

interface Cell {
  username: string;
  problems_solved: number[];
  points: number;
}

export default function Leaderboard() {
  const [leaderData, setLeaderData] = useState<Cell[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [fetchedUrl, setFetchedUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("Top 200 Global XP");
  const [target, setTarget] = useState<string>("xp");
  const [username, setUsername] = useState<string>("");

  const fetchLeaderboardData = async (url: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data) return;
      setLeaderData(res.data.data);
      console.log("data: ", res.data.data);
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  //get_leaderboard_global_xp: top 200 global xp
  //get_leaderboard_global_problems: top 200 global problems
  //get_leaderboard_global_you: top 100 above ya and 99 below ya

  // TOP XP URL: http://localhost:8080/api/get_leaderboard_top_xp
  // TOP SOLVED URL: http://localhost:8080/api/get_leaderboard_top_solved
  // YOUR RANGE URL: http://localhost:8080/api/get_leaderboard_you

  const url_XP = "http://localhost:8080/api/get_leaderboard_top_xp";
  const url_SOLVED = "http://localhost:8080/api/get_leaderboard_top_solved";
  const url_YOURRANGE = "http://localhost:8080/api/get_leaderboard_you";

  useEffect(() => {
    fetchLeaderboardData(url_XP);
  }, []);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Guest");
  });

  useEffect(() => {
    if (!leaderData) return;
    switch (target.toLowerCase()) {
      case "solved":
        return;
    }
  });

  const getPlayerTarget = (player: Cell, target: string) => {
    switch (target.toLowerCase()) {
      case "xp":
        return "⚡" + player.points + "XP";
      case "solved":
        return (
          "🔥" +
          (player.problems_solved.includes(0)
            ? player.problems_solved.length - 1
            : player.problems_solved.length) +
          " Problems"
        );
      case "you":
        return "⚡" + player.points;
    }
  };

  if (loading) {
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
              Loading leaderboard...
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }

  if (err) {
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

  return (
    <div className="min-h-screen border border-white">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 100 }}
        transition={{ ease: easeInOut }}
      >
        <div className="flex flex-row justify-evenly">
          <table
            className="
          w-full border-separate border-spacing-0 overflow-hidden shadow-xl
           bg-black/40 backdrop-blur-md text-white font-bold font-outfit relative rounded-xl border-2 border-cyan-400 
            before:absolute before:inset-0 before:rounded-xl 
            before:animate-pulse before:bg-cyan-400/20 
            before:blur-md before:z-[-1]
           "
          >
            <thead className=" bg-gradient-to-r from-violet-900 to-fuchsia-800 text-white shadow-md">
              <tr className="text-center flex flex-row justify-evenly">
                <th className="transition-all duration-200 border border-amber-50/30 m-1 rounded-xl bg-white/30 hover:bg-white/50 px-6 py-4 text-center text-2xl font-bold">
                  <button
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setFetchedUrl(url_XP);
                      fetchLeaderboardData(url_XP);
                      setTitle("Top 200 Global XP");
                      setTarget("xp");
                    }}
                  >
                    Top 200 Global XP
                  </button>
                </th>
                <th className="transition-all duration-200 border border-amber-50/30 m-1 rounded-xl bg-white/30 hover:bg-white/50 px-18 py-4 text-center text-2xl font-bold">
                  <button
                  className="hover:cursor-pointer"
                    onClick={() => {
                      setFetchedUrl(url_YOURRANGE);
                      fetchLeaderboardData(url_YOURRANGE);
                      setTitle("You");
                      setTarget("you");
                    }}
                  >
                    You
                  </button>
                </th>
                <th className="transition-all duration-200 border border-amber-50/30 m-1 rounded-xl bg-white/30 hover:bg-white/50 px-6 py-4 text-center text-2xl font-bold">
                  <button
                  className="hover:cursor-pointer"
                    onClick={() => {
                      setFetchedUrl(url_SOLVED);
                      fetchLeaderboardData(url_SOLVED);
                      setTitle("Top 200 Solved problems");
                      setTarget("solved");
                    }}
                  >
                    Top 200 Solved problems
                  </button>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-6xl my-5 text-center shiny-text-light-violet font-bold font-outfit">
            The leaderboard
          </p>

          <motion.div 
          id="leaderboard"
          initial={{opacity: 0}}
          animate={{opacity: 100}}
          transition={{ease: easeInOut, duration: 1}}
          >
            <table
              className="
          w-full border-separate border-spacing-0 overflow-hidden shadow-xl
           bg-black/40 backdrop-blur-md text-white font-bold font-outfit relative rounded-xl border-2 border-cyan-400 
            before:absolute before:inset-0 before:rounded-xl 
            before:animate-pulse before:bg-cyan-400/20 
            before:blur-md before:z-[-1]
           "
            >
              <thead className="bg-gradient-to-r from-violet-900 to-fuchsia-800 text-white shadow-md">
                <tr>
                  <th
                    colSpan={4}
                    className="px-6 py-4 text-center text-2xl font-bold border-b border-violet-700"
                  >
                    {title}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderData.map((player, i) => {
                  return (
                    <tr
                      className="hover:bg-white/10 transition-all duration-200"
                      key={i}
                    >
                      <td className="px-6 py-4 border-b border-gray-700">
                        #{i + 1}
                      </td>
                      <td
                        className={`px-6 py-4 border-b border-gray-700 ${
                          player.username == username
                            ? "animate-pulse bg-gradient-to-r from-purple-500 to-indigo-600 bg-opacity-70 shadow-lg rounded-xl"
                            : ""
                        }`}
                      >
                        {i + 1 == 1
                          ? "🥇" + player.username
                          : i + 1 == 2
                          ? "🥈" + player.username
                          : i + 1 == 3
                          ? "🥉" + player.username
                          : player.username}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-700">
                        {getPlayerTarget(player, target)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

              <div className="active:scale-95 animate-pulse bg-gradient-to-r from-fuchsia-500 to-violet-700 transition-all my-5 duration-200 border border-amber-50/30 m-1 rounded-xl bg-white/30 hover:bg-white/50 px-6 py-4 text-center text-2xl font-bold">
                  <button
                  className="hover:cursor-pointer"
                  >
                    <a href="/multiplayer/lobby">Check out lobbies {">"}</a>
                  </button>
                </div>

        </div>
      </motion.div>
    </div>
  );
}
