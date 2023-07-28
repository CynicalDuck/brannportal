import React from "react";
import Image from "next/image";

// Import icons
import {
  Box,
  Home,
  Settings,
  Navigation,
  User,
  LogOut,
  BarChart,
} from "react-feather";

// Import components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface Props {
  children?: React.ReactNode;
}

export default function NavSide({ children, ...props }: Props) {
  return (
    <div className="sticky top-0 h-screen bg-light">
      <div className="flex flex-col bg-dark h-screen px-4 rounded-r-[20px] gap-5 pt-3 shadow-sm shadow-black">
        <div className="flex justify-center mb-2">
          <Image src={"/FireLogo.png"} alt="Test" width={40} height={40} />
        </div>
        <a href="/" className="text-white hover:text-light ">
          <Home className="mx-auto" />
        </a>
        <a href="/callouts" className="text-white hover:text-light">
          <BarChart className="mx-auto" />
        </a>
        <a href="/department" className="text-white hover:text-light ">
          <Box className="mx-auto" />
        </a>
        <a href="/station" className="text-white hover:text-light">
          <Navigation className="mx-auto" />
        </a>
        <a href="/settings" className="text-white hover:text-light">
          <Settings className="mx-auto" />
        </a>
        <a
          href="/authentication/logout"
          className="text-white hover:text-light"
        >
          <LogOut className="mx-auto" />
        </a>
        <div className="mt-auto mb-5">
          <Avatar className="text-white">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
