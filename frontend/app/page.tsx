"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { User } from "./types/User";
import { ContentBlock } from "@/components/ContentBlock";
import { ImageStackNoSSR } from "@/components/ImageStackNoSSR";
import { CardData } from "@/components/UI/ImageStack";
import { getLangById } from "./utils/getLangById";
import Squares from "@/components/UI/SquaresBg";
import { FeatureDisplay } from "@/components/FeatureDisplay";
import { GradientText } from "@/components/GradientText";
import { getDescByLang } from "./utils/getDescByLang";
import { CommentSlider } from "@/components/CommentSlider";
import SpotlightCard from "@/components/UI/SpotLightCard";
import commentArray from "@/data/commentArrays";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [topCard, setTopCard] = useState<CardData | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("");

  const [cardsData, setCardsData] = useState<{ id: number; img: string }[]>([
    { id: 1, img: "/icons/python-logo.svg" },
    { id: 2, img: "/icons/java-logo.svg" },
    { id: 3, img: "/icons/nodejs-logo.svg" },
    { id: 4, img: "/icons/ruby-logo.svg" },
    { id: 5, img: "/icons/elixir-logo.svg" },
    { id: 6, img: "/icons/c-logo.svg" },
  ]);

  useEffect(() => {
    setSelectedLang(getLangById(topCard?.id || 0));
  }, [topCard]);

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
      <div className="bg-[#0a0a0a] flex flex-col justify-evenly gap-10 py-5 z-10">
        <Section
          title="A New Way to Learn"
          content="LeetCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews."
          imgUrl="/images/blackmancoding.avif"
          align="right"
          vignette={false}
        />

        <Section
          title="Start Exploring"
          content="Explore is a well-organized tool that helps you get the most out of LeetCode by providing structure to guide your progress towards the next step in your programming career."
          imgUrl="/images/digitalcommunication.png"
          align="left"
        />

        <div>
          <br />
          <div className="grid place-items-center">
            <div className="flex flex-col items-center justify-center w-full">
              <ContentBlock
                title="Zero cost, all the cool"
                content="everything you need to practice, all in one place"
                shinyClassName="shiny-text-light-violet"
              />
            </div>
          </div>
        </div>

        <div className="grid place-items-center">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col justify-evenly items-center gap-2">
              <FeatureDisplay
                symbol="%"
                countDir="up"
                from={0}
                to={100}
                title="Free & Open Source"
                desc="Loved by devs around the world "
              />
              <FeatureDisplay
                symbol="+"
                countDir="up"
                from={0}
                to={10}
                title="Different Programming Languages"
                desc="Made to help devs"
              />
            </div>

            <div className="flex flex-col justify-evenly items-center gap-2">
              <FeatureDisplay
                symbol="+"
                countDir="up"
                from={0}
                to={99}
                title="Different Problems"
                desc="Across all topics"
              />
              <FeatureDisplay
                symbol="+"
                countDir="up"
                from={0}
                to={10}
                title="Different Top Companies"
                desc="Practice with real interview questions"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-evenly relative">
          <p className="text-4xl font-outfit tracking-wide text-center font-extrabold w-full shiny-text-light-violet mt-20 mb-10">
            A variety of languages to select from
          </p>
          <div className="flex flex-row justify-evenly items-center">
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl text-left mr-20">
              {getDescByLang(selectedLang)}
            </p>
            <div className="flex flex-col items-center justify-evenly">
              <p className="font-outfit text-3xl text-center">
                selected lang:{" "}
                <GradientText
                  text={getLangById(topCard?.id || 0)}
                  isLang={true}
                />{" "}
              </p>

              <div className="grid place-items-center">
                <ImageStackNoSSR
                  cardsData={cardsData}
                  bgColor="#ffffff"
                  onTopCardChange={setTopCard}
                  randomRotation={true}
                  cardDimensions={{ width: 150, height: 150 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-evenly">
          <p className="text-6xl font-outfit shiny-text-light-violet text-center">
            Loved by everyone
          </p>
          <p className="text-xl font-outfit shiny-text-default text-center">
            See what people think about GrindCoders
          </p>
        </div>

        <div className="flex flex-col">
          <CommentSlider direction="right" comments={commentArray.slice(0, 10)} />
          <CommentSlider direction="left" comments={commentArray.slice(10, 20)}/>
          <CommentSlider direction="right" comments={commentArray.slice(20, 30)}/>
        </div>

        <div className="grid place-items-center">
          <div className="px-4 py-2">
            <SpotlightCard
              spotlightColor={`rgba(${120}, ${20}, ${120}, ${0.25})`}
              className="grid place-items-center border border-violet-700/50 rounded-lg w-[clamp(300px,90vw,500px)] min-h-[150px] p-6 transition-all duration-300
                 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)]
                 hover:border-violet-500
                 hover:scale-[1.01]
                 backdrop-blur-sm bg-white/5"
            >
              <GradientText
                text="CodeGrinders is ready for ya"
                shinyClassName="shiny-text-light-violet"
                isLang={false}
                className="text-3xl font-outfit font-semibold mb-2"
              />

              <p className="text-lg text-gray-400 drop-shadow-[0_0_8px_#f0f0f0] leading-relaxed my-2">
                take a look around
              </p>
            </SpotlightCard>
          </div>
        </div>

      </div>
    </div>
  );
}



/*

LEETER GLITCH BG
              <div className="absolute inset-0 w-full h-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] opacity-10 bg-gradient-to-b from-black via-transparent to-black">
                <LetterGlitch
                  glitchSpeed={50}
                  centerVignette={true}
                  outerVignette={true}
                  smooth={true}
                />
              </div>

*/
