import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Types
interface Props {
  children?: React.ReactNode;
  title: string | undefined;
  icon?: React.ReactNode | undefined;
  className?: React.ReactNode;
}

export default function FeaturedCard({
  title,
  icon,
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "rounded-[20px] shadow-xs shadow-black w-full min-w-full",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex grow flex-row py-4 px-4">
          <div className="flex grow justify-start text-white">
            <div className=" underline underline-offset-8">{title}</div>
          </div>
          <div className="flex grow justify-end text-white">
            {icon ? icon : null}
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2 px-2 flex-grow">
          <div className="text-white">{children}</div>
        </div>
      </div>
    </div>
  );
}
