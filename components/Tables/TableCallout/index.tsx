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
  title?: string | null;
  data?: any | null;
}

export default function TableCallout({
  children,
  title,
  data,
  ...props
}: Props) {
  // States

  // Fetching

  // Functions

  // Variables - Mock data
  const callouts = [
    {
      callout: "INV001",
      category: "Brann i Bygning",
      resources: ["T7-1", "T7-4", "T6-1", "T6-4", "T01"],
      time: "24.06.23T13:00:23",
    },
    {
      callout: "INV002",
      category: "Brann i Bygning",
      resources: ["T7-1", "T7-4", "T6-1", "T6-4", "T01"],
      time: "24.06.23T13:00:23",
    },
    {
      callout: "INV003",
      category: "Brann i Bygning",
      resources: ["T7-1", "T7-4", "T6-1", "T6-4", "T01"],
      time: "24.06.23T13:00:23",
    },
    {
      callout: "INV004",
      category: "Brann i Bygning",
      resources: ["T7-1", "T7-4", "T6-1", "T6-4", "T01"],
      time: "24.06.23T13:00:23",
    },
  ];

  // Return
  return (
    <Table className="bg-accent7 rounded-[20px] shadow-xs shadow-black">
      <TableCaption>{title}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Callout</TableHead>
          <TableHead className="w-[300px]">Category</TableHead>
          <TableHead className="w-[700px]">Resources</TableHead>
          <TableHead className="w-[300px]">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((callout: any) => (
          <TableRow
            key={callout.id}
            className="hover:bg-light hover:cursor-pointer"
          >
            <TableCell className="font-medium">{callout.id}</TableCell>
            <TableCell>{callout.type}</TableCell>
            <TableCell>
              <div className="flex flex-row gap-2">
                {callout.resources?.map((resource: any) => (
                  <div
                    key={resource}
                    className="bg-warning px-2 rounded-[15px]"
                  >
                    {resource}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>{callout.date_start}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
