import { Comment } from "./Comment";
import { CommentSliderProps } from "@/app/types/CommentSliderProps";

export const CommentSlider: React.FC<CommentSliderProps> = ({
  comments = [
    {
      username: "kroko147",
      content: "i love this app",
      pfpUrl: "/images/bg3.jpeg",
      id: 0,
    },
    {
      username: "kroko147",
      content: "i love this app",
      pfpUrl: "/images/bg3.jpeg",
      id: 1,
    },
    {
      username: "kroko147",
      content: "i love this app",
      pfpUrl: "/images/bg3.jpeg",
      id: 2,
    },
    {
      username: "kroko147",
      content: "i love this app",
      pfpUrl: "/images/bg3.jpeg",
      id: 3,
    },
    {
      username: "kroko147",
      content: "i love this app",
      pfpUrl: "/images/bg3.jpeg",
      id: 4,
    },
  ],
  direction = "right",
}) => {

  return (
    <div className="flex flex-row gap-5 overflow-x-hidden py-6">
      {[...comments, ...comments].map((comment, i) => {
        return (
          <div key={i}>
            <div className={`w-full whitespace-nowrap ${
                direction == "right"
                ? "animate-scroll-right"
                : "animate-scroll-left"
            }`}>
              <Comment
                id={comment.id}
                username={comment.username}
                pfpUrl={comment.pfpUrl}
                content={comment.content}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
