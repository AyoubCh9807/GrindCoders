import { CommentProps } from "@/app/types/CommentProps";
import SpotlightCard from "./UI/SpotLightCard";
import Image from "next/image";

export const Comment: React.FC<CommentProps> = ({
  content = "No content provided",
  username = "anonymous",
  pfpUrl = "/default-avatar.png", // Add a default avatar in your public folder
}) => {
  return (
    <SpotlightCard
      className="border border-violet-700/50 rounded-lg w-[clamp(300px,90vw,500px)] min-h-[150px] p-6 transition-all duration-300
                 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)]
                 hover:border-violet-500
                 hover:scale-[1.01]
                 backdrop-blur-sm bg-white/5"
      spotlightColor="rgba(139, 92, 246, 0.1)"
    >
      <div className="flex flex-col h-full gap-4">
        {/* Comment Content */}
        <p className="text-lg text-gray-200 font-outfit line-clamp-4">
          "{content}"
        </p>
        
        {/* User Info */}
        <div className="flex items-center gap-3 mt-auto pt-3">
          <div className="relative w-10 h-10">
            <Image
              src={pfpUrl}
              alt={`${username}'s profile`}
              fill
              className="rounded-full object-cover border border-violet-500/30"
              sizes="40px"
            />
          </div>
          <div>
            <p className="font-medium text-violet-300">@{username}</p>
            <p className="text-xs text-gray-400">Verified User</p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};