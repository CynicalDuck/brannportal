"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// Supabase
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

// Import components
import TopBar from "../components/TopBar";
import NavSide from "../components/Nav/NavSide";

// Import hooks
import { useAuth } from "@/hooks/authentication/useAuth";

// Types
interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children, ...props }: Props) {
  // Auth
  const { session } = useAuth();

  // Router & Pathname
  const pathname = usePathname();

  return (
    <html>
      <body>
        <div
          className={
            pathname.includes("authentication")
              ? "w-screen min-h-screen bg-[url('./bg-pic.jpg')] relative flex flex-col items-center justify-center"
              : "w-screen min-h-screen bg-light relative flex flex-col items-center justify-center"
          }
        >
          <div className="block md:hidden">
            <TopBar />
          </div>
          <div className="flex w-full">
            <div className="hidden md:block">
              {pathname.includes("authentication") ? null : <NavSide />}
            </div>
            <div className="flex flex-col px-5 py-5 md:px-20 md:py-20 max-w-full md:max-w-full md:flex-grow items-center">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
