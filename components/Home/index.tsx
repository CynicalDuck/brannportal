"use client";

// Import required
import React from "react";

// Import Components
import HomeStatsCards from "./HomeStatsCards";
import { Separator } from "@/components/ui/separator";
import TableCallout from "@/components/Tables/TableCallout";
import MapCallouts from "@/components/Maps/MapCallouts";

import NavHamburger from "../Nav/NavHamburger";

export default function HomeIndex(appData: any) {
  return (
    <main className="w-full">
      <div className="">
        <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
          <div className="text-primary text-4xl hidden md:block">Dashboard</div>
          <NavHamburger appData={appData} />
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-12">
          <HomeStatsCards appData={appData} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="h-[300px] md:h-[600px] xl:h-full">
              <MapCallouts
                center={appData.stations ? appData.stations[0]?.station : null}
                markers={true}
                markerData={appData.callouts?.data}
                description
              />
            </div>
            <TableCallout data={appData.callouts?.data} address />
          </div>
        </div>
      </div>
    </main>
  );
}
