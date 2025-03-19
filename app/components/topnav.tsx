"use client";
import React from "react";
import Link from "next/link";

import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";

import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CiLogout } from "react-icons/ci";

const Topnav = () => {
    const { setTheme } = useTheme();

    return (
        <div className="flex justify-end items-center print:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="hover:bg-transparent dark:hover:text-white p-2 pointer-cursor">
                        <IoSunnyOutline className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <IoMoonOutline className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="overflow-hidden rounded-full"
                            onClick={() => {
                                signOut();
                            }}
                        >
                            <CiLogout className="h-5 w-5" />
                        </Button>

                    </TooltipTrigger>
                    <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default Topnav;