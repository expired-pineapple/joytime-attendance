"use client";
import { useState } from 'react';

import { IoIosLogOut } from "react-icons/io";
import {  CiMenuFries } from "react-icons/ci";
import Logo from '@/public/logo.png';
import Link from "next/link";
import Image from "next/image";
import { NavLink } from "@/app/components/navlink";
import { useRouter } from 'next/navigation';
import { LuFileSignature } from 'react-icons/lu';
import { RiAccountPinCircleLine } from 'react-icons/ri';

interface SidebarProps {
  admin?: boolean
  manager?: boolean
}

const SideBar: React.FC<SidebarProps> = ({ admin, manager }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const SidebarContent = () => (
    <>
      <Link
        href="/"
        className="flex flex-col items-center justify-center w-full font-bold text-lg my-8 sm:mb-4 sm:p-2"
      >
        <Image
          src={Logo}
          width={80}
          height={50}
          alt='logo'
          
        />
       
      </Link>

      <div className="list mt-4 grid grid-cols-1 gap-3">
          <NavLink
            heading={"Attendance"}
            link={""}
            icon={LuFileSignature}
          />
          <NavLink
            heading={"Employee"}
            link={"employee"}
            icon={RiAccountPinCircleLine}
          />
          <NavLink
            heading={"Managers"}
            link={"managers"}
            icon={RiAccountPinCircleLine}
          />
        <div
          className="flex items-center group pl-8 py-3 gap-2 cursor-pointer"
          onClick={() => router.push('/login')}
        >
          <IoIosLogOut className="group-hover:text-red-500 text-2xl sm:text-md" />
          <span className="group-hover:text-black text-gray-500 dark:group-hover:text-white font-semibold">
            Logout
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="print:hidden">
      {/* Mobile Menu Button */}
      <div 
        className='block lg:hidden absolute left-1 z-50 cursor-pointer bg-transparent dark:text-white p-4 rounded-full'
        onClick={() => setOpen(!open)}
      >
        <CiMenuFries className='text-xl' />
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div 
            className="block lg:hidden fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
          />
          <aside className="block lg:hidden fixed top-0 left-0 bg-white dark:bg-black dark:text-white h-screen w-64 z-50">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen overflow-y-auto print:hidden border-r-[1.5px] border-gray-200 dark:bg-black dark:text-white bg-white">
        <SidebarContent />
      </aside>
    </div>
  );
};

export default SideBar;