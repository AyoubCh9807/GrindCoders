"use client";
import { Section } from "@/components/Section";
import Squares from "@/components/UI/SquaresBg";
import Link from "next/link";
import SpotlightCard from "@/components/UI/SpotLightCard";
import { GradientText } from "@/components/GradientText";

export default function Multiplayer() {
  return (
    <div className="relative">
      <div className="absolute inset-0 min-w-full min-h-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] opacity-10">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="up" // up, down, left, right, diagonal
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>
      <Section
        title="Learn with friends"
        content="coding for hours can get boring and lonely, then let's get some friends to make our journey better and more fun."
        imgUrl="/images/codingparty.jpg"
        align="right"
        vignette={false}
      />

      <Section
        title="Good for kids, good for everyone"
        content="Let's be real, kids these days easily get addicted to all sorts of video games. So choosing the best kind is the right step to choose."
        imgUrl="/images/kidbegging.jpg"
        align="left"
      />
      <Section
        title="Compete in Real-Time!"
        content="Challenge your friends or random players in a live coding match. Solve problems faster. Win XP. Brag rights unlocked."
        imgUrl="/images/blackpeoplesolvingaproblem.jpg"
        align="right"
      />
      <Section
        title="Talk, Don't Type"
        content="Solve problems faster by speaking to your teammate directly. Our integrated voice chat brings remote pair programming to life."
        imgUrl="/images/womanvoicechat.png"
        align="left"
      />
      <Section
        title="Team Battles Incoming!"
        content="Form a team, challenge another group, and see who dominates the leaderboard. Each win gives XP boosts!"
        imgUrl="/images/codingteam.jpg"
        align="right"
      />

      <div className="flex flex-row justify-start mx-40">
        <div className="max-w-[70vw] flex flex-col items-start">
          <p className="p-2 text-6xl font-outfit tracking-wide text-left font-extrabold w-full shiny-text-light-violet mt-20 mb-10">
            Score system
          </p>
          <div className="grid place-items-center p-2">
            <p className="text-xl text-gray-400 drop-shadow-[0px_0px_8px_#ffffff] text-left max-w-[50vw] mb-4">
              Got in an argument with your friend ? you want to prove who's
              better ? just hop on and see who's got more points. Easy.
            </p>
          </div>
          <div className="grid place-items-center my-8 z-0">
            <Link
              href="/multiplayer/leaderboard"
              className="px-16 py-4 bg-white/30 rounded-xl border-3 border-gray-200/20
          hover:bg-white/25 z-10 transition-all duration-300 active:scale-95
          "
            >
              <p
                className="z-20 shiny-text-light-violet text-3xl font-bold font-outfit hover:cursor-pointer
            hover:opacity-90 active:scale-95 transition-all duration-200
            "
              >
                Check out Leaderboard {">"}
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end mx-30">
        <div className="max-w-[70vw] flex flex-col items-start">
          <p className="p-2 text-6xl font-outfit tracking-wide text-left font-extrabold w-full shiny-text-light-violet mt-20 mb-10">
            Stats Dashboard
          </p>
          <div className="grid place-items-center p-2">
            <p className="text-xl text-gray-400 drop-shadow-[0px_0px_8px_#ffffff] text-left max-w-[50vw] mb-4">
              You wanna know your accuracy ? How many problems you solved ? Well
              everything's in one place, just for you.
            </p>
          </div>
          <div className="grid place-items-center my-8 z-0">
            <Link
              href={"/me"}
              className="px-16 py-4 bg-white/30 rounded-xl border-3 border-gray-200/20
          hover:bg-white/25 z-10 transition-all duration-300 active:scale-95
          "
            >
              <p
                className="z-20 shiny-text-light-violet text-3xl font-bold font-outfit hover:cursor-pointer
            hover:opacity-90 active:scale-95 transition-all duration-200
            "
              >
                Check out Your Dashboard {">"}
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid place-items-center">
        <div className="px-4 py-2">
          <SpotlightCard
            spotlightColor={`rgba(${120}, ${20}, ${120}, ${0.25})`}
            className="animate-pulse mx-5 my-5 grid place-items-center border border-violet-700/50 rounded-lg w-[clamp(300px,90vw,500px)] min-h-[150px] p-6 transition-all duration-300
                 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)]
                 hover:border-violet-500
                 hover:scale-[1.01]
                 backdrop-blur-sm bg-white/5"
          >
            <GradientText
              text="What are you waiting for ?"
              shinyClassName="shiny-text-light-violet"
              isLang={false}
              className="text-3xl font-outfit font-semibold mb-2"
            />

            <Link 
            href={"/multiplayer/lobby"}
            className="transition-all duration-300 text-lg underline hover:scale-105 text-gray-400 drop-shadow-[0_0_8px_#f0f0f0] leading-relaxed my-2"> 
              try multiplayer mode
            </Link>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
