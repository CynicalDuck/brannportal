"use client";

// Import required
import React, { useState } from "react";

// Import icons
import { Camera } from "react-feather";

// Import components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import hooks

// Types
interface Props {
  children?: React.ReactNode;
}

export default function TableVehicle({ children, ...props }: Props) {
  // States

  // Fetching

  // Functions

  // Variables - Mock data
  const vehicles = [
    {
      code: "T1-1",
      type: "Mannskapsbil",
      station: "Lørenskog",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T1-2",
      type: "Mannskapsbil reserve",
      station: "Lørenskog",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T1-3-1",
      type: "Stigebil",
      station: "Lørenskog",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T1-3-2",
      type: "Lift",
      station: "Lørenskog",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T1-4",
      type: "Tankbil",
      station: "Lørenskog",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T7-1",
      type: "Mannskapsbil",
      station: "Løken",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T7-4",
      type: "Tankbil",
      station: "Løken",
      callouts: "354",
      minutes: "32134",
    },
    {
      code: "T7-6",
      type: "Fremskutt enhet",
      station: "Løken",
      callouts: "354",
      minutes: "32134",
    },
  ];

  // Return
  return (
    <Table className="bg-accent7 py-2 px-2 rounded-[20px] mt-5 w-full">
      <TableCaption>Department vehicles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Code</TableHead>
          <TableHead className="w-[300px]">Type</TableHead>
          <TableHead className="w-[700px]">Station</TableHead>
          <TableHead className="w-[200px]">Callouts</TableHead>
          <TableHead className="w-[100px]">Run-time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.code} className="hover:bg-light">
            <TableCell className="font-medium ">
              <div className="bg-warning px-2 rounded-[15px] text-center">
                {vehicle.code}
              </div>
            </TableCell>
            <TableCell>{vehicle.type}</TableCell>
            <TableCell>{vehicle.station}</TableCell>
            <TableCell>{vehicle.callouts}</TableCell>
            <TableCell>{vehicle.minutes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
