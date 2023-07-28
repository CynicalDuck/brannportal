"use client";

// Import required
import React, { useState } from "react";

// Import icons
import {} from "react-feather";

// Import components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";

// Types
interface Props {
  children?: React.ReactNode;
}

export default function Callouts({ children, ...props }: Props) {
  // States

  // Auth
  const { session } = useSession();

  // Fetching

  // Functions

  // Return
  return (
    <div className="flex flex-col gap-2">
      <div className="text-primary text-4xl hidden lg:block">Template</div>
      <div className="lg:flex lg:justify-end lg:grow lg:gap-2">
        <div className="md:hidden">
          <Select onValueChange={(e) => window.location.assign(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Menu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pages</SelectLabel>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="callouts" disabled>
                  Callouts
                </SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="station">Station</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="authentication/logout">Sign out</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
