import { SectionProps } from "@/app/types/SectionProps";
import { memo } from "react";

export const Section = memo(function Section({
  title = "Default Title",
  content = "Default content goes here. This should be concise and informative.",
  imgUrl = "/images/logo.png",
  align = "right", // 'left' means image left, text right; 'right' means text left, image right
  vignette = false,
}: SectionProps) {
  // Determine flex direction based on alignment

  const isTextRight = align === "right";
  console.log(imgUrl)
  return (
    <section className="w-full min-h-[400px] md:h-[50vh] flex flex-col md:flex-row">
      {/* Text side */}
      <div
        className={`flex flex-col justify-center items-start p-8 md:p-16 md:w-1/2 ${
          isTextRight ? "order-2 md:order-2 " : "order-1 md:order-1 "
        }`}
      >
        <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-outfit font-extrabold text-gray-100 mb-4 text-center w-full drop-shadow-[0_0_16px_#ffffff] ">
          {title}
        </h2>

        <div className={`p-8 ${align === "right" ? "pr-24" : "pl-24"}`}></div>

        <p className="text-lg text-gray-400 drop-shadow-[0_0_8px_#f0f0f0] leading-relaxed max-w-xl text-center mx-auto px-4">
          {content}
        </p>
      </div>

      {/* Image side */}
      <div
        className={`relative md:w-1/2 h-64 md:h-auto ${
          isTextRight ? "order-1 md:order-1" : "order-2 md:order-2"
        }`}
      >

        <div className="grid place-items-center my-10">
                  <img
        src={`${imgUrl}`} 
        alt="Section image" 
        className="w-[clamp(200px,350px,500px)] aspect-square rounded-4xl" />

        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            vignette ? "opacity-90" : "opacity-0"
          } z-60 ${
            isTextRight
              ? "from-transparent via-[#0a0a0a] to-[#0a0a0a]"
              : "from-[#0a0a0a] via-[#0a0a0a] to-transparent"
          }`}
        />
        </div>

      </div>
    </section>
  );
});

//          isImageLeft
//         ? from-[#0a0a0a] via-[#0a0a0a] to-transparent
//       : from-transparent via-[#0a0a0a] to-[#0a0a0a]
