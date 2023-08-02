"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../../../app/supabase";

// Import icons
import {
  Navigation2,
  Calendar,
  Navigation,
  Box,
  PenTool,
  Map,
} from "react-feather";

// Import components
import FeaturedCard from "@/components/Cards/FeaturedCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AutocompleteAddress from "@/components/Maps/Autocomplete";
import MapCallouts from "@/components/Maps/MapCallouts";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";
import { useFetchUserCallouts } from "@/hooks/fetch/useFetchUserCallouts";

export default function CalloutDetails({ params }: { params: { id: string } }) {
  // States
  const [activeCallout, setActiveCallout] = useState<any>(null);
  const [connections, setConnections] = useState<any>(null);
  const [edit, setEdit] = useState(false);

  // Auth
  const { session } = useSession();

  // Fetch
  async function fetchCallout() {
    if (session) {
      // Get details
      const { data, error } = await supabase
        .from("callouts")
        .select(`*,station(*), department(*)`)
        .eq("id", params.id);

      if (error) {
        alert("There was an error when fetching the callout: " + error.message);
      } else {
        setActiveCallout(data[0] || null);
      }

      // Get all connections
      const { data: dataConn, error: errorConn } = await supabase
        .from("user_connection_callout")
        .select(`*`)
        .eq("user", session?.user.id)
        .eq("callout", params.id);

      if (errorConn) {
        alert(
          "There was an error when fetching the callout: " + errorConn.message
        );
      } else {
        setConnections(dataConn || null);
      }
    }
  }

  // Functions

  // Use Effects
  useEffect(() => {
    const fetchCalloutData = async () => {
      const data = await fetchCallout();
    };

    fetchCalloutData();
  }, [session]);

  // Return
  if (connections?.length > 0) {
    return (
      <div className="flex flex-col gap-2 h-screen md:h-full lg:h-full">
        <div className="text-primary text-4xl hidden lg:block">
          {activeCallout
            ? activeCallout.callout_id
              ? "[" + activeCallout.callout_id + "] " + activeCallout.type
              : "[" + activeCallout.id + "] " + activeCallout.type
            : "Callout details"}
        </div>
        <div className="flex flex-row gap-2 hover:cursor-pointer">
          <div
            className="bg-white flex flex-row px-2 rounded-[20px]"
            onClick={() => setEdit(!edit)}
          >
            <div className="hidden lg:block">{!edit ? "Edit" : "Cancel"}</div>
          </div>
        </div>
        <div className="lg:flex lg:justify-end lg:gap-2">
          <div className="md:hidden">
            <Select onValueChange={(e) => window.location.assign(e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Menu" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pages</SelectLabel>
                  <SelectItem value="/">Home</SelectItem>
                  <SelectItem value="callouts" disabled>
                    Callouts
                  </SelectItem>
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
        {/* Use flex-grow to let TableCallout take up remaining space */}
        <div className="flex-grow w-full">
          {!edit && activeCallout && (
            <Dashboard callout={activeCallout ? activeCallout : null} />
          )}
          {edit && <Edit callout={activeCallout ? activeCallout : null} />}
        </div>
      </div>
    );
  }
  return (
    <div>
      Checking access to this callout.. If the callout failes to load you might
      not have the access rights to it.
    </div>
  );
}

function Dashboard(data: any) {
  // States

  // Functions
  const formatDateAndTime = (dateTimeString: any) => {
    const dateTime = new Date(dateTimeString);
    const day = String(dateTime.getMonth() + 1).padStart(2, "0");
    const month = String(dateTime.getDate()).padStart(2, "0");
    const year = String(dateTime.getFullYear()).slice(2);
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    return `${month}.${day}.${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeaturedCard
          title="Date"
          icon={<Calendar />}
          className={
            "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
          }
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="">
                {formatDateAndTime(
                  data.callout.date_start + " " + data.callout.time_start
                )}
              </div>
            </div>
          </div>
        </FeaturedCard>
        <FeaturedCard
          title="Address"
          icon={<Map />}
          className={
            "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
          }
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="">{data.callout.address}</div>
            </div>
          </div>
        </FeaturedCard>
        <FeaturedCard
          title="Department"
          icon={<Box />}
          className={
            "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
          }
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="">{data.callout.department.name}</div>
            </div>
          </div>
        </FeaturedCard>
        <FeaturedCard
          title="Station"
          icon={<Navigation />}
          className={
            "rounded-[20px] bg-gradient-to-r from-gray-500 to-gray-700 w-full"
          }
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="">
                {data.callout.station.code_full +
                  " - " +
                  data.callout.station.name}
              </div>
            </div>
          </div>
        </FeaturedCard>
      </div>
      {data.callout.description ? (
        <div>
          <FeaturedCard
            title="Description"
            icon={<PenTool />}
            className={
              "rounded-[20px] bg-gradient-to-r from-slate-400 to-slate-500 w-full"
            }
          >
            <div className="flex flex-col px-6">
              <div className="flex flex-row">
                <div className="">{data.callout.description}</div>
              </div>
            </div>
          </FeaturedCard>
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 h-full">
        <div className="h-[300px] md:h-[600px] w-full">
          <MapCallouts center={data.callout ? data.callout : null} single />
        </div>
      </div>
    </div>
  );
}

function Edit(data: any) {
  // States for form inputs and validation
  const [type, setType] = useState(data.callout.type);
  const [description, setDescription] = useState(data.callout.description);
  const [dateStart, setDateStart] = useState(data.callout.date_start);
  const [timeStart, setTimeStart] = useState(data.callout.time_start);
  const [dateEnd, setDateEnd] = useState(data.callout.date_end);
  const [timeEnd, setTimeEnd] = useState(data.callout.time_end);
  const [lat, setLat] = useState<any>(data.callout.latitude);
  const [lng, setLng] = useState<any>(data.callout.longitude);
  const [address, setAddress] = useState<any>(data.callout.address);
  const [zip, setZip] = useState<any>(null);
  const [exposedToSmoke, setExposedToSmoke] = useState(
    data.callout.exposed_to_smoke
  );
  const [exposedToSmokeTime, setExposedToSmokeTime] = useState(
    data.callout.exposed_to_smoke_time
  );
  const [calloutId, setCalloutId] = useState(data.callout.callout_id);
  const [activeDepartment, setActiveDepartment] = useState<any>();
  const [allDepartments, setAllDepartments] = useState<any>();
  const [departmentTypes, setDepartmentTypes] = useState<any>();
  const [activeStation, setActiveStation] = useState<any>();
  const [allStations, setAllStations] = useState<any>();

  // Auth
  const { session } = useSession();

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
          "There was an error when fetching your departments: " + error.message
        );
      } else {
        setActiveStation(data[0].station || null);

        // Create a list of all departments
        let allStations: any = [];
        data.forEach((connection) => {
          allStations.push(connection.station);
        });

        setAllStations(allStations);
      }
    }
  }

  // Use Effect
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const data = await fetchDeparments();
    };

    const fetchStationData = async () => {
      const data = await fetchStations();
    };

    fetchDepartmentsData();
    fetchStationData();
  }, [session]);

  useEffect(() => {
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
    fetchDepartmentCalloutTypes();
  }, [activeDepartment]);

  // Validation state
  const [formErrors, setFormErrors] = useState({
    type: "",
    dateStart: "",
    timeStart: "",
    dateEnd: "",
    timeEnd: "",
    address: "",
    exposedToSmokeTime: "",
  });

  // Function to handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    // Perform validation checks
    const errors: any = {
      type: "",
      dateStart: "",
      timeStart: "",
      dateEnd: "",
      timeEnd: "",
      address: "",
      exposedToSmokeTime: "",
    };
    if (!type) {
      errors.type = "Type is required";
    }
    if (!dateStart) {
      errors.dateStart = "Date start is required";
    }
    if (!timeStart) {
      errors.timeStart = "Time start is required";
    }
    if (!dateEnd) {
      errors.dateEnd = "Date end is required";
    }
    if (!timeEnd) {
      errors.timeEnd = "Time end is required";
    }
    if (!address) {
      errors.address = "Address is required";
    }
    if (exposedToSmoke && !exposedToSmokeTime) {
      errors.exposedToSmokeTime = "Exposed to smoke time is required";
    }

    setFormErrors(errors);

    console.log(Object.keys(errors));

    // If there are no errors, submit the form
    if (Object.keys(errors).every((key) => errors[key] === "")) {
      console.log(lng);
      const { data: dataUpdate, error: errorUpdate } = await supabase
        .from("callouts")
        .update({
          type: type,
          address: address,
          zip: zip ? zip : null,
          latitude: lat ? lat : null,
          longitude: lng ? lng : null,
          description: description ? description : null,
          date_start: dateStart,
          time_start: timeStart,
          date_end: dateEnd,
          time_end: timeEnd,
          callout_id: calloutId,
          created_by: session.user.id,
          department: activeDepartment.id ? activeDepartment.id : null,
          station: activeStation.id ? activeStation.id : null,
          exposed_to_smoke: exposedToSmoke,
          exposed_to_smoke_time: exposedToSmokeTime ? exposedToSmokeTime : null,
        })
        .eq("id", data.callout.id);

      if (errorUpdate) {
        alert("Something went wrong. Error: " + errorUpdate.message);
        console.log(errorUpdate);
      } else {
        window.location.reload();
      }
    }
  }

  // Function to handle address selection
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

  // Function to handle department select
  const handleDepartmentSelect = (id: any) => {
    allDepartments.forEach((department: any) => {
      if (department.id.toString() === id) {
        setActiveDepartment(department);
      }
    });
  };

  // Function to handle station select
  const handleStationSelect = (id: any) => {
    allStations.forEach((station: any) => {
      if (station.id.toString() === id) {
        setActiveStation(station);
      }
    });
  };

  return (
    <div className="w-full flex-grow flex-col md:w-[500px] lg:w-[800px]">
      <form className="bg-white p-4 rounded-[20px]" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Department</label>
          <select
            defaultValue={activeDepartment}
            onChange={(e) => handleDepartmentSelect(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
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
        <div className="mb-4">
          <label className="block text-primary font-semibold">Station</label>
          <select
            defaultValue={activeStation}
            onChange={(e) => handleStationSelect(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          >
            {allStations?.map((station: any) => {
              if (activeDepartment?.id === station?.department) {
                return (
                  <option value={station.id} key={station.id}>
                    {station.code_full + " - " + station.name}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Callout ID</label>
          <input
            type="text"
            value={calloutId}
            onChange={(e) => setCalloutId(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          >
            <option value="">Select Type</option>
            {departmentTypes?.map((type: any) => {
              return (
                <option value={type.value} key={type.id}>
                  {type.value}
                </option>
              );
            })}
          </select>
          {formErrors.type && (
            <div className="text-danger">{formErrors.type}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Date Start</label>
          <input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {formErrors.dateStart && (
            <div className="text-danger">{formErrors.dateStart}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Time Start</label>
          <input
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {formErrors.timeStart && (
            <div className="text-danger">{formErrors.timeStart}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Date End</label>
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {formErrors.dateEnd && (
            <div className="text-danger">{formErrors.dateEnd}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Time End</label>
          <input
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {formErrors.timeEnd && (
            <div className="text-danger">{formErrors.timeEnd}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">Address</label>
          <AutocompleteAddress onAddressSelect={handleAddressSelect} />
          <div className="text-xs mt-2">
            {"Current: " + data.callout.address}
          </div>
          {formErrors.address && (
            <div className="text-danger">{formErrors.address}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-primary font-semibold">
            Exposed to Smoke
          </label>
          <input
            type="checkbox"
            checked={exposedToSmoke}
            onChange={(e) => setExposedToSmoke(e.target.checked)}
          />
          {exposedToSmoke && (
            <div>
              <label className="block text-primary font-semibold">
                Exposed to Smoke Time in minutes
              </label>
              <input
                type="text"
                value={exposedToSmokeTime}
                onChange={(e) => setExposedToSmokeTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md border"
              />
              {formErrors.exposedToSmokeTime && (
                <div className="text-danger">
                  {formErrors.exposedToSmokeTime}
                </div>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-[20px]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
