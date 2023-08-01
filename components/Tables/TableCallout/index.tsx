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
  const [itemsToShow, setItemsToShow] = useState(5);

  // Fetching

  // Functions
  const handleSeeMore = () => {
    // Set itemsToShow to a large number (e.g., data.length) to show all items
    if (itemsToShow === 5) {
      setItemsToShow(data.length);
    } else {
      setItemsToShow(5);
    }
  };

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
    <div className="flex flex-col gap-0">
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
          {data?.slice(0, itemsToShow).map((callout: any) => (
            <TableRow
              key={callout.callout.id}
              className="hover:bg-light hover:cursor-pointer"
            >
              <TableCell className="font-medium">
                {callout.callout.callout_id
                  ? callout.callout.callout_id
                  : callout.callout.id}
              </TableCell>
              <TableCell>{callout.callout.type}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  {callout.callout.resources?.map((resource: any) => (
                    <div
                      key={resource}
                      className="bg-warning px-2 rounded-[15px]"
                    >
                      {resource}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>{callout.callout.date_start}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {itemsToShow < data?.length ? (
        <div
          className="text-primary cursor-pointer text-sm text-left"
          onClick={handleSeeMore}
        >
          See More
        </div>
      ) : (
        <div
          className="text-primary cursor-pointer text-sm text-left"
          onClick={handleSeeMore}
        >
          See less
        </div>
      )}
    </div>
  );
}
