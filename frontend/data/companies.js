import { FaAmazon, FaMicrosoft, FaGoogle, FaApple, FaAirbnb, FaUber, FaLinkedin } from "react-icons/fa";
import { RiNetflixFill } from "react-icons/ri";
import { FaBagShopping, FaMeta } from "react-icons/fa6"

export const companies = [
    {
      label: "Google",
      icon: <FaGoogle size={25} className="text-orange-400" />,
    },
    {
      label: "Apple",
      icon: <FaApple size={25} className="text-gray-300" />,
    },
    {
      label: "Facebook",
      icon: <FaMeta size={25} className="text-blue-400" />,
    },
    {
      label: "Netflix",
      icon: <RiNetflixFill size={25} className="text-[#E50914]" />,
    },
    {
      label: "AirBNB",
      icon: <FaAirbnb size={25} className="text-[#FF5A5F]" />,
    },
    {
      label: "Amazon",
      icon: <FaAmazon size={25} className="text-[#FF9900]" />,
    },
    {
      label: "Uber",
      icon: <FaUber size={25} className="text-[#1C1C1E]" />,
    },
    {
      label: "Microsoft",
      icon: <FaMicrosoft size={25} className="text-[#F25022]" />,
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedin size={25} className="text-[#0A66C2]" />,
    },
    {
      label: "Any",
      icon: <FaBagShopping size={25}/>
    }
  ];