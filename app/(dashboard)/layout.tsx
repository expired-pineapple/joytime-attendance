import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SideBar from "../components/sidebar";
import { Toaster } from "@/components/ui/toaster"
import getCurrentUser from "../actions/getCurrentUser";
import Topnav from "@/app/components/topnav";
import { Provider } from "./themeprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Management"
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex relative">
            <div className="lg:w-[14%] fixed z-50">
              <SideBar admin={user?.isAdmin} manager={user?.isManager} />
            </div>
            <div className="bg-muted/40 dark:bg-neutral-900 p-4  sm:px-10 lg:ml-[14%] w-full">
              <div className="">
                <Topnav />
              </div>
              <div className="min-h-screen mt-[3%]">
                {children}
              </div>
              
              <Toaster />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
