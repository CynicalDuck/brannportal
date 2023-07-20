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

export default function TableStation({ children, ...props }: Props) {
  // States

  // Fetching

  // Functions

  // Variables - Mock data
  const stations = [
    {
      code: "T1",
      name: "Lørenskog",
      vehicles: ["T1-1", "T1-2", "T1-3", "T1-6", "T01"],
      callouts: "354",
      type: "Full-time",
    },
    {
      code: "T2",
      name: "Skedsmo",
      vehicles: ["T2-1", "T2-3", "T2-4"],
      callouts: "243",
      type: "Full-time",
    },
    {
      code: "T3",
      name: "Nittedal",
      vehicles: ["T3-1", "T3-4"],
      callouts: "232",
      type: "Full-time",
    },
    {
      code: "T5",
      name: "Lystad",
      vehicles: ["T5-1", "T5-4"],
      callouts: "198",
      type: "Full-time",
    },
    {
      code: "T6",
      name: "Bjørkelangen",
      vehicles: ["T6-1", "T6-4"],
      callouts: "150",
      type: "Part-time",
    },
    {
      code: "T7",
      name: "Løken",
      vehicles: ["T7-1", "T7-4", "T7-6"],
      callouts: "98",
      type: "Part-time",
    },
    {
      code: "T8",
      name: "Rømskog",
      vehicles: ["T8-6", "T8-4"],
      callouts: "45",
      type: "Part-time",
    },
  ];

  // Return
  return (
    <Table className="bg-accent7 py-2 px-2 rounded-[20px] mt-5 w-full">
      <TableCaption>Department stations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Code</TableHead>
          <TableHead className="w-[300px]">Name</TableHead>
          <TableHead className="w-[700px]">Vehicles</TableHead>
          <TableHead className="w-[200px]">callouts</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stations.map((station) => (
          <TableRow key={station.code} className="hover:bg-light">
            <TableCell className="font-medium">{station.code}</TableCell>
            <TableCell>{station.name}</TableCell>
            <TableCell>
              <div className="flex flex-row gap-2">
                {station.vehicles.map((vehicle) => (
                  <div key={vehicle} className="bg-warning px-2 rounded-[15px]">
                    {vehicle}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>{station.callouts}</TableCell>
            <TableCell>{station.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
