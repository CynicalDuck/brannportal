"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../app/supabase";

// Import Components
import BasicCard from "../components/Cards/BasicCard";
import FeaturedCard from "../components/Cards/FeaturedCard";
import { Separator } from "@/components/ui/separator";
import BasicButton from "@/components/Buttons/BasicButton";
import TableCallout from "@/components/Tables/TableCallout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Progress from "@/components/Loaders/Progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MapCallouts from "@/components/Maps/MapCallouts";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";
import { useFetch } from "@/hooks/fetch/useFetch";
import { useFetchUserCallouts } from "@/hooks/fetch/useFetchUserCallouts";

// Import Icons
import {
  BarChart,
  Truck,
  Users,
  Navigation,
  Home as HomeIcon,
  User,
} from "react-feather";

export default function Home() {
  // States
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [active, setActive] = useState("Dashboard");
  const [stations, setStations] = useState<any>();

  // Auth
  const { session } = useSession();

  // Fetch
  const { data: dataCallouts, error: errorCallouts } = useFetchUserCallouts();

  async function fetchUserStations() {
    const { data, error } = await supabase
      .from("user_connection_station")
      .select(
        `*,
          station (*)
    `
      )
      .eq("user", session?.user.id);

    if (!error) {
      setStations(data);
    }
  }

  // Functions
  // Helper function to convert minutes to "h hours m minutes" format
  const formatTime = (minutes: any) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes} minutes`;
    } else {
      return `${minutes} minutes`;
    }
  };

  // Use effects
  useEffect(() => {
    const fetchStationsData = async () => {
      const data = await fetchUserStations();
    };

    fetchStationsData();
  }, [session]);

  // Variables
  const TooltipContentText = () => (
    <div>
      This is just an <strong>ESTIMATE </strong> based on a research paper
      written by Joe Domitrovich, George Broyles, <br /> Roger D. Ottmar,
      Timothy E. Reinhardt, Luke P. Naeher, Michael T. Kleinman, Kathleen M.
      Navarro, Christopher E. Mackay, and Olorunfemi Adetona in 2017.
      <br /> They estimate that the risk of cancer for{" "}
      <strong>Wildland </strong>
      firefighters will heighten by 22-24% after 10 years and 25-39% after 20
      years.
      <br /> We have taken the middle ground of 30.5 percent and 15 years and
      found the rise in % per minute. This is just to give you an idea of the
      risk of cancer in our line of work.
    </div>
  );

  //console.log(stations[0]);

  // Returns

  if (!session) {
    return <Progress />;
  }

  return (
    <main className="w-full">
      <div className="">
        <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
          <div className="text-primary text-4xl hidden lg:block">Dashboard</div>
          <div className="bg-accent7 rounded-full py-2 px-2 text-primary">
            <div className="flex flex-row gap-2">
              <User />
              <div>
                {session?.user?.user_metadata?.name
                  ? session?.user?.user_metadata?.name
                  : session?.user?.email
                  ? session?.user?.email
                  : "Unknown user"}
              </div>
            </div>
          </div>
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
                    <SelectItem value="settings">Settings</SelectItem>
                    <SelectItem value="authentication/logout">
                      Sign out
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
            <div className="">
              <div className="flex flex-row gap-2">
                <HomeIcon size={14} />
                <div className="hidden md:block">Dashboard</div>
              </div>
            </div>
          </BasicButton>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-12">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 xl:grid-rows-1 xl:gap-5 gap-2 md:grid-cols-2 xl:grid-cols-3 mt-2 xl:mt-5">
              <FeaturedCard
                title="Callouts"
                icon={<BarChart />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
                }
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-5xl">
                      {dataCallouts ? dataCallouts.data.length : 0}
                    </div>
                    <div className="ml-5">All time</div>
                  </div>
                  <div className="flex justify-evenly py-4">
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">
                        {dataCallouts ? dataCallouts.countToday : 0}
                      </div>
                      <div className="text-sm">Today</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">
                        {dataCallouts ? dataCallouts.countThisMonth : 0}
                      </div>
                      <div className="text-sm">This month</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold">
                        {dataCallouts ? dataCallouts.countThisYear : 0}
                      </div>
                      <div className="text-sm">This year</div>
                    </div>
                  </div>
                </div>
              </FeaturedCard>
              <FeaturedCard
                title="Smoke exposure"
                icon={<Users />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
                }
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-3xl">
                      {formatTime(dataCallouts?.exposedToSmokeTime)}
                    </div>
                    <div className="ml-5">in smoke</div>
                  </div>
                  <div className="flex justify-between py-4">
                    <div className="text-center mx-4">
                      <div className="font-bold">
                        {dataCallouts?.exposedToSmokeCount}
                      </div>
                      <div className="text-sm">times</div>
                    </div>
                    <div className="border-r border-dotted" />
                    <div className="text-center mx-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="font-bold">
                              {!isNaN(
                                parseFloat(dataCallouts?.exposedToSmokeTime)
                              )
                                ? `${
                                    parseFloat(
                                      dataCallouts?.exposedToSmokeTime
                                    ) * 0.0000000386
                                  }%`
                                : "Invalid value"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <TooltipContentText />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="text-sm">Heighten risk of cancer (*)</div>
                    </div>
                  </div>
                </div>
              </FeaturedCard>
              <FeaturedCard
                title="Stations"
                icon={<Navigation />}
                className={
                  "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
                }
              >
                <div className="flex flex-col px-6">
                  <div className="flex flex-row">
                    <div className="text-5xl">{stations?.length}</div>
                    <div className="ml-5">Stations connected</div>
                  </div>
                </div>
              </FeaturedCard>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <MapCallouts
                center={stations ? stations[0]?.station : null}
                heatmap
                heatmapLocations={dataCallouts?.data}
              />
            </div>
            <TableCallout data={dataCallouts?.data} />
          </div>
        </div>
      </div>
    </main>
  );
}
