// Import required
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NavHamburger(appData: any) {
  // Get current path
  let currentPath;

  if (typeof window !== "undefined") {
    currentPath = window.location.pathname;
  } else {
    // Define a fallback value or handle the case where window is not available
    currentPath = ""; // Fallback value
  }

  // Check path to determine wich menu item should be active
  const activePath =
    currentPath === "/"
      ? "home"
      : currentPath.startsWith("/callouts")
      ? "callouts"
      : currentPath.startsWith("/department")
      ? "department"
      : currentPath.startsWith("/station")
      ? "station"
      : currentPath.startsWith("/profile")
      ? currentPath
      : currentPath.startsWith("/settings")
      ? "settings"
      : currentPath.startsWith("/authentication")
      ? "authentication/logout"
      : null;

  return (
    <div className="md:hidden">
      <Select onValueChange={(e) => window.location.assign(e)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Menu" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Pages</SelectLabel>
            <SelectItem value="/" disabled={activePath === "/"}>
              Home
            </SelectItem>
            <SelectItem value="callouts" disabled={activePath === "callouts"}>
              Callouts
            </SelectItem>
            <SelectItem
              value="department"
              disabled={activePath === "department"}
            >
              Department
            </SelectItem>
            <SelectItem value="station" disabled={activePath === "station"}>
              Station
            </SelectItem>
            <SelectItem
              value={"profile/" + appData.session?.user?.id}
              disabled={activePath === "profile"}
            >
              Profile
            </SelectItem>
            <SelectItem value="settings" disabled={activePath === "settings"}>
              Settings
            </SelectItem>
            <SelectItem
              value="authentication/logout"
              disabled={activePath === "authentication/logout"}
            >
              Sign out
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
