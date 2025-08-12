"use client";
import Image from "next/image";
import GooeyNav from "./UI/GooeyNavbar";
import { useState } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
  // update with your own items
  const items = [
    { label: "Home", href: "/" },
    { label: "Problems", href: "/problems" },
    { label: "Profile", href: "/me" },
  ];

  return (
    <nav className="z-[999] bg-gray-700/25 border-b border-gray-400/80 rounded-lg">
      <ul className="flex flex-row justify-between align-center">
        <li>
          <Image
            src={"/images/logo.png"}
            alt="AyoubCh Logo"
            height={75}
            width={150}
          />
        </li>

        <div
          style={{ height: "60px", position: "relative" }}
          className="my-auto mt-4 mr-4 font-outfit font-bold"
        >
          <GooeyNav
            items={items}
            particleCount={20}
            particleDistances={[90, 10]}
            particleR={100}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </ul>
    </nav>
  );
};

/*
<div className="flex space-x-20 border-1 border-gray-700 items-center font-semibold font-outfit bg-gradient-to-br from-violet-600 to-violet-800 px-8 py-4 rounded-full">
          <a href="/problems" className="">
            Problems
          </a>
          <a href="/projects" className="text-2xl hover:text-red-500">
            Projects
          </a>
          <a href="/changelogs">Changelogs</a>
</div>
--> OLD NAVBAR
*/
