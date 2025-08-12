import ShinyText from "./UI/ShinyText";

export const ContentBlock = ({
  title = "default title",
  content = "default content",
  shinyClassName = "shinty-text-light-violet"
}: ContentBlockProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-start py-10 px-6`}
    >

      <ShinyText
      text={title}
      speed={5}
      disabled={false}
      className="text-[clamp(2rem,5vw,3.75rem)] font-outfit font-semibold mb-4 text-center w-full"
      colorClassName={`${shinyClassName}`}
      />

      <p className="text-gray-400 drop-shadow-[0_0_8px_#f0f0f0] font-outfit text-center w-full text-xl">
        {content}
      </p>

    </div>
  );
};
