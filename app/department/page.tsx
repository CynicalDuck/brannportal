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
  Truck,
  Trash,
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
import { useToast } from "@/components/ui/use-toast";

// Types

export default function Department() {
  // Auth
  const { session } = useSession();

  // States
  const [active, setActive] = useState("Dashboard");
  const [activeDepartment, setActiveDepartment] = useState<any>();
  const [allDepartments, setAllDepartments] = useState<any>();
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [departmentUsersCount, setDepartmentUsersCount] = useState<number>();
  const [departmentTypes, setDepartmentTypes] = useState<any>();

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
  const handleDepartmentSelect = (department: any) => {
    setActiveDepartment(department);
    setIsDepartmentDropdownOpen(false);
  };

  // Variables

  // Use effects
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const data = await fetchDeparments();
    };

    fetchDepartmentsData();
  }, [session]);

  useEffect(() => {
    // Fetch the user count when the active department changes
    async function fetchUserCount() {
      if (activeDepartment) {
        const { count, error } = await supabase
          .from("user_connection_department")
          .select("count", { count: "exact" })
          .eq("department", activeDepartment.id);

        if (error) {
          alert(
            "There was an error when fetching the user count: " + error.message
          );
        } else {
          setDepartmentUsersCount(count ? count : 0);
        }
      }
    }

    // Fetch the callout types when the active department changes
    async function fetchDepartmentCalloutTypes() {
      if (activeDepartment) {
        const { data, error } = await supabase
          .from("callout_types")
          .select()
          .eq("department", activeDepartment.id);

        if (error) {
          alert(
            "There was an error when fetching the user count: " + error.message
          );
        } else {
          setDepartmentTypes(data);
        }
      }
    }

    fetchUserCount();
    fetchDepartmentCalloutTypes();
  }, [activeDepartment]);

  // Return

  if (!session) {
    return <Progress />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
        <div className="text-primary text-4xl hidden lg:block">
          {activeDepartment ? activeDepartment.name : "Fire department"}
        </div>
        <div className="flex flex-col gap-1">
          <div
            className="bg-accent7 rounded-full py-2 px-2 text-primary hover:cursor-pointer"
            onClick={() =>
              setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)
            }
          >
            <div className="flex flex-row gap-2">
              <Box />
              <div>
                {activeDepartment ? activeDepartment.abbreviation : "-"}
              </div>
            </div>
          </div>
          {isDepartmentDropdownOpen && (
            <div className="mt-2 bg-white rounded-lg shadow-md px-2 py-2">
              {allDepartments.map((department: any) => (
                <div
                  key={department.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleDepartmentSelect(department)}
                >
                  {department.name}
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
                <SelectItem value="department" disabled>
                  Department
                </SelectItem>
                <SelectItem value="station">Station</SelectItem>
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
          className={active === "Dashboard" ? "bg-indigo-600" : "bg-indigo-400"}
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
          className={active === "Callouts" ? "bg-indigo-600" : "bg-indigo-400"}
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
          className={active === "Stations" ? "bg-indigo-600" : "bg-indigo-400"}
          onClick={() => setActive("Stations")}
        >
          <div className="">
            <div className="flex flex-row gap-2">
              <Navigation size={14} />
              <div className="hidden md:block">Stations</div>
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
              <Truck size={14} />
              <div className="hidden md:block">Vehicles</div>
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
              <SettingsIcon size={14} />
              <div className="hidden md:block">Settings</div>
            </div>
          </div>
        </BasicButton>
        <BasicButton
          state="default"
          className={active === "Create" ? "bg-indigo-600" : "bg-indigo-400"}
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
          className={active === "Join" ? "bg-indigo-600" : "bg-indigo-400"}
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
        <Dashboard
          department={activeDepartment}
          departmentUsers={departmentUsersCount}
        />
      )}
      {active == "Stations" && <Stations />}
      {active == "Vehicles" && <Vehicles />}
      {active == "Settings" && (
        <Settings
          department={activeDepartment}
          departmentTypes={departmentTypes}
        />
      )}
      {active == "Create" && <CreateNew />}
    </div>
  );
}

function Dashboard(department: any) {
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
              "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
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
              "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
            }
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">
                  {department.departmentUsers ? department.departmentUsers : 0}
                </div>
                <div className="ml-5">Registered users</div>
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
              "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
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

function Settings(data: any) {
  // States
  const [newCalloutTypeName, setNewCalloutTypeName] = useState("");
  const [calloutTypes, setCalloutTypes] = useState(data.departmentTypes);

  // Function to handle adding a new callout type
  async function handleAddNewCalloutType() {
    if (newCalloutTypeName.length > 1) {
      const { data: newType, error } = await supabase
        .from("callout_types")
        .insert({
          department: data?.department?.id,
          value: newCalloutTypeName,
        })
        .select();

      if (error) {
        alert(
          "Something went wrong when adding the type to the database: " +
            error.message
        );
      } else {
        // Check if calloutTypes is not null before updating
        if (calloutTypes) {
          // Update the calloutTypes state with the new callout type
          setCalloutTypes([...calloutTypes, newType[0]]);
        } else {
          // If calloutTypes is null, set the new callout type as the initial value
          setCalloutTypes([newType]);
        }

        // Clear the input field after successful addition
        setNewCalloutTypeName("");
      }
    } else {
      alert("The callout type needs at least 1 char");
    }
  }

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
        <div className="grid grid-cols-2">
          <div className="">Callout types:</div>
          <div className="flex flex-col">
            <div className="text-sm">
              {calloutTypes.map((type: any) => (
                <div
                  key={type.id}
                  className="px-2 py-1 flex flex-row items-center gap-2"
                >
                  <div>{type.value}</div>
                  <div className="ml-auto">
                    <Trash size={10} className="hover:cursor-pointer" />
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">
                  <input
                    type="text"
                    placeholder="Add new type"
                    className="rounded-[10px] border-accent3 text-dark w-full px-2 py-2 bg-white"
                    onChange={(e) => setNewCalloutTypeName(e.target.value)}
                    value={newCalloutTypeName} // Bind the input value to state
                  />
                  <div
                    className="py-2 px-2 bg-white rounded-[10px] hover:cursor-pointer hover:brightness-75"
                    onClick={() => handleAddNewCalloutType()}
                  >
                    Add
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  const [abbr, setAbbr] = useState("");
  const [abbrError, setAbbrError] = useState(false);
  const [abbrErrorText, setAbbrErrorText] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorText, setAddressErrorText] = useState("");
  const [prefix, setPrefix] = useState("");
  const [prefixError, setPrefixError] = useState(false);
  const [prefixErrorText, setPrefixErrorText] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeErrorText, setCodeErrorText] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [lat, setLat] = useState<any>(null);
  const [lng, setLng] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [zip, setZip] = useState<any>(null);

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

    if (abbr.length < 3) {
      setAbbrError(true);
      setAbbrErrorText("The abbreviation must be at least 3 characters long");
      hasErrors = true;
    } else {
      setAbbrError(false);
    }

    if (prefix.length === 0) {
      setPrefixError(true);
      setPrefixErrorText("The code short name must not be empty");
      hasErrors = true;
    } else {
      setPrefixError(false);
    }

    if (code.length === 0) {
      setCodeError(true);
      setCodeErrorText("The code must not be empty");
      hasErrors = true;
    } else {
      setCodeError(false);
    }

    if (lat === 0 || lng === 0 || !address) {
      setAddressError(true);
      setAddressErrorText(
        "Failed to get the address, please check the address field"
      );

      if (lat === 0) {
        console.log("missing lat");
      }
      if (lng === 0) {
        console.log("missing lng");
      }
      if (!address) {
        console.log("missing address");
        console.log(address);
      }

      hasErrors = true;
    } else {
      setAddressError(false);
      setAddressErrorText("");
    }

    if (!hasErrors) {
      const { data, error } = await supabase
        .from("departments")
        .insert({
          name: name,
          abbreviation: abbr,
          address: address,
          zip: zip ? zip : null,
          latitude: lat,
          longitude: lng,
          code_prefix: prefix,
          code_full: code,
          code: code,
          created_by: session.user.id,
          invite_code: generateInviteCode(6),
        })
        .select();

      if (error) {
        alert("Something went wrong. Error: " + error.message);
        console.log(error);
      } else {
        const { data: dataConnection, error: errorConnection } = await supabase
          .from("user_connection_department")
          .insert({
            department: data[0].id,
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

  return (
    <div className="flex justify-center h-screen">
      <BasicCard title="Create new" className="w-full md:w-1/2">
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex flex-row gap-2">
              <div className="flex items-center">Name:</div>
              <div className="flex flex-col gap-0 flex-grow">
                <input
                  className="rounded-[20px] text-dark border px-2 w-full"
                  onChange={(e) => onNameInput(e)}
                  defaultValue={name && name}
                />
                {nameError ? (
                  <div className="text-xs text-danger">{nameErrorText}</div>
                ) : null}
              </div>
              <div className="ml-2 flex items-center">Abbreviation:</div>
              <div className="flex flex-col gap-0 flex-grow">
                <input
                  className="rounded-[20px] text-dark border px-2 w-full"
                  onChange={(e) => setAbbr(e.target.value)}
                  defaultValue={abbr && abbr}
                />
                {abbrError ? (
                  <div className="text-xs text-danger">{abbrErrorText}</div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-row gap-2 mt-2">
              <div className="flex items-center">Code short name:</div>
              <div className="flex flex-col gap-0 flex-grow">
                <input
                  className="rounded-[20px] text-dark border px-2 w-full"
                  onChange={(e) => setPrefix(e.target.value)}
                  defaultValue={prefix && prefix}
                  placeholder="EX: T (T for tango)"
                />
                {prefixError ? (
                  <div className="text-xs text-danger">{prefixErrorText}</div>
                ) : null}
              </div>
              <div className="ml-2 flex items-center">Code full:</div>
              <div className="flex flex-col gap-0 flex-grow">
                <input
                  className="rounded-[20px] text-dark border px-2 w-full"
                  onChange={(e) => setCode(e.target.value)}
                  defaultValue={code && code}
                  placeholder="EX: Tango"
                />
                {codeError ? (
                  <div className="text-xs text-danger">{codeErrorText}</div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-0 flex-grow">
              <div className="flex flex-row gap-2 mt-2">
                <div className="flex items-center">Address:</div>
                <div className="flex flex-col grow w-full">
                  <AutocompleteAddress onAddressSelect={handleAddressSelect} />
                  {addressError ? (
                    <div className="text-xs text-danger">
                      {addressErrorText}
                    </div>
                  ) : null}
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
