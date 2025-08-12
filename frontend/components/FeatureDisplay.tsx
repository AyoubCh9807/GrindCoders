import SpotlightCard from "./UI/SpotLightCard";
import CountUp from "./UI/CountUp";

import { FeatureDisplayProps } from "@/app/types/FeatureDisplayProps";

export const FeatureDisplay: React.FC<FeatureDisplayProps> = ({
  countDir = "up",
  symbol = "+",
  from = 0,
  to = 100,
  title = "title goes here",
  desc = "desc goes here",
}) => {
  return (
    <div className="flex flex-row justify-evenly items-center">
      <div className="flex flex-col justify-evenly items-center gap-2">
        <div className="grid place-items-center">
          <div className="w-full md:w-[45vw]">
            <SpotlightCard
              className="border-2 border-violet-400 rounded-lg px-10 py-10"
              spotlightColor="rgba(120, 19, 127, 0.25)"
            >
              <div className="flex flex-col justify-evenly items-start">
                <div className="flex flex-row justify-evenly items-center">
                  <CountUp
                    from={from}
                    to={to}
                    direction={countDir}
                    className="text-8xl text-left  font-outfit font-extrabold shiny-text-light-violet"
                  />
                  <p className="text-8xl font-outfit font-bold shiny-text-light-violet text-left">
                    {symbol}
                  </p>
                </div>
                <p className="text-3xl text-left font-outfit font-bold text-gray-300">
                  {title}
                </p>
                <p className="text-xl text-left font-outfit font-semibold text-gray-500">
                  {desc}
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
};
