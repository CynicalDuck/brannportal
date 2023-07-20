"use client";

// Import required
import React, { useState } from "react";

// Import Components
import BasicCard from "../components/Cards/BasicCard";
import FeaturedCard from "../components/Cards/FeaturedCard";
import { Separator } from "@/components/ui/separator";
import BasicButton from "@/components/Buttons/BasicButton";
import TableCallout from "@/components/Tables/TableCallout";

// Import Icons
import {
  BarChart,
  Truck,
  Users,
  Navigation,
  Settings,
  User,
} from "react-feather";

export default function Home() {
  // States
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [active, setActive] = useState("Dashboard");

  return (
    <main className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
          <div className="text-primary text-4xl hidden lg:block">Dashboard</div>
          <div className="bg-accent7 rounded-full py-2 px-2 text-primary">
            <div className="flex flex-row gap-2">
              <User />
              <div>Marius Bekk</div>
            </div>
          </div>
          <div className="lg:flex lg:justify-end lg:grow lg:gap-2">
            <BasicButton state="default" className="">
              <div className="">
                <div className="flex flex-row gap-2">
                  <Settings /> <div>Profile settings</div>
                </div>
              </div>
            </BasicButton>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-5 text-xs">
          <BasicButton
            state="default"
            className={
              active === "Dashboard" ? "bg-indigo-600" : "bg-indigo-400"
            }
            onClick={() => setActive("Dashboard")}
          >
            <div className="flex flex-row gap-2">
              <div>Dashboard</div>
            </div>
          </BasicButton>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-12">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 xl:grid-rows-1 xl:gap-5 gap-2 md:grid-cols-2 xl:grid-cols-4 mt-2 xl:mt-5">
              <FeaturedCard
                title="Callouts"
                icon={<BarChart />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-accent5 to-accent4 w-full"
                }
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-5xl">189</div>
                    <div className="ml-5">This month</div>
                  </div>
                  <div className="flex justify-evenly py-4">
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">24</div>
                      <div className="text-sm">Today</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">2365</div>
                      <div className="text-sm">This year</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">14065</div>
                      <div className="text-sm">All time</div>
                    </div>
                  </div>
                </div>
              </FeaturedCard>
              <FeaturedCard
                title="Smoke exposure"
                icon={<Users />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-blue-400 to-blue-500 w-full"
                } // Updated class
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-3xl">3h 23m</div>
                    <div className="ml-5">In toxic smoke</div>
                  </div>
                  <div className="flex justify-between py-4">
                    <div className="text-center mx-4">
                      <div className="font-bold">5h 56m</div>
                      <div className="text-sm">In all smoke</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="font-bold">23</div>
                      <div className="text-sm">Times exposed to smoke</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="font-bold">0,4%</div>
                      <div className="text-sm">Heighten risk of cancer (*)</div>
                    </div>
                  </div>
                </div>
              </FeaturedCard>
              <FeaturedCard
                title="Stations"
                icon={<Navigation />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-green-400 to-green-500 w-full"
                } // Updated class
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-5xl">8</div>
                    <div className="ml-5">Stations</div>
                  </div>
                  <div className="flex justify-evenly py-4">
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">5</div>
                      <div className="text-sm">Full time</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">3</div>
                      <div className="text-sm">Part time</div>
                    </div>
                  </div>
                </div>
              </FeaturedCard>
              <FeaturedCard
                title="Vehicles"
                icon={<Truck />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-orange-400 to-red-400 w-full"
                } // Updated class
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-5xl">60</div>
                    <div className="ml-5">Vehicles</div>
                  </div>
                  <div className="flex justify-evenly py-4">
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">59</div>
                      <div className="text-sm">Operational vehicles</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">20</div>
                      <div className="text-sm">Emergency vehicles</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">30</div>
                      <div className="text-sm">Service vehicles</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col px-6"></div>
              </FeaturedCard>
            </div>
          </div>
          <TableCallout />
        </div>
      </div>
    </main>
  );
}
