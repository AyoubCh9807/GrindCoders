import dynamic from "next/dynamic";

export const ImageStackNoSSR = dynamic(() => import("@/components/UI/ImageStack"), {ssr: false}) 