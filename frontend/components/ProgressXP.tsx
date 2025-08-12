import React from "react";
import clsx from "clsx";
import CountUp from "./UI/CountUp";
import { getLevel } from "@/app/utils/levelUtils";

interface FuturisticProgressBarProps {
  value: number; // 0 to 100
  color?: "violet" | "cyan" | "green" | "red";
  xp?: number;
}

export const ProgressXP: React.FC<FuturisticProgressBarProps> = ({
  value,
  color = "violet",
  xp = 0,
}) => {
  const clrs = {
    violet: "from-violet-500 to-purple-600 shadow-violet-400",
    cyan: "from-cyan-400 to-blue-500 shadow-cyan-300",
    green: "from-emerald-400 to-green-500 shadow-emerald-300",
    red: "from-rose-500 to-red-600 shadow-rose-400",
  };

  const shadowClass = clrs[color].split(" ")[2];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-2xl bg-[#1f1f1f] shadow-[0_0_30px_#222] border border-[#333]">
      {/* Levels */}
      <div className="mb-4 flex justify-between items-center px-2">
        <div
          className={clsx(
            "w-16 h-16 rounded-full bg-black relative animate-pulse",
            shadowClass
          )}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 blur-xl" />
          <p className="absolute inset-0 flex items-center justify-center font-outfit font-extrabold text-xl text-white z-10">
            {getLevel(xp).level}
          </p>
        </div>

          <p className="text-2xl "> {getLevel(xp).left} XP for level up. </p>

        <div
          className={clsx(
            "w-16 h-16 rounded-full bg-black relative animate-pulse",
            shadowClass
          )}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 blur-xl" />
          <p className="absolute inset-0 flex items-center justify-center font-outfit font-extrabold text-xl text-white z-10">
            {getLevel(xp).level + 1}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <div
          className={clsx(
            "h-full bg-gradient-to-r transition-all duration-700 ease-out rounded-full",
            clrs[color]
          )}
          style={{ width: `${value}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="mt-4 text-center">
        <CountUp
          from={0}
          to={getLevel(xp).progress}
          className="text-3xl font-bold font-outfit text-gray-100"
        />
        <span className="text-3xl font-bold font-outfit text-gray-300">%</span>
      </div>
    </div>
  );
};
