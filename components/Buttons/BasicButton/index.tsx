// Import required
import React from "react";
import { cn } from "@/lib/utils";

// Types
interface Props {
  children?: React.ReactNode;
  state: "default" | "success" | "warning" | "alert";
  icon?: React.ReactNode;
  className?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Add onClick prop
}

export default function BasicButton({
  state,
  icon,
  children,
  className,
  onClick, // Add onClick prop to the destructuring
  ...props
}: Props) {
  let buttonColorClass = "";

  switch (state) {
    case "default":
      buttonColorClass = "bg-accent2";
      break;
    case "success":
      buttonColorClass = "bg-success";
      break;
    case "warning":
      buttonColorClass = "bg-warning";
      break;
    case "alert":
      buttonColorClass = "bg-danger";
      break;
    default:
      buttonColorClass = "bg-accent2";
      break;
  }

  return (
    <button
      onClick={onClick} // Add onClick prop here
      className={cn(
        `px-4 py-2 rounded-full ${buttonColorClass} text-white hover:brightness-125`,
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
