"use client";

// Import required
import React, { useState } from "react";

// Import icons
import {
  Box,
  PlusCircle,
  BarChart,
  Key,
  GitMerge,
  FileText,
  Users,
  Navigation,
  Truck,
} from "react-feather";

// Import components
import BasicButton from "@/components/Buttons/BasicButton";
import FeaturedCard from "@/components/Cards/FeaturedCard";
import BasicCard from "@/components/Cards/BasicCard";
import { Pie, Bar } from "react-chartjs-2";
import { Separator } from "@/components/ui/separator";
import TableCallout from "@/components/Tables/TableCallout";
import TableStation from "@/components/Tables/TableStation";
import TableVehicle from "@/components/Tables/TableVehicle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement
);

// Import hooks

// Types
interface Props {
  children?: React.ReactNode;
}

export default function Department({ children, ...props }: Props) {
  // States
  const [active, setActive] = useState("Dashboard");

  // Fetching

  // Functions

  // Variables

  // Return
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
        <div className="text-primary text-4xl hidden lg:block">
          Fire department
        </div>
        <div className="bg-accent7 rounded-full py-2 px-2 text-primary">
          <div className="flex flex-row gap-2">
            <Box />
            <div>NRBR</div>
          </div>
        </div>
        <div className="lg:flex lg:justify-end lg:grow lg:gap-2">
          <BasicButton state="default" className="">
            <div className="">
              <div className="flex flex-row gap-2">
                <PlusCircle /> <div>Create new</div>
              </div>
            </div>
          </BasicButton>
          <BasicButton state="default" className="">
            <div className="">
              <div className="flex flex-row gap-2">
                <GitMerge /> <div>Join new</div>
              </div>
            </div>
          </BasicButton>
        </div>
      </div>
      <div className="md:flex md:flex-row md:gap-2 md:mt-5 hidden md:block text-xs">
        <BasicButton
          state="default"
          className={active === "Dashboard" ? "bg-indigo-600" : "bg-indigo-400"}
          onClick={() => setActive("Dashboard")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <div>Dashboard</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={active === "Callouts" ? "bg-indigo-600" : "bg-indigo-400"}
          onClick={() => setActive("Callouts")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <div>Callouts</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={active === "Stations" ? "bg-indigo-600" : "bg-indigo-400"}
          onClick={() => setActive("Stations")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <div>Stations</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={active === "Vehicles" ? "bg-indigo-600" : "bg-indigo-400"}
          onClick={() => setActive("Vehicles")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <div>Vehicles</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={active === "Settings" ? "bg-indigo-600" : "bg-indigo-400"}
          onClick={() => setActive("Settings")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <div>Settings</div>
            </div>
          </div>
        </BasicButton>
      </div>
      <Separator className="my-4" />
      {active == "Callouts" && <Callouts />}
      {active == "Dashboard" && <Dashboard />}
      {active == "Stations" && <Stations />}
      {active == "Vehicles" && <Vehicles />}
      {active == "Settings" && <Settings />}
    </div>
  );
}

export function Dashboard({ children, ...props }: Props) {
  // Variables
  const dataPie = {
    labels: [
      "Helse",
      "Brann",
      "Trafikkulykke",
      "Automatisk brannalarm",
      "Dyreoppdrag",
      "RVR",
    ],
    datasets: [{ data: [43, 32, 59, 23, 67, 20] }],
  };

  const pieSettings = {
    plugins: {
      legend: {
        position: "right",
      },
      title: true,
    },
  };

  const dataBar = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ],
    datasets: [{ data: [120, 43, 32, 59, 23, 67, 20, 45, 32, 56, 89, 93] }],
  };

  const barSettings = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col gap-2 lg:gap-12 lg:flex-row w-full">
      <div className="flex flex-col 2xl:w-1/2">
        <div className="grid grid-cols-1 xl:grid-rows-2 xl:gap-10 gap-2 md:grid-cols-2 mt-2 xl:mt-5">
          <FeaturedCard
            title="Callouts"
            icon={<BarChart />}
            className={
              "rounded-[20px] bg-gradient-to-r from-accent5 to-accent4"
            }
          >
            <div className="flex flex-col px-6 w-full">
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
            title="Users"
            icon={<Users />}
            className={
              "rounded-[20px] bg-gradient-to-r from-blue-400 to-blue-500"
            }
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">54</div>
                <div className="ml-5">Registered users</div>
              </div>
              <div className="flex justify-evenly py-4">
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">5</div>
                  <div className="text-sm">New in the last year</div>
                </div>
                <div className="border-r border-dotted" />
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">3</div>
                  <div className="text-sm">Currently online</div>
                </div>
              </div>
            </div>
          </FeaturedCard>
          <FeaturedCard
            title="Stations"
            icon={<Navigation />}
            className={
              "rounded-[20px] bg-gradient-to-r from-green-400 to-green-500"
            }
          >
            <div className="flex flex-col px-6 w-full">
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
              "rounded-[20px] bg-gradient-to-r from-orange-400 to-red-400"
            }
          >
            <div className="flex flex-col px-6 w-full">
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
            <div className="flex flex-col px-6 w-full"></div>
          </FeaturedCard>
        </div>
        <div className="mt-10">
          <TableCallout title={"Recent callouts"} />
        </div>
      </div>
      <div className="flex flex-col w-1/2 hidden xl:block">
        <div className="grid grid-cols-1 grid-rows-2 gap-10 lg:grid-cols-2 mt-5">
          <div className="col-span-2 row-span-2">
            <BasicCard title="" className="hidden md:block col-span-2 w-[99%]">
              <div className="flex flex-col gap-2 px-6 w-[100%]">
                Callouts per category
                <Pie data={dataPie} options={pieSettings} title="Test" />
                Number of callouts each month
                <Bar data={dataBar} options={barSettings} />
              </div>
            </BasicCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Callouts({ children, ...props }: Props) {
  return (
    <div className="w-full flex justify-center justify-items-center">
      <TableCallout title={"Department callouts"} />
    </div>
  );
}

export function Stations({ children, ...props }: Props) {
  return (
    <div className="w-full flex justify-center justify-items-center">
      <TableStation />
    </div>
  );
}

export function Vehicles({ children, ...props }: Props) {
  return (
    <div className="w-full flex justify-center justify-items-center">
      <TableVehicle />
    </div>
  );
}

export function Settings({ children, ...props }: Props) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2">
          <div className="">Department name:</div>
          <input
            type="text"
            className="rounded-[10px] border-accent3 text-dark w-full px-2"
            placeholder="Nedre Romerike brann- og redningsvesen IKS"
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="">Abbrivation:</div>
          <input
            type="text"
            className="rounded-[10px] border-accent3 text-dark w-full px-2"
            placeholder="NRBR"
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="">Administrators:</div>
          <div className="flex flex-col">
            <div className="text-sm">Marius Bekk</div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="">Add new administrator:</div>
          <Select>
            <SelectTrigger className="rounded-[10px] border-accent3 text-dark w-full px-2 bg-white">
              <SelectValue placeholder="Select user to add as admin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Department users</SelectLabel>
                <SelectItem value="1" disabled>
                  Marius Bekk
                </SelectItem>
                <SelectItem value="2">Christopher Johansen</SelectItem>
                <SelectItem value="3">Ole Martin Langseth</SelectItem>
                <SelectItem value="4">Mads Langseth</SelectItem>
                <SelectItem value="5">Mats Gulbrandsen</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
