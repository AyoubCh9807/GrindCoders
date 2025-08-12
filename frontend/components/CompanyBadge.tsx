import { CompanyBadgeProps } from "@/app/types/CompanyBadgeProps";


export const CompanyBadge = ({
  label,
  icon,
  onClick,
  selected
}: CompanyBadgeProps) => {
  return (
    <div
      onClick={onClick}
      className={`px-9 py-3 rounded-4xl flex flex-row justify-evenly items-center hover:opacity-80 transition-all duration-200 hover:cursor-pointer ${
        selected ? "bg-gray-300" : "bg-[var(--gray-medium)]"
      }`}
    >
      {icon}
      <p
        className={`font-sans font-semibold text-xl ml-4 ${
          selected ? "text-black" : "text-gray-50"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
