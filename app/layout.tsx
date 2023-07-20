import React from "react";
import "./globals.css";

// Import components
import TopBar from "../components/TopBar";
import NavSide from "../components/Nav/NavSide";

// Types
interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children, ...props }: Props) {
  return (
    <html>
      <body>
        <div className="w-full min-h-screen bg-light relative flex flex-col">
          <div className="block md:hidden">
            <TopBar />
          </div>
          <div className="md:flex w-full">
            <div className="hidden md:block">
              <NavSide />
            </div>
            <div className="flex flex-col px-5 py-5 md:px-20 md:py-20 max-w-full md:max-w-max md:flex-grow">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
