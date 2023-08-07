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
import MapCallouts from "@/components/Maps/MapCallouts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { useFetchDepartmentCallouts } from "@/hooks/fetch/useFetchDepartmentCallouts";

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
  const [departmentUsers, setDepartmentUsers] = useState<any>();
  const [departmentCallouts, setDepartmentCallouts] = useState<any>();
  const [departmentTypes, setDepartmentTypes] = useState<any>();
  const [departmentTypeGroups, setDepartmentTypeGroups] = useState<any>();
  const [departmentStationCount, setDepartmentStationCount] =
    useState<number>();

  // Fetching

  async function fetchDeparments() {
    if (session) {
      const { data, error } = await supabase
        .from("user_connection_department")
        .select(`*, department(*, created_by)`)
        .eq("user", session?.user.id);

      if (error) {
        alert(
          "There was an error when fetching your departments: " + error.message
        );
      } else {
        setActiveDepartment(data[0]?.department || null);

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

  // Function to check if two timestamps are within 5 minutes of each other
  function areTimestampsWithin5Minutes(timestamp1: any, timestamp2: any) {
    const diff = Math.abs(timestamp1 - timestamp2);
    const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds
    return diff <= fiveMinutesInMilliseconds;
  }

  // Variables

  // Use effects
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const data = await fetchDeparments();
    };

    fetchDepartmentsData();
  }, [session]);

  useEffect(() => {
    // Fetch the users when the active department changes
    async function fetchUsers() {
      if (activeDepartment) {
        const { data, error } = await supabase
          .from("user_connection_department")
          .select("*")
          .eq("department", activeDepartment.id);

        if (error) {
          alert("There was an error when fetching the users: " + error.message);
        } else {
          setDepartmentUsers(data);
        }
      }
    }

    // Fetch station count
    async function fetchStationCount() {
      if (activeDepartment) {
        const { count, error } = await supabase
          .from("stations")
          .select("count", { count: "exact" })
          .eq("department", activeDepartment.id);

        if (error) {
          alert(
            "There was an error when fetching the user count: " + error.message
          );
        } else {
          setDepartmentStationCount(count ? count : 0);
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

    // Fetch the callout type groups when the active department changes
    async function fetchDepartmentCalloutTypeGroups() {
      if (activeDepartment) {
        const { data, error } = await supabase
          .from("callout_type_groups")
          .select()
          .eq("department", activeDepartment.id);

        if (error) {
          alert(
            "There was an error when fetching the user count: " + error.message
          );
        } else {
          setDepartmentTypeGroups(data);
        }
      }
    }

    // Fetch department callouts
    async function fetchDepartmentCallouts(id: number) {
      // Fetch all callouts for the department
      const { data, error } = await supabase
        .from("callouts")
        .select(`*, station (*)`)
        .eq("department", id)
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
                  callout.station.id === uniqueCallout.station.id
              )) ||
            uniqueCallouts.some(
              (uniqueCallout: any) =>
                callout.station.id === uniqueCallout.station.id &&
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

        setDepartmentCallouts(returnData);
      }
      if (error) {
        console.log("Error fetching department callouts: " + error.message);
      }
    }

    fetchUsers();
    fetchStationCount();
    activeDepartment ? fetchDepartmentCallouts(activeDepartment.id) : null;
    fetchDepartmentCalloutTypes();
    fetchDepartmentCalloutTypeGroups();
  }, [activeDepartment]);

  // Return

  if (!session) {
    return <Progress />;
  }

  if (!activeDepartment) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          You have no departments connected to your user, you can do the
          following actions:
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
        {departmentUsers?.some(
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
          department={activeDepartment}
          departmentUsers={departmentUsers}
          departmentStations={departmentStationCount}
          departmentCallouts={departmentCallouts}
          departmentTypes={departmentTypes}
          departmentTypeGroups={departmentTypeGroups}
        />
      )}
      {active == "Settings" && (
        <Settings
          department={activeDepartment}
          departmentTypes={departmentTypes}
          departmentTypeGroups={departmentTypeGroups}
          departmentUsers={departmentUsers}
        />
      )}
      {active == "Create" && <CreateNew />}
      {active == "Join" && <JoinExisting />}
    </div>
  );
}

