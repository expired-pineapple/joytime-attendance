'use clint'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

interface Props {
  heading: string;
  icon: IconType;
  link: string;
}

export const NavLink: React.FC<Props> = ({ heading, icon: Icon, link }) => {
  const pathname = usePathname();
  const isActive = pathname === `/${link}`;

  return (
    <Link
      href={`/${link}`}
      className={`
        flex items-center group pl-8 py-3
        hover:border-r-4 hover:border-[#865EFD]/[0.5] hover:bg-[#865EFD]/[0.1]
        dark:hover:bg-[#865EFD]/[10%]
        transition-all duration-200
        ${isActive ? 'border-r-4 border-[#865EFD] bg-[#865EFD]/[0.1]' : ''}
      `}
    >
      <Icon
        className={`
          mr-2 text-xl sm:text-md
          ${isActive ? 'text-[#865EFD]' : 'text-gray-500 group-hover:text-[#865EFD]'}
        `}
      />
      <span className={`
        font-semibold
        ${isActive 
          ? 'text-[#865EFD] dark:text-[#865EFD]' 
          : 'text-gray-500 group-hover:text-black dark:group-hover:text-white'
        }
      `}>
        {heading}
      </span>
    </Link>
  );
};