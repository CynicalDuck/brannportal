// Import required
import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Types
interface Props {
  children?: React.ReactNode;
  title: string | undefined;
  icon?: React.ReactNode | undefined;
  className?: React.ReactNode;
}

// Functions

export default function BasicCard({
  title,
  icon,
  children,
  className,
  ...props
}: Props) {
  return (
    <div>
      <div
        className={cn(
          "rounded-[20px] shadow-xs shadow-black bg-accent7 w-full min-w-fit",
          className
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex grow flex-row py-2 px-4">
            <div className="flex grow justify-start text-primary">
              <div>{title}</div>
            </div>
            <div className="flex grow justify-end text-primary">
              {icon ? icon : null}
            </div>
          </div>
          <div className="flex flex-col gap-2 py-2 px-2">
            <div className="flex flex-row gap-2 text-primary">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
