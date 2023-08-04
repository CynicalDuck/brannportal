"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../../app/supabase";

// Import icons
import {
  Home,
  PlusCircle,
  BarChart,
  Settings as SettingsIcon,
  GitMerge,
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
import Progress from "@/components/Loaders/Progress";
import AutocompleteAddress from "@/components/Maps/Autocomplete";

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
  const [activeStation, setActiveStation] = useState<any>(null);
  const [allStations, setAllStations] = useState<any>();
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [stationUsersCount, setStationUsersCount] = useState<number>();

  // Fetching
  async function fetchStations() {
    if (session) {
      const { data, error } = await supabase
        .from("user_connection_station")
        .select(
          `*,
          station (*)
    `
        )
        .eq("user", session?.user.id);

      if (error) {
        alert(
          "There was an error when fetching your stations: " + error.message
        );
      } else {
        setActiveStation(data[0]?.station || null);

        // Create a list of all departments
        let allStations: any = [];
        data.forEach((connection) => {
          allStations.push(connection.station);
        });

        setAllStations(allStations);
      }
    }
  }

  // Functions
  const handleStationSelect = (station: any) => {
    setActiveStation(station);
    setIsStationDropdownOpen(false);
  };

  // Use effects
  useEffect(() => {
    const fetchStationsData = async () => {
      const data = await fetchStations();
    };

    fetchStationsData();
  }, [session]);

  useEffect(() => {
    // Fetch the user count when the active station changes
    async function fetchUserCount() {
      if (activeStation) {
        const { count, error } = await supabase
          .from("user_connection_station")
          .select("count", { count: "exact" })
          .eq("station", activeStation.id);

        if (error) {
          alert(
            "There was an error when fetching the user count: " + error.message
          );
        } else {
          setStationUsersCount(count ? count : 0);
        }
      }
    }

    fetchUserCount();
  }, [activeStation]);

  // Variables

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
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:gap-5 gap-2">
        <div className="text-primary text-4xl hidden lg:block">Station</div>
        <div className="flex flex-col gap-1">
          <div
            className="bg-accent7 rounded-full py-2 px-2 text-primary hover:cursor-pointer"
            onClick={() => setIsStationDropdownOpen(!isStationDropdownOpen)}
          >
            <div className="flex flex-row gap-2">
              <Navigation />
              <div>
                {activeStation
                  ? activeStation.code_full + " - " + activeStation.name
                  : "-"}
              </div>
            </div>
          </div>
          {isStationDropdownOpen && (
            <div className="mt-2 bg-white rounded-lg shadow-md px-2 py-2">
              {allStations.map((station: any) => (
                <div
                  key={station.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleStationSelect(station)}
                >
                  {station.code_full + " - " + station.name}
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
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="station" disabled>
                  Station
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
        <BasicButton
          state="default"
          className={
            active === "Callouts" ? "bg-dark brightness-150" : "bg-dark"
          }
          onClick={() => setActive("Callouts")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <BarChart size={14} />
              <div className="hidden md:block">Callouts</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={
            active === "Vehicles" ? "bg-dark brightness-150" : "bg-dark"
          }
          onClick={() => setActive("Vehicles")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <Truck size={14} />
              <div className="hidden md:block">Vehicles</div>
            </div>
          </div>
        </BasicButton>
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
      {active == "Callouts" && <Callouts />}
      {active == "Dashboard" && (
        <Dashboard station={activeStation} stationUsers={stationUsersCount} />
      )}
      {active == "Stations" && <Stations />}
      {active == "Vehicles" && <Vehicles />}
      {active == "Create" && <CreateNew />}
      {active == "Settings" && <Settings />}
    </div>
  );
}

function Dashboard(data: any) {
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
            className={"rounded-[20px] bg-primary w-full"}
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
            className={"rounded-[20px] bg-primary w-full"}
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">
                  {data?.stationUsers ? data.stationUsers : null}
                </div>
                <div className="ml-5">Registered users</div>
              </div>
            </div>
          </FeaturedCard>
          <FeaturedCard
            title="Stations"
            icon={<Navigation />}
            className={"rounded-[20px] bg-primary w-full"}
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
            className={"rounded-[20px] bg-primary w-full"}
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
                <Pie data={dataPie} title="Test" />
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

function Callouts() {
  return (
    <div className="w-full flex justify-center justify-items-center">
      <TableCallout title={"Department callouts"} />
    </div>
  );
}

function Stations() {
  return (
    <div className="w-full flex justify-center justify-items-center">
      <TableStation />
    </div>
  );
}

function Vehicles() {
  return (
    <div className="w-full flex justify-center justify-items-center">
      <TableVehicle />
    </div>
  );
}

function Settings() {
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
      .from("departments")
      .select()
      .ilike("name", "%" + e.target.value + "%");

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
