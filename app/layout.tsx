"use client";

import React, { useEffect } from "react";
import "./globals.css";

// Import components
import TopBar from "../components/TopBar";
import NavSide from "../components/Nav/NavSide";

// Types
interface Props {
  children?: React.ReactNode;
}

var url = "";
export default function Layout({ children, ...props }: Props) {
  if (typeof window !== "undefined") {
    url = window.location.href;
  }

  return (
    <html>
      <body>
        <div
          className={
            url.includes("authentication")
              ? "w-screen min-h-screen bg-[url('./bg-pic.jpg')] relative flex flex-col items-center justify-center"
              : "w-screen min-h-screen bg-light relative flex flex-col items-center justify-center"
          }
        >
          <div className="block md:hidden">
            <TopBar />
          </div>
          <div className="flex w-full">
            <div className="hidden md:block">
              {url.includes("authentication") ? null : <NavSide />}
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