function Dashboard(department: any) {
  // Variables
  const colorPalette = ["#293241", "#3D5A80", "#688AB6", "#98C1D9"];
  // Get all types for the dataPie
  var dataPieArray: any = [];

  department.departmentTypeGroups?.forEach((group: any, index: number) => {
    var countCallouts = 0;

    department.departmentCallouts?.data?.forEach((callout: any) => {
      department.departmentTypes?.forEach((type: any) => {
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
        data: department?.departmentCallouts?.calloutsPerMonth?.map(
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

  return (
    <div className="flex flex-col gap-2 lg:gap-12 lg:flex-row w-full">
      <div className="flex flex-col 2xl:w-1/2">
        <div className="grid grid-cols-1 xl:grid-rows-2 xl:gap-10 gap-2 md:grid-cols-2 mt-2 xl:mt-5">
          <FeaturedCard
            title="Stations"
            icon={<Navigation />}
            className={"rounded-[20px] bg-primary w-full"}
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">
                  {department.departmentStations
                    ? department.departmentStations
                    : 0}
                </div>
                <div className="ml-5">Registered stations</div>
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
                  {department.departmentUsers
                    ? department.departmentUsers.length
                    : 0}
                </div>
                <div className="ml-5">Registered users</div>
              </div>
            </div>
          </FeaturedCard>
          <FeaturedCard
            title="Callouts"
            icon={<BarChart />}
            className={
              "rounded-[20px] bg-primary w-full col-span-1 md:col-span-2"
            }
          >
            <div className="flex flex-col px-6 w-full">
              <div className="flex flex-row">
                <div className="text-5xl">
                  {department.departmentCallouts?.data.length}
                </div>
                <div className="ml-5">All time</div>
              </div>
              <div className="flex justify-evenly py-4">
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">
                    {department.departmentCallouts?.countToday}
                  </div>
                  <div className="text-sm">Today</div>
                </div>
                <div className="border-r border-dotted" />
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">
                    {department.departmentCallouts?.countThisMonth}
                  </div>
                  <div className="text-sm">This month</div>
                </div>
                <div className="border-r border-dotted" />
                <div className="text-center mx-4">
                  <div className="text-xl font-bold">
                    {department.departmentCallouts?.countThisYear}
                  </div>
                  <div className="text-sm">This year</div>
                </div>
              </div>
            </div>
          </FeaturedCard>
        </div>
        {/* <div className="mt-10">
          {department.departmentCallouts?.data && (
            <TableCallout
            title={"Recent callouts"}
            data={department.departmentCallouts.data}
            />
          )}
        </div> */}
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
                <div className="h-[300px] md:h-[600px] xl:h-[600px]">
                  <MapCallouts
                    center={
                      department.department ? department.department : null
                    }
                    heatmap={true}
                    heatmapLocations={department?.departmentCallouts?.data}
                  />
                </div>
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
  const [newCalloutTypeName, setNewCalloutTypeName] = useState("");
  const [newCalloutGroupName, setNewCalloutGroupName] = useState("");
  const [calloutTypes, setCalloutTypes] = useState(data.departmentTypes);
  const [calloutGroups, setCalloutGroups] = useState(data.departmentTypeGroups);
  const [showMessageName, setShowMessageName] = useState(false);
  const [messageName, setMessageName] = useState("");
  const [showMessageAbbr, setShowMessageAbbr] = useState(false);
  const [messageAbbr, setMessageAbbr] = useState("");

  // Function to change the name of the department
  async function handleNameChange(value: string) {
    if (value.length > 0) {
      const { data: dataCheckName, error: errorCheckName } = await supabase
        .from("departments")
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
            .from("departments")
            .update({
              name: value,
            })
            .eq("id", data.department.id);

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

  // Function to change the abbreviation of the department
  async function handleAbbrChange(value: string) {
    if (value.length > 0) {
      const { data: dataCheckAbbr, error: errorCheckAbbr } = await supabase
        .from("departments")
        .select()
        .ilike("abbreviation", value);

      if (errorCheckAbbr) {
        setShowMessageAbbr(true);
        setMessageAbbr(
          "An error occurred while checking the abbreviation: " +
            errorCheckAbbr.message
        );
      } else {
        if (dataCheckAbbr && dataCheckAbbr.length !== 0) {
          setShowMessageAbbr(true);
          setMessageAbbr("This abbreviation already exists...");
        } else {
          const { data: dataNewAbbr, error } = await supabase
            .from("departments")
            .update({
              abbreviation: value,
            })
            .eq("id", data.department.id);

          if (error) {
            setShowMessageAbbr(true);
            setMessageAbbr("An error occurred: " + error.message);
          } else {
            setShowMessageAbbr(true);
            setMessageAbbr(
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

  // Create new callout group
  async function handleAddNewCalloutGroup() {
    if (newCalloutGroupName.length > 1) {
      const { data: newGroup, error } = await supabase
        .from("callout_type_groups")
        .insert({
          department: data?.department?.id,
          value: newCalloutGroupName,
        })
        .select();

      if (error) {
        alert(
          "Something went wrong when adding the group to the database: " +
            error.message
        );
      } else {
        // Check if calloutGroup is not null before updating
        if (calloutGroups) {
          // Update the calloutTypes state with the new callout type
          setCalloutGroups([...calloutGroups, newGroup[0]]);
        } else {
          // If calloutTypes is null, set the new callout type as the initial value
          setCalloutGroups([newGroup]);
        }

        // Clear the input field after successful addition
        setNewCalloutGroupName("");
      }
    } else {
      alert("The callout group needs at least 1 char");
    }
  }

  // Handle type name change
  async function handleTypeNameChange(value: string, type: any) {
    const { data, error } = await supabase
      .from("callout_types")
      .update({
        value: value,
      })
      .eq("id", type.id);

    if (error) {
      console.error("Error updating type name:", error.message);
    } else {
      // Create a new array by mapping over calloutTypes
      const updatedCalloutTypes = calloutTypes.map((t: any) => {
        // If the type ID matches the updated type ID, return the modified type
        if (t.id === type.id) {
          return { ...t, value: value };
        }
        // Otherwise, return the original type
        return t;
      });

      // Update the calloutTypes state with the modified array
      setCalloutTypes(updatedCalloutTypes);
    }
  }

  // Handle type group change
  async function handleTypeGroupChange(value: any, type: any) {
    if (value !== 0) {
      const { data, error } = await supabase
        .from("callout_types")
        .update({
          group: value,
        })
        .eq("id", type.id);

      if (error) {
        console.error("Error updating type group:", error.message);
      } else {
        // Create a new array by mapping over calloutTypes
        const updatedCalloutTypes = calloutTypes.map((t: any) => {
          // If the type ID matches the updated type ID, return the modified type
          if (t.id === type.id) {
            return { ...t, group: value };
          }
          // Otherwise, return the original type
          return t;
        });

        // Update the calloutTypes state with the modified array
        setCalloutTypes(updatedCalloutTypes);
      }
    }
  }

  // Handle delete types
  async function handleDeleteType(type: any) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete the type "${type.value}"? This action cannot be undone.`
    );

    if (shouldDelete) {
      const { error } = await supabase
        .from("callout_types")
        .delete()
        .eq("id", type.id);

      if (error) {
        alert("Failed to delete the type: " + error.message);
      } else {
        // Remove the deleted type from the state
        setCalloutTypes(calloutTypes.filter((t: any) => t.id !== type.id));
      }
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
            defaultValue={data.department?.name ? data.department.name : "-"}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {showMessageName && <div className="text-xs">{messageName}</div>}
        </div>
        <div className="grid grid-cols-2">
          <div className="">Abbreviation:</div>
          <input
            type="text"
            className="rounded-[10px] border-accent3 text-dark w-full px-2"
            defaultValue={data.department.abbreviation}
            onChange={(e) => handleAbbrChange(e.target.value)}
          />
          {showMessageAbbr && <div className="text-xs">{messageAbbr}</div>}
        </div>
        <div className="grid grid-cols-2">
          <div className="">Invitation code:</div>
          <div className="flex flex-col">
            <div className="text-sm">{data.department?.invite_code}</div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="">Created by:</div>
          <div className="flex flex-col">
            <div className="text-sm">
              {data.departmentUsers?.length > 0 ? (
                data.departmentUsers.map((user: any) => {
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
              {data.departmentUsers?.length > 0 ? (
                data.departmentUsers.map((user: any) => {
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
                <SelectLabel>Department users</SelectLabel>
                {data.departmentUsers?.length > 0 ? (
                  data.departmentUsers.map((user: any) => {
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
        <div className="grid grid-cols-2">
          <div className="">Callout groups:</div>
          <div className="flex flex-col">
            <div className="text-sm">
              {calloutGroups?.map((group: any) => (
                <div
                  key={group.id}
                  className="px-2 py-1 flex flex-row items-center gap-2"
                >
                  <div>{group.value}</div>
                  <div className="ml-auto">
                    <Trash size={10} className="hover:cursor-pointer" />
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">
                  <input
                    type="text"
                    placeholder="Add new group"
                    className="rounded-[10px] border-accent3 text-dark w-full px-2 py-2 bg-white"
                    onChange={(e) => setNewCalloutGroupName(e.target.value)}
                    value={newCalloutGroupName} // Bind the input value to state
                  />
                  <div
                    className="py-2 px-2 bg-white rounded-[10px] hover:cursor-pointer hover:brightness-75"
                    onClick={() => handleAddNewCalloutGroup()}
                  >
                    Add
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-6">
          <div className="">Callout types:</div>
          <div className="flex flex-col">
            <div className="text-sm">
              {calloutGroups?.map((group: any) => (
                <div key={group.id} className="px-2 py-1 flex flex-col gap-1">
                  <div className="bg-white py-1 px-2 font-semibold rounded-[15px]">
                    {group.value}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div>
                      {calloutTypes.map((type: any) =>
                        type.group === group.id ? (
                          <div
                            key={type.id}
                            className="px-2 py-1 flex flex-row items-center gap-2"
                          >
                            <Popover>
                              <PopoverTrigger>
                                <div className="hover:cursor-pointer">
                                  {type.value}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent>
                                <div className="flex flex-col gap-2">
                                  <div>Name</div>
                                  <div className="flex flex-row gap-4">
                                    <input
                                      type="text"
                                      defaultValue={type.value}
                                      className="px-2 rounded-[15px] text-sm border w-full"
                                      onChange={(e) =>
                                        handleTypeNameChange(
                                          e.target.value,
                                          type
                                        )
                                      }
                                    />
                                  </div>
                                  <div>Group</div>
                                  <select
                                    defaultValue={group.id}
                                    className="border rounded-[15px] text-sm px-1"
                                    onChange={(e) =>
                                      handleTypeGroupChange(
                                        e.target.value,
                                        type
                                      )
                                    }
                                  >
                                    <option value={0}>---</option>
                                    {calloutGroups?.map((group: any) => (
                                      <option key={group.id} value={group.id}>
                                        {group.value}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="text-xs">
                                    You might need to refresh the page for
                                    changes to take affect
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <div className="ml-auto">
                              <Trash
                                size={10}
                                className="hover:cursor-pointer"
                                onClick={() => handleDeleteType(type)}
                              />
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                {calloutTypes.some((type: any) => !type.group) && (
                  <div className="px-2 py-1 flex flex-col items-left gap-2">
                    <div className="bg-white py-1 px-2 font-semibold rounded-[15px]">
                      No group
                    </div>
                    {calloutTypes.map((type: any) =>
                      !type.group ? (
                        <div
                          key={type.id}
                          className="px-2 py-1 flex flex-row gap-2"
                        >
                          <Popover>
                            <PopoverTrigger>
                              <div className="hover:cursor-pointer">
                                {type.value}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="flex flex-col gap-2">
                                <div>Name</div>
                                <div className="flex flex-row gap-4">
                                  <input
                                    type="text"
                                    defaultValue={type.value}
                                    className="px-2 rounded-[15px] text-sm border w-full"
                                    onChange={(e) =>
                                      handleTypeNameChange(e.target.value, type)
                                    }
                                  />
                                </div>
                                <div>Group</div>
                                <select
                                  className="border rounded-[15px] text-sm px-1"
                                  onChange={(e) =>
                                    handleTypeGroupChange(e.target.value, type)
                                  }
                                >
                                  <option value={0}>---</option>
                                  {calloutGroups?.map((group: any) => (
                                    <option key={group.id} value={group.id}>
                                      {group.value}
                                    </option>
                                  ))}
                                </select>
                                <div className="text-xs">
                                  You might need to refresh the page for changes
                                  to take affect
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <div className="ml-auto">
                            <Trash
                              size={10}
                              className="hover:cursor-pointer"
                              onClick={() => handleDeleteType(type)}
                            />
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
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
            user_name: session.user.user_metadata.name,
            role_level: 3,
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

function JoinExisting() {
  const { session } = useSession();
  const [code, setCode] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  async function handleJoinExisting() {
    if (code.length > 0) {
      // Get the department
      const { data: dataDepartment, error: errorDepartment } = await supabase
        .from("departments")
        .select()
        .eq("invite_code", code);

      if (errorDepartment) {
        setShowMessage(true);
        setMessage(
          "An error occured while trying to get the department: " +
            errorDepartment.message
        );
      } else {
        if (dataDepartment.length > 0) {
          // Check if the user is allready a part of that department
          const {
            data: dataDepartmentConnection,
            error: errorDepartmentConnection,
          } = await supabase
            .from("user_connection_department")
            .select()
            .eq("department", dataDepartment[0].id)
            .eq("user", session.user.id);

          if (errorDepartmentConnection) {
            setShowMessage(true);
            setMessage(
              "An error occured while trying to get the department: " +
                errorDepartmentConnection.message
            );
          } else {
            console.log(dataDepartmentConnection);
            if (dataDepartmentConnection.length > 0) {
              setShowMessage(true);
              setMessage("You are allready a part of this department");
            } else {
              const {
                data: dataConnectionDepartmentNew,
                error: errorDepartmentConnectionNew,
              } = await supabase.from("user_connection_department").insert({
                department: dataDepartment[0].id,
                user: session.user.id,
                user_name: session.user.user_metadata.name,
                role_level: 1,
              });

              if (errorDepartmentConnectionNew) {
                setShowMessage(true);
                setMessage(
                  "An error occured while trying to get the department: " +
                    errorDepartmentConnectionNew.message
                );
              } else {
                window.location.reload();
              }
            }
          }
        } else {
          setShowMessage(true);
          setMessage("Did not find any department with that code");
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
