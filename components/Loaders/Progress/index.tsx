"use client";

// Import required
import React, { useState, useEffect } from "react";

// Import icons
import {} from "react-feather";

// Import components
import { Progress } from "@/components/ui/progress";

// Import hooks

// Types
interface Props {
  children?: React.ReactNode;
}

export default function ProgressBar({ children, ...props }: Props) {
  // States
  const [progress, setProgress] = useState(43);

  // useEffect
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 1);
    return () => clearTimeout(timer);
  }, []);

  // Fetching

  // Functions

  // Return
  return (
    <Progress value={progress} className="w-[60%] text-primary" color="" />
  );
}
