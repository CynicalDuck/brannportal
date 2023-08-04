"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../../app/supabase";

// Import icons
import { Plus } from "react-feather";

// Import components
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
import AutocompleteAddress from "@/components/Maps/Autocomplete";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";
import { useFetchUserCallouts } from "@/hooks/fetch/useFetchUserCallouts";

export default function Callouts() {
  // States
  const [createNew, setCreateNew] = useState(false);

  // Auth
  const { session } = useSession();

  // Fetch
  const { data: dataCallouts, error: errorCallouts } = useFetchUserCallouts();

  // Functions

  // Return
  return (
    <div className="flex flex-col gap-2 h-screen md:h-full lg:h-full">
      <div className="text-primary text-4xl hidden lg:block">Callouts</div>
      <div className="flex flex-row gap-2 hover:cursor-pointer">
        <div
          className="bg-white flex flex-row px-2 rounded-[20px]"
          onClick={() => setCreateNew(!createNew)}
        >
          {!createNew && <Plus />}
          <div className="hidden lg:block">
            {!createNew ? "Create new" : "Cancel"}
          </div>
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
                <SelectItem value="authentication/logout">Sign out</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Use flex-grow to let TableCallout take up remaining space */}
      <div className="flex-grow w-full">
        {!createNew && <TableCallout data={dataCallouts?.data} address />}
        {createNew && <CreateNew />}
      </div>
    </div>
  );
}

function CreateNew() {
  // States for form inputs and validation
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [lat, setLat] = useState<any>(null);
  const [lng, setLng] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [zip, setZip] = useState<any>(null);
  const [exposedToSmoke, setExposedToSmoke] = useState(false);
  const [exposedToSmokeTime, setExposedToSmokeTime] = useState("");
  const [calloutId, setCalloutId] = useState("");
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
      const { data, error } = await supabase
        .from("callouts")
        .insert({
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
        .select();

      if (error) {
        alert("Something went wrong. Error: " + error.message);
        console.log(error);
      } else {
        const { data: dataConnection, error: errorConnection } = await supabase
          .from("user_connection_callout")
          .insert({
            callout: data[0].id,
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
