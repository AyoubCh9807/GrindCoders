import { TbCircuitChangeover } from "react-icons/tb";
import { FaShoppingBag } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { GoCommandPalette } from "react-icons/go";
import { FaNodeJs } from "react-icons/fa";

export const topics = [
    { label: "General", icon: <FaShoppingBag size={25} /> },
    {
      label: "Algorithms",
      icon: <TbCircuitChangeover size={25} className="text-amber-400" />,
    },
    {
      label: "Scripting",
      icon: <GoCommandPalette size={25} className="text-green-600" />,
    },
    {
      label: "Database",
      icon: <FaDatabase size={25} className="text-blue-600" />,
    },
    {
      label: "Javascript",
      icon: <FaNodeJs size={25} className="text-cyan-300" />,
    },
  ];