"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { jwtDecode } from "jwt-decode";
import CountUp from "@/components/UI/CountUp";
import GlareHover from "@/components/UI/GlareHover";
import { useRouter } from "next/navigation";
import { ProgressXP } from "@/components/ProgressXP";
import { getLevel } from "@/app/utils/levelUtils";

export default function Me() {
  // States (unchanged)
  const [totalPbs, setTotalPbs] = useState<number>(100);
  const [solvedProblems, setSolvedProblems] = useState<number>(0);
  const [solved, setSolved] = useState<number>(0);
  const [correctSubs, setCorrectSubs] = useState<number>(0);
  const [totalSubs, setTotalSubs] = useState<number>(0);
  const [incorrectSubs, setIncorrectSubs] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [XP, setXP] = useState<number>(0);
  const [successRate, setSuccessRate] = useState<number>(0);
  const [averageSubs, setAverageSubs] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [accuColor, setAccuColor] = useState<string>("");
  const [accuMsg, setAccuMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [popoverVis, setPopoverVis] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return
    }
    try {
      const decoded = jwtDecode<{ username: string; id: number }>(token);
      setUsername(decoded.username);
      setUserId(decoded.id);
      if(!username.length || userId < 1) {
        router.push("/login")
      }
    } catch {
      setErr("Invalid token");
    }
  }, []);

  useEffect(() => {
    if (userId === 0) return;
    getUserStats();
  }, [userId]);

  const getUserStats = async () => {
    setLoading(true);
    setErr(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErr("No token found");
        setLoading(false);
        return;
      }
      const res = await axios.post(
        "http://localhost:8080/api/user_stats",
        { user_ID: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data) {
        setErr("No data found");
        setLoading(false);
        return;
      }

      const solvedProblemsNew = res.data.user_stats.problems_solved;
      const solvedNum = solvedProblemsNew.length;
      const correctNum = Number(res.data.user_stats.correct_submissions);
      const totalNum = Number(res.data.user_stats.total_submissions);
      const XPnum = Number(res.data.user_stats.points);

      setSolvedProblems(solvedProblemsNew);
      setSolved(solvedNum);
      setCorrectSubs(correctNum);
      setTotalSubs(totalNum);
      setIncorrectSubs(totalNum - correctNum);
      setTotalPbs(100);
      setXP(XPnum);

      console.log("RESPONSE STATS: ", res.data.user_stats);

      const accuracyNew =
        totalNum !== 0 ? Math.min((correctNum / totalNum) * 100, 100) : 0;
      const successRateNew =
        totalNum > 0 ? Math.min((solvedNum / totalNum) * 100, 100) : 0;
      const averageSubsNew = solvedNum > 0 ? totalNum / solvedNum : 0;

      setAccuracy(accuracyNew);
      setSuccessRate(successRateNew);
      setAverageSubs(averageSubsNew);
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = () => {
    if (localStorage.getItem("token")?.trim().length) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  useEffect(() => {
    const accuracyColor =
      accuracy > 75
        ? "text-green-400"
        : accuracy > 50
        ? "text-lime-300"
        : accuracy > 30
        ? "text-orange-400"
        : "text-red-500";
    setAccuColor(accuracyColor);
    const accuracyMessage =
      accuracy > 75
        ? "Fantastic! Keep crushing it 🚀"
        : accuracy > 50
        ? "You're doing great! Keep pushing 💪"
        : accuracy > 30
        ? "Room for improvement — you got this! 👊"
        : "Let's level up! Practice makes perfect 🔥";
    setAccuMsg(accuracyMessage);
  }, [accuracy]);

  // ECharts options (unchanged)
  const pieOption = {
    color: ["#4ade80", "#f87171"],
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    graphic: {
      type: "text",
      left: "center",
      top: "center",
      style: {
        text: `${accuracy.toFixed(1)}%`,
        fontSize: 40,
        fontWeight: 700,
        fill: "#333",
        textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
      },
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{d}%",
          fontSize: 14,
          color: "#444",
          fontWeight: "600",
        },
        emphasis: {
          label: { show: true, fontSize: 18, fontWeight: "bold" },
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.25)",
          },
        },
        labelLine: { show: true, length: 12, length2: 12 },
        data: [
          { value: correctSubs, name: "Correct" },
          { value: totalSubs - correctSubs, name: "Incorrect" },
        ],
      },
    ],
  };

  const barOption = {
    color: ["#3b82f6", "#22c55e", "#ef4444"],
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Submissions"],
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: "#ccc" } },
      axisLabel: { fontWeight: "600" },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLine: { lineStyle: { color: "#ccc" } },
      splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
    },
    series: [
      { name: "Total", type: "bar", barWidth: "25%", data: [totalSubs] },
      { name: "Correct", type: "bar", barWidth: "25%", data: [correctSubs] },
      {
        name: "Incorrect",
        type: "bar",
        barWidth: "25%",
        data: [incorrectSubs],
      },
    ],
  };

  const lineOption = {
    title: {
      text: "Your problem track",
      left: "center",
      textStyle: {
        color: "#ffffff", // white color
        fontSize: 20,
        fontWeight: "bold",
      },
    },
    color: ["#6366f1"],
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      axisLine: { lineStyle: { color: "#ccc" } },
      axisLabel: { fontWeight: "600" },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLine: { lineStyle: { color: "#ccc" } },
      splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
    },
    series: [
      {
        name: "Problems Solved",
        type: "line",
        stack: "Total",
        data: [2, 5, 8, 6, 10, 12, solved],
        smooth: true,
        lineStyle: {
          width: 4,
          shadowColor: "rgba(99, 102, 241, 0.4)",
          shadowBlur: 8,
        },
        itemStyle: { borderWidth: 3, borderColor: "#6366f1", color: "#a5b4fc" },
        areaStyle: {
          color: "rgba(99, 102, 241, 0.15)",
        },
      },
    ],
  };
  if (loading)
    return (
      <div className="grid place-items-center">
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
                fontSize: "1.75rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
            >
              Loading...
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  return (
    <div className="grid place-items-center mt-12 px-4 max-w-screen-xl mx-auto font-outfit select-none">
      <p className="text-6xl font-bold mb-6 text-center text-blue-600 tracking-wide drop-shadow-sm">
        {username}'s Stats Dashboard
      </p>

      {loading && (
        <p className="text-indigo-600 text-xl animate-pulse font-semibold mb-6">
          Loading your stats...
        </p>
      )}
      {err && (
        <p className="text-red-600 font-semibold mb-6 px-4 rounded bg-red-100 border border-red-300 max-w-md text-center">
          {err}
        </p>
      )}

      <div className="grid grid-cols-16 grid-rows-20 gap-6">
        {/* Accuracy Card */}
        <div
          className={`col-span-5 row-span-4 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center bg-gradient-to-br
            from-indigo-600 to-purple-700 text-white
            hover:from-indigo-700 hover:to-purple-800 transition duration-300 ease-in-out cursor-default select-text`}
          aria-label="Your accuracy percentage"
        >
          <h2 className="text-4xl font-bold mb-5 text-center tracking-wide drop-shadow">
            Your Accuracy
          </h2>
          <div className="flex items-center space-x-3">
            <CountUp
              from={0}
              to={Number(accuracy.toFixed(2))}
              className={`text-8xl font-extrabold tracking-tight ${accuColor} drop-shadow-md`}
            />
            <span className={`text-6xl font-extrabold ${accuColor}`}>%</span>
          </div>
          <p className={`mt-6 text-2xl font-semibold ${accuColor} text-center`}>
            {accuMsg}
          </p>
          <p className="mt-3 text-sm opacity-75 font-medium text-center">
            Keep practicing daily to improve your accuracy!
          </p>
        </div>

        {/* Pie Chart */}
        <div
          className="col-span-6 row-span-4 rounded-2xl p-6 shadow-md bg-gradient-to-tr from-white to-gray-300 cursor-default select-none"
          aria-label="Pie chart showing correct vs incorrect submissions"
        >
          <ReactECharts
            option={pieOption}
            style={{ height: 280, width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>

        {/* Problems Solved Card */}
        <div
          className="col-span-5 row-span-4 rounded-2xl p-6 shadow-xl bg-gradient-to-br from-green-500 to-teal-600 flex flex-col items-center justify-center text-white
          hover:from-green-600 hover:to-teal-700 transition duration-300 ease-in-out cursor-default select-text"
          aria-label="Total problems solved"
        >
          <h2 className="text-xl font-semibold tracking-wide">
            Problems Solved
          </h2>
          <CountUp
            from={0}
            to={solved}
            className="text-5xl font-extrabold mt-4 drop-shadow"
          />
          <p className="mt-2 text-sm opacity-80 text-center">Keep it up!</p>
        </div>

        {/* Activity Line Chart */}
        <div
          className="col-span-16 row-span-4 rounded-2xl p-6 shadow-md bg-gradient-to-tl from-gray-500 to-[#343541] cursor-default select-none"
          aria-label="Line chart showing problems solved over last 7 days"
        >
          <ReactECharts
            option={lineOption}
            style={{ height: 280, width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>

        {/* Submissions Bar Chart */}
        <div
          className="col-span-6 row-span-4 rounded-2xl p-6 shadow-md bg-gradient-to-br from-gray-500 to-[#343541] cursor-default select-none"
          aria-label="Bar chart showing submissions breakdown"
        >
          <ReactECharts
            option={barOption}
            style={{ height: 280, width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>

        {/* Average Subs Card */}
        <div
          className="col-span-5 row-span-4 rounded-2xl p-6 shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex flex-col items-center justify-center text-white
          hover:from-yellow-500 hover:to-yellow-700 transition duration-300 ease-in-out cursor-default select-text"
          aria-label="Average submissions per solved problem"
        >
          <h2 className="text-2xl font-semibold tracking-wide text-center">
            Average Submissions per Solved problem
          </h2>
          <CountUp
            from={0}
            to={Number(averageSubs.toFixed(2))}
            className="text-5xl font-extrabold mt-4 drop-shadow"
          />
          <p className="mt-2 text-sm opacity-80 text-center">
            Optimize your strategy!
          </p>
        </div>

        {/* Success Rate Card */}
        <div
          className={`relative col-span-5 row-span-4 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center
          bg-gradient-to-br from-blue-600 to-blue-800 text-white
          hover:from-blue-700 hover:to-blue-900 transition duration-300 ease-in-out cursor-default select-text`}
          aria-label="Success rate percentage"
        >
          <h2 className="text-3xl font-semibold tracking-wide text-center">
            Success Rate
          </h2>
          <div className="flex items-baseline space-x-1 mt-3">
            <CountUp
              from={0}
              to={Number(successRate.toFixed(2))}
              className={`text-5xl font-extrabold ${accuColor} drop-shadow`}
            />
            <span className={`text-3xl font-semibold ${accuColor}`}>%</span>
          </div>
          <p className="mt-2 text-sm opacity-80 text-center">
            Reflects your efficiency solving problems!
          </p>
        </div>

        <div
          className="
    col-span-16 row-span-4 
    rounded-3xl 
    p-8 
    shadow-lg 
    bg-gradient-to-tr from-gray-700 via-gray-900 to-[#1f2025] 
    border border-gray-600 
    cursor-default 
    select-none
    flex 
    flex-col 
    items-center
    space-y-6
  "
          aria-label="XP road"
        >
          <p className="text-center text-5xl font-extrabold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600 drop-shadow-lg">
            {username}'s XP Road
          </p>
          <ProgressXP value={getLevel(XP).progress} xp={XP} />
        </div>

        <div
          className={`relative col-span-16 row-span-4 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center
          bg-gradient-to-br from-yellow-600 to-red-800 text-white
          hover:from-yellow-700 hover:to-red-900 transition duration-300 ease-in-out cursor-default select-text`}
          aria-label="Success rate percentage"
        >
          <p
            className="text-4xl font-outfit transition-all duration-200 hover:cursor-pointer hover:drop-shadow-[0px_0px_16px_#ffffff]"
            onClick={() => setPopoverVis(!popoverVis)}
          >
            LOG OUT
          </p>

          {popoverVis && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-2xl">
              <div className="bg-white text-black p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4">
                <p className="text-2xl font-semibold">Are you sure?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleLogOut();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setPopoverVis(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
