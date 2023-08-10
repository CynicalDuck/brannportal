"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../../app/supabase";

// Import icons
import {
  Box,
  PlusCircle,
  BarChart,
  Home,
  GitMerge,
  Settings as SettingsIcon,
  Users,
  Navigation,
} from "react-feather";

// Import components
import BasicButton from "@/components/Buttons/BasicButton";
import FeaturedCard from "@/components/Cards/FeaturedCard";
import BasicCard from "@/components/Cards/BasicCard";
import { Pie, Bar } from "react-chartjs-2";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import Progress from "@/components/Loaders/Progress";
import AutocompleteAddress from "@/components/Maps/Autocomplete";
import MapCallouts from "@/components/Maps/MapCallouts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { useSession } from "@/hooks/authentication/useSession";

// Types

export default function Station() {
  // Auth
  const { session } = useSession();

  // States
  const [active, setActive] = useState("Dashboard");
  const [activeStation, setActiveStation] = useState<any>();
  const [allStations, setAllStations] = useState<any>();
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [stationUsers, setStationUsers] = useState<any>();
  const [stationCallouts, setStationCallouts] = useState<any>();
  const [stationTypes, setStationTypes] = useState<any>();
  const [stationTypeGroups, setStationTypeGroups] = useState<any>();
  const [stationUserProfiles, setStationUserProfiles] = useState<any>();

  // Fetching

  async function fetchStations() {
    if (session) {
      const { data, error } = await supabase
        .from("user_connection_station")
        .select(`*, station(*, department(*))`)
        .eq("user", session?.user.id);

      if (error) {
        alert(
          "There was an error when fetching your stations: " + error.message
        );
      } else {
        setActiveStation(data[0]?.station || null);

        // Create a list of all stations
        let allStations: any = [];
        data.forEach((connection) => {
          allStations.push(connection.station);
        });

        setAllStations(allStations);
      }
    }
  }

  // Functions
  const handleStationselect = (station: any) => {
    setActiveStation(station);
    setIsStationDropdownOpen(false);
  };

  // Function to check if two timestamps are within 5 minutes of each other
  function areTimestampsWithin5Minutes(timestamp1: any, timestamp2: any) {
    const diff = Math.abs(timestamp1 - timestamp2);
    const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds
    return diff <= fiveMinutesInMilliseconds;
  }

  // Variables

  // Use effects
  useEffect(() => {
    const fetchStationsData = async () => {
      const data = await fetchStations();
    };

    fetchStationsData();
  }, [session]);

  useEffect(() => {
    // Fetch the users when the active station changes
    async function fetchUsers() {
      if (activeStation) {
        const { data, error } = await supabase
          .from("user_connection_station")
          .select("*")
          .eq("station", activeStation.id);

        if (error) {
          alert("There was an error when fetching the users: " + error.message);
        } else {
          setStationUsers(data);
        }
      }
    }

    // Fetch the callout types when the active station changes
    async function fetchDepartmentCalloutTypes() {
      if (activeStation) {
        const { data, error } = await supabase
          .from("callout_types")
          .select()
          .eq("department", activeStation.department.id);

        if (error) {
          alert("There was an error when fetching the types: " + error.message);
        } else {
          setStationTypes(data);
        }
      }
    }

    // Fetch the callout type groups when the active station changes
    async function fetchDepartmentCalloutTypeGroups() {
      if (activeStation) {
        const { data, error } = await supabase
          .from("callout_type_groups")
          .select()
          .eq("department", activeStation.department.id);

        if (error) {
          alert(
            "There was an error when fetching the type groups: " + error.message
          );
        } else {
          setStationTypeGroups(data);
        }
      }
    }

    // Fetch station callouts
    async function fetchStationCallouts(id: number) {
      // Fetch all callouts for the station
      const { data, error } = await supabase
        .from("callouts")
        .select(`*`)
        .eq("station", id)
        .order("date_start", { ascending: false })
        .order("time_start", { ascending: false });

      if (data) {
        var returnData = {};

        // Filter out duplicates based on callout_id and timestamp conditions
        const uniqueCallouts: any = [];
        data.forEach((callout) => {
          const isDuplicate =
            (callout.callout_id !== null &&
              callout.callout_id !== "" &&
              uniqueCallouts.some(
                (uniqueCallout: any) =>
                  callout.callout_id === uniqueCallout.callout_id &&
                  callout.station === uniqueCallout.station
              )) ||
            uniqueCallouts.some(
              (uniqueCallout: any) =>
                callout.station === uniqueCallout.station &&
                areTimestampsWithin5Minutes(
                  new Date(
                    callout.date_start + " " + callout.time_start
                  ).getTime(),
                  new Date(
                    uniqueCallout.date_start + " " + uniqueCallout.time_start
                  ).getTime()
                )
            );

          if (!isDuplicate) {
            uniqueCallouts.push(callout);
          }
        });

        // Calculate the count of callouts with date_start within the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the correct month number

        const countThisMonth = uniqueCallouts.filter(
          (callout: any) =>
            new Date(callout.date_start).getFullYear() === currentYear &&
            new Date(callout.date_start).getMonth() + 1 === currentMonth
        ).length;

        // Calculate the count of callouts with date_start within the current year
        const countThisYear = uniqueCallouts.filter(
          (callout: any) =>
            new Date(callout.date_start).getFullYear() === currentYear
        ).length;

        // Calculate the count of callouts with date_start within the current day
        const currentDay = currentDate.getDate(); // Get the day of the current date
        const countToday = uniqueCallouts.filter(
          (callout: any) =>
            new Date(callout.date_start).getFullYear() === currentYear &&
            new Date(callout.date_start).getMonth() + 1 === currentMonth &&
            new Date(callout.date_start).getDate() === currentDay
        ).length;

        // Calculate the count of callouts for each month
        const monthsLabels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const calloutsPerMonth = Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          return {
            month: monthsLabels[index],
            count: data.filter(
              (callout: any) =>
                new Date(callout.date_start).getFullYear() === currentYear &&
                new Date(callout.date_start).getMonth() + 1 === month
            ).length,
          };
        });

        // Sort the data based on the 'date_start' field from the related 'callout' table
        const sortedData = uniqueCallouts.sort((a: any, b: any) => {
          const dateA: any = new Date(a.callout?.date_start || "");
          const dateB: any = new Date(b.callout?.date_start || "");
          return dateB - dateA;
        });

        returnData = {
          data: sortedData,
          countThisMonth: countThisMonth,
          countThisYear: countThisYear,
          countToday: countToday,
          calloutsPerMonth: calloutsPerMonth,
        };

        setStationCallouts(returnData);
      }
      if (error) {
        console.log("Error fetching station callouts: " + error.message);
      }
    }

    fetchUsers();
    activeStation ? fetchStationCallouts(activeStation.id) : null;
    fetchDepartmentCalloutTypes();
    fetchDepartmentCalloutTypeGroups();
  }, [activeStation]);

  useEffect(() => {
    async function fetchStationUserProfiles() {
      if (stationUsers) {
        const userIDs = stationUsers.map((user: any) => user.user); // Extract user IDs

        const { data, error } = await supabase
          .from("user_profiles")
          .select()
          .in("user", userIDs); // Use the 'in' operator with extracted user IDs

        if (error) {
          alert(
            "There was an error when fetching the connected users: " +
              error.message
          );
        } else {
          // Process the fetched user profiles in the 'data' array
          const sortedData = data.sort((a, b) => b.game_level - a.game_level);
          setStationUserProfiles(sortedData);
        }
      }
    }

    fetchStationUserProfiles();
  }, [stationUsers]);

  // Return

  if (!session) {
    return <Progress />;
  }

  if (!activeStation) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          You have no stations connected to your user, you can do the following
          actions:
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <BasicButton
            state="default"
            className={
              active === "Create" ? "bg-dark brightness-150" : "bg-dark"
            }
            onClick={() => setActive("Create")}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <div className="hidden md:block">Create new</div>
              </div>
            </div>
          </BasicButton>
          <BasicButton
            state="default"
            className={active === "Join" ? "bg-dark brightness-150" : "bg-dark"}
            onClick={() => setActive("Join")}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <div className="hidden md:block">Join existing</div>
              </div>
            </div>
          </BasicButton>
        </div>
        {active == "Create" && <CreateNew />}
        {active == "Join" && <JoinExisting />}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
        <div className="text-primary text-4xl hidden lg:block">
          {activeStation ? activeStation.name : "Fire station"}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-4">
            <div
              className="bg-accent7 rounded-full py-2 px-4 text-primary hover:cursor-pointer"
              onClick={() => setIsStationDropdownOpen(!isStationDropdownOpen)}
            >
              <div className="flex flex-row gap-2">
                <Navigation />
                <div>{activeStation ? activeStation.code_full : "-"}</div>
              </div>
            </div>
            <div className="bg-accent7 rounded-full py-2 px-2 text-primary">
              <div className="flex flex-row gap-2">
                <div>
                  {activeStation
                    ? "Invite code: " + activeStation.invite_code
                    : "-"}
                </div>
              </div>
            </div>
          </div>
          {isStationDropdownOpen && (
            <div className="mt-2 bg-white rounded-lg shadow-md px-2 py-2">
              {allStations.map((station: any) => (
                <div
                  key={station.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleStationselect(station)}
                >
                  {station.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:hidden">
          <Select onValueChange={(e) => window.location.assign(e)}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Menu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pages</SelectLabel>
                <SelectItem value="/">Home</SelectItem>
                <SelectItem value="callouts">Callouts</SelectItem>
                <SelectItem value="station" disabled>
                  Station
                </SelectItem>
                <SelectItem value="station">Station</SelectItem>
                <SelectItem value={"profile/" + session?.user?.id}>
                  Profile
                </SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="authentication/logout">Sign out</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-5 text-xs">
        <BasicButton
          state="default"
          className={
            active === "Dashboard" ? "bg-dark brightness-150" : "bg-dark"
          }
          onClick={() => setActive("Dashboard")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <Home size={14} />
              <div className="hidden md:block">Dashboard</div>
            </div>
          </div>
        </BasicButton>
        {stationUsers?.some(
          (user: any) =>
            user.user === session.user.id &&
            (user.role_level === 2 || user.role_level === 3)
        ) && (
          <BasicButton
            state="default"
            className={
              active === "Settings" ? "bg-dark brightness-150" : "bg-dark"
            }
            onClick={() => setActive("Settings")}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <SettingsIcon size={14} />
                <div className="hidden md:block">Settings</div>
              </div>
            </div>
          </BasicButton>
        )}
        <BasicButton
          state="default"
          className={active === "Create" ? "bg-dark brightness-150" : "bg-dark"}
          onClick={() => setActive("Create")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <PlusCircle size={14} />
              <div className="hidden md:block">Create new</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={active === "Join" ? "bg-dark brightness-150" : "bg-dark"}
          onClick={() => setActive("Join")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <GitMerge size={14} />
              <div className="hidden md:block">Join existing</div>
            </div>
          </div>
        </BasicButton>
      </div>
      <Separator className="my-4" />
      {active == "Dashboard" && (
        <Dashboard
          station={activeStation}
          stationUsers={stationUsers}
          stationCallouts={stationCallouts}
          stationTypes={stationTypes}
          stationTypeGroups={stationTypeGroups}
          stationUserProfiles={stationUserProfiles}
        />
      )}
      {active == "Settings" && (
        <Settings
          station={activeStation}
          stationTypes={stationTypes}
          stationTypeGroups={stationTypeGroups}
          stationUsers={stationUsers}
        />
      )}
      {active == "Create" && <CreateNew />}
      {active == "Join" && <JoinExisting />}
    </div>
  );
}

function Dashboard(station: any) {
  // Variables
  const colorPalette = ["#293241", "#3D5A80", "#688AB6", "#98C1D9"];
  // Get all types for the dataPie
  var dataPieArray: any = [];

  station.stationTypeGroups?.forEach((group: any, index: number) => {
    var countCallouts = 0;

    station.stationCallouts?.data?.forEach((callout: any) => {
      station.stationTypes?.forEach((type: any) => {
        if (type.group === group.id && type.value === callout.type) {
          countCallouts++;
        }
      });
    });

    dataPieArray.push({
      label: group.value + " (" + countCallouts + ")",
      value: countCallouts,
      color: colorPalette[index % colorPalette.length],
    });
  });

  const dataPie = {
    labels: dataPieArray.map((item: any) => item.label),
    datasets: [
      {
        data: dataPieArray.map((item: any) => item.value),
        backgroundColor: dataPieArray.map((item: any) => item.color),
      },
    ],
  };

  const dataBar = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: station?.stationCallouts?.calloutsPerMonth?.map(
          (monthData: any) => monthData.count
        ),
      },
    ],
  };

  const barSettings = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Functions

  function formatMinutesToHoursAndMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return (
    <div className="flex flex-col gap-2 lg:gap-12 lg:flex-row w-full">
      <div className="flex flex-col 2xl:w-1/2">
        <div className="grid grid-cols-1 xl:grid-rows-1 xl:gap-10 gap-2 md:grid-cols-2 mt-2 xl:mt-5">
          <FeaturedCard
            title="Users"
            icon={<Users />}
            className={"rounded-[20px] bg-primary w-full"}
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">
                  {station.stationUsers ? station.stationUsers.length : 0}
                </div>
                <div className="ml-5">Registered users</div>
              </div>
            </div>
          </FeaturedCard>
          <FeaturedCard
            title="Callouts"
            icon={<BarChart />}
            className={"rounded-[20px] bg-primary w-full"}
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">
                  {station.stationCallouts?.data.length}
                </div>
                <div className="ml-5">All time</div>
              </div>
              <div className="flex justify-evenly py-4">
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">
                    {station.stationCallouts?.countToday}
                  </div>
                  <div className="text-sm">Today</div>
                </div>
                <div className="border-r border-dotted" />
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">
                    {station.stationCallouts?.countThisMonth}
                  </div>
                  <div className="text-sm">This month</div>
                </div>
                <div className="border-r border-dotted" />
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">
                    {station.stationCallouts?.countThisYear}
                  </div>
                  <div className="text-sm">This year</div>
                </div>
              </div>
            </div>
          </FeaturedCard>
        </div>
        <div className="h-[300px] md:h-[600px] xl:h-[600px] rounded-[20px] mt-4 xl:mt-12">
          <MapCallouts
            center={station.station ? station.station : null}
            heatmap={true}
            heatmapLocations={station?.stationCallouts?.data}
          />
        </div>
        <div className="bg-white py-2 px-2 rounded-[20px]">
          <Table>
            <TableCaption>Leaderboard</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="w-[100px]">Callouts</TableHead>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {station?.stationUserProfiles?.map(
                (profile: any, index: number) => (
                  <TableRow key={profile.id}>
                    <TableCell className="">{index + 1}</TableCell>
                    <TableCell>
                      <div
                        className="hover:text-primary hover:cursor-pointer"
                        onClick={() =>
                          (window.location.href = "/profile/" + profile.user)
                        }
                      >
                        {profile.name}
                      </div>
                    </TableCell>
                    <TableCell>{profile.callouts_total}</TableCell>
                    <TableCell className="">
                      {formatMinutesToHoursAndMinutes(profile.game_time)}
                    </TableCell>
                    <TableCell className="">{profile.game_level}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col w-1/2 hidden xl:block">
        <div className="grid grid-cols-1 grid-rows-2 gap-10 lg:grid-cols-2 mt-5">
          <div className="col-span-2 row-span-2">
            <BasicCard title="" className="hidden md:block col-span-2 w-[99%]">
              <div className="flex flex-col gap-2 px-6 w-[100%]">
                Callouts per category
                <Pie data={dataPie} />
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

function Settings(data: any) {
  // States
  const [showMessageName, setShowMessageName] = useState(false);
  const [messageName, setMessageName] = useState("");

  // Function to change the name of the station
  async function handleNameChange(value: string) {
    if (value.length > 0) {
      const { data: dataCheckName, error: errorCheckName } = await supabase
        .from("stations")
        .select()
        .ilike("name", value);

      if (errorCheckName) {
        setShowMessageName(true);
        setMessageName(
          "An error occurred while checking the name: " + errorCheckName.message
        );
      } else {
        if (dataCheckName && dataCheckName.length !== 0) {
          setShowMessageName(true);
          setMessageName("This name already exists...");
        } else {
          const { data: dataNewName, error } = await supabase
            .from("stations")
            .update({
              name: value,
            })
            .eq("id", data.station.id);

          if (error) {
            setShowMessageName(true);
            setMessageName("An error occurred: " + error.message);
          } else {
            setShowMessageName(true);
            setMessageName(
              "Changes are saved, you might need to refresh to see the effect"
            );
          }
        }
      }
    } else {
      setShowMessageName(true);
      setMessageName("The name needs at least one char");
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2">
          <div className="">Station name:</div>
          <input
            type="text"
            className="rounded-[10px] border-accent3 text-dark w-full px-2"
            defaultValue={data.station?.name ? data.station.name : "-"}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {showMessageName && <div className="text-xs">{messageName}</div>}
        </div>
        <div className="grid grid-cols-2">
          <div className="">Invitation code:</div>
          <div className="flex flex-col">
            <div className="text-sm">{data.station?.invite_code}</div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="">Created by:</div>
          <div className="flex flex-col">
            <div className="text-sm">
              {data.stationUsers?.length > 0 ? (
                data.stationUsers.map((user: any) => {
                  return user.role_level === 3 ? (
                    <div>{user.user_name}</div>
                  ) : null;
                })
              ) : (
                <div>No users available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="">Administrators:</div>
          <div className="flex flex-col">
            <div className="text-sm">
              {data.stationUsers?.length > 0 ? (
                data.stationUsers.map((user: any) => {
                  return user.role_level === 2 ? (
                    <div>{user.user_name}</div>
                  ) : null;
                })
              ) : (
                <div>No users available.</div>
              )}
            </div>
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
                <SelectLabel>Station users</SelectLabel>
                {data.stationUsers?.length > 0 ? (
                  data.stationUsers.map((user: any) => {
                    return user.role_level === 2 || user.role_level === 3 ? (
                      <SelectItem value={user.user} disabled>
                        {user.user_name}
                      </SelectItem>
                    ) : user.role_level === 0 || user.role_level === 1 ? (
                      <SelectItem value={user.user}>
                        {user.user_name}
                      </SelectItem>
                    ) : null;
                  })
                ) : (
                  <div>No users available.</div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function CreateNew() {
  // Auth
  const { session } = useSession();

  // States
  const [disableNext, setDisableNext] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorText, setNameErrorText] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorText, setAddressErrorText] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeErrorText, setCodeErrorText] = useState("");
  const [lat, setLat] = useState<any>(null);
  const [lng, setLng] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [zip, setZip] = useState<any>(null);
  const [activeDepartment, setActiveDepartment] = useState<any>();
  const [allDepartments, setAllDepartments] = useState<any>();

  // Fetching
  async function fetchDeparments() {
    if (session) {
      const { data, error } = await supabase
        .from("user_connection_department")
        .select(
          `*,
          department (*)
    `
        )
        .eq("user", session?.user.id);

      if (error) {
        alert(
          "There was an error when fetching your departments: " + error.message
        );
      } else {
        setActiveDepartment(data[0].department || null);

        // Create a list of all departments
        let allDepartments: any = [];
        data.forEach((connection) => {
          allDepartments.push(connection.department);
        });

        setAllDepartments(allDepartments);
      }
    }
  }

  // Functions
  function generateInviteCode(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let inviteCode = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      inviteCode += characters.charAt(randomIndex);
    }

    return inviteCode;
  }

  async function onNameInput(e: any) {
    // This function will trigger for all characters in the name state as they are typed into the name input field. This will be used to check for duplicates
    // as the users write
    setName(e.target.value);

    const { data, error } = await supabase
      .from("stations")
      .select()
      .ilike("name", e.target.value);

    if (data) {
      if (data.length > 0) {
        setNameError(true);
        setNameErrorText("This name allready exists..");
        setDisableNext(true);
      } else if (nameError) {
        setNameError(false);
        setDisableNext(false);
      }
    }
  }

  async function validatePageOne() {
    let hasErrors = false;

    if (name.length < 3) {
      setNameError(true);
      setNameErrorText("The name must be at least 3 characters long");
      hasErrors = true;
    } else {
      setNameError(false);
    }

    if (code.length === 0) {
      setCodeError(true);
      setCodeErrorText("The code must not be empty");
      hasErrors = true;
    } else {
      setCodeError(false);
    }

    if (!address) {
      setAddressError(true);
      setAddressErrorText(
        "Failed to get the address, please check the address field"
      );

      if (!address) {
        console.log("missing address");
      }

      hasErrors = true;
    } else {
      setAddressError(false);
      setAddressErrorText("");
    }

    if (!hasErrors) {
      const { data, error } = await supabase
        .from("stations")
        .insert({
          name: name,
          address: address,
          zip: zip ? zip : null,
          latitude: lat ? lat : null,
          longitude: lng ? lng : null,
          code_prefix: activeDepartment.code_prefix,
          code_full: activeDepartment.code_prefix + code,
          code: code,
          created_by: session.user.id,
          invite_code: generateInviteCode(6),
          department: activeDepartment.id,
        })
        .select();

      if (error) {
        alert("Something went wrong. Error: " + error.message);
        console.log(error);
      } else {
        const { data: dataConnection, error: errorConnection } = await supabase
          .from("user_connection_station")
          .insert({
            station: data[0].id,
            user: session.user.id,
          });

        if (errorConnection) {
          alert("Something went wrong. Error: " + errorConnection.message);
          console.log(error);
        } else {
          window.location.reload();
        }
      }
    }
  }

  const handleAddressSelect = (
    lat: any,
    lng: any,
    formattedAddress: string,
    zip: any
  ) => {
    setLat(lat);
    setLng(lng);
    setAddress(formattedAddress);
    setZip(zip);
  };

  const handleDepartmentSelect = (id: any) => {
    allDepartments.forEach((department: any) => {
      if (department.id.toString() === id) {
        setActiveDepartment(department);
      }
    });
  };

  // Use effects
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const data = await fetchDeparments();
    };

    fetchDepartmentsData();
  }, [session]);

  return (
    <div className="flex justify-center h-screen">
      <BasicCard title="Create new" className="w-full md:w-1/2">
        <div className="flex flex-col">
          <div>
            <div className="">
              <label className="block text-primary">Department</label>
              <select
                onChange={(e) => handleDepartmentSelect(e.target.value)}
                className="w-full px-1 py-1 rounded-[20px] border mb-2"
                defaultValue={activeDepartment}
              >
                {allDepartments?.map((department: any) => {
                  return (
                    <option value={department.id} key={department.id}>
                      {department.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="">
              <label className="block text-primary">Name</label>
              <input
                className="rounded-[20px] text-dark border px-2 w-full"
                onChange={(e) => onNameInput(e)}
                defaultValue={name && name}
              />
              {nameError ? (
                <div className="text-xs text-danger">{nameErrorText}</div>
              ) : null}
            </div>
            <div className="mt-2">
              <label className="block text-primary">Address:</label>
              <div className="flex flex-col grow w-full">
                <AutocompleteAddress onAddressSelect={handleAddressSelect} />
                {addressError ? (
                  <div className="text-xs text-danger">{addressErrorText}</div>
                ) : null}
              </div>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-3">
                <div>
                  <label className="block text-primary">Code prefix</label>
                  <div>
                    {activeDepartment?.code_prefix
                      ? activeDepartment.code_prefix
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="ml-2 flex items-center">Code</div>
                  <input
                    className="rounded-[20px] text-dark border px-2 w-1/2"
                    onChange={(e) => setCode(e.target.value)}
                    defaultValue={code && code}
                    placeholder="EX: 7"
                  />
                  {codeError ? (
                    <div className="text-xs text-danger">{codeErrorText}</div>
                  ) : null}
                </div>
                <div>
                  <label className="block text-primary">Code full</label>
                  <div>{activeDepartment?.code_prefix + code}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <BasicButton
                state={"success"}
                className="text-sm mt-2"
                onClick={() => validatePageOne()}
                disabled={disableNext}
              >
                Validate and Save
              </BasicButton>
            </div>
          </div>
        </div>
      </BasicCard>
    </div>
  );
}

function JoinExisting() {
  const { session } = useSession();
  const [code, setCode] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  async function handleJoinExisting() {
    if (code.length > 0) {
      // Get the station
      const { data: dataStation, error: errorStation } = await supabase
        .from("stations")
        .select()
        .eq("invite_code", code);

      if (errorStation) {
        setShowMessage(true);
        setMessage(
          "An error occured while trying to get the station: " +
            errorStation.message
        );
      } else {
        if (dataStation.length > 0) {
          // Check if the user is allready a part of that station
          const { data: dataStationConnection, error: errorStationConnection } =
            await supabase
              .from("user_connection_station")
              .select()
              .eq("station", dataStation[0].id)
              .eq("user", session.user.id);

          if (errorStationConnection) {
            setShowMessage(true);
            setMessage(
              "An error occured while trying to get the station: " +
                errorStationConnection.message
            );
          } else {
            console.log(dataStationConnection);
            if (dataStationConnection.length > 0) {
              setShowMessage(true);
              setMessage("You are allready a part of this station");
            } else {
              const {
                data: dataConnectionStationNew,
                error: errorStationConnectionNew,
              } = await supabase.from("user_connection_station").insert({
                station: dataStation[0].id,
                user: session.user.id,
                user_name: session.user.user_metadata.name,
                role_level: 1,
              });

              if (errorStationConnectionNew) {
                setShowMessage(true);
                setMessage(
                  "An error occured while trying to get the station: " +
                    errorStationConnectionNew.message
                );
              } else {
                window.location.reload();
              }
            }
          }
        } else {
          setShowMessage(true);
          setMessage("Did not find any station with that code");
        }
      }
    } else {
      setShowMessage(true);
      setMessage("You need to input at least one char");
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-4 w-full">
        <input
          className="border rounded-[15px] w-full px-2"
          placeholder="Invite code"
          onChange={(e) => setCode(e.target.value)}
        />
        <BasicButton state={"success"} onClick={() => handleJoinExisting()}>
          Join
        </BasicButton>
      </div>
      <div className="text-xs">{showMessage && message}</div>
    </div>
  );
}
