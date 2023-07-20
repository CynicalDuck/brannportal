// Import required
import React, { useState } from "react";

// Import icons
import { User, BarChart2 } from "react-feather";

// Import components

// Import hooks

// Types
interface Props {
  children?: React.ReactNode;
}

export default function TopBar({ children, ...props }: Props) {
  // States

  // Fetching

  // Functions

  // Return
  return (
    <div className="bg-light flex justify-between grow">
      <header className="py-4 px-8 text-dark text-lg font-bold hover:cursor-pointer">
        <a href="/">
          <div className="flex flex-row gap-2 text-4xl">
            <div>Brannportal</div>
          </div>
        </a>
      </header>
    </div>
  );
}
