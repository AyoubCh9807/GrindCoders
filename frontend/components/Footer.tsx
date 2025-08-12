"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-gradient-to-b from-violet-950 to-indigo-950 z-40 text-gray-300">
      <hr className="w-full h-2 text-gray-600 opacity-50" />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-evenly ml-6">
          <Image
            src={"/images/logo.png"}
            alt="Company logo"
            width={100}
            height={100}
          />

          <div>
            <p className="text-xl font-outfit font-semibold">
              A website created by{" "}
              <Link
                className=" shiny-text-footer bg-clip-text hover:text-violet-300 hover:cursor-pointer hover:scale-105 transition-all duration-300"
                href={"https://www.instagram.com/ayoubchemingui_/"}
                target="_blank"
                >   
                this guy
              </Link>
            </p>
          </div>

          <p className="text-lg font-outfit font-semibold text-gray-500">© 2025 Code Grinders</p>
        </div>

        <ul className="flex flex-row justify-evenly items-center max-w-[45vw] w-full text-xl font-outfit font-semibold">
          <li className="hover:drop-shadow-[0_0_4px_#0f0f0f]">
            <a href="https://github.com/AyoubCh9807" target="_blank">Github</a>
          </li>
          <li className="hover:drop-shadow-[0_0_4px_#0f0f0f] cursor-not-allowed">
            <a>Docs</a>
          </li>
          <li className="hover:drop-shadow-[0_0_4px_#0f0f0f] cursor-not-allowed">
            <a>Showcase</a>
          </li>
          <li className="hover:drop-shadow-[0_0_4px_#0f0f0f] ">
            <a href="/tos" target="_blank">Terms of service </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
