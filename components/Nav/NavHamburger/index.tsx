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
  return (
    <div className="lg:flex lg:justify-end lg:grow lg:gap-2">
      <div className="md:hidden">
        <Select onValueChange={(e) => window.location.assign(e)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Menu" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pages</SelectLabel>
              <SelectItem value="home" disabled>
                Home
              </SelectItem>
              <SelectItem value="callouts">Callouts</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="station">Station</SelectItem>
              <SelectItem value={"profile/" + appData.session?.user?.id}>
                Profile
              </SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="authentication/logout">Sign out</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
