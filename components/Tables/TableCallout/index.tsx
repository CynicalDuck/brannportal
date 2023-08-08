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
  address?: true | false;
}

export default function TableCallout({
  children,
  title,
  data,
  address,
  ...props
}: Props) {
  // States
  const [itemsToShow, setItemsToShow] = useState(10);
  const [items, setItems] = useState([]);

  var tableData: any = [];
  if (data) {
    data.forEach((item: any) => {
      if (item.callout) {
        tableData.push(item.callout);
      } else tableData.push(item);
    });
  }

  // Fetching

  // Functions
  const handleSeeMore = () => {
    // Set itemsToShow to a large number (e.g., data.length) to show all items
    if (itemsToShow === 10) {
      setItemsToShow(data.length);
    } else {
      setItemsToShow(10);
    }
  };

  const formatDateAndTime = (dateTimeString: any) => {
    const dateTime = new Date(dateTimeString);
    const day = String(dateTime.getMonth() + 1).padStart(2, "0");
    const month = String(dateTime.getDate()).padStart(2, "0");
    const year = String(dateTime.getFullYear()).slice(2);
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    return `${month}.${day}.${year} - ${hours}:${minutes}`;
  };

  // Return
  return (
    <div className="flex flex-col gap-0">
      <Table className="bg-accent7 rounded-[20px] shadow-xs shadow-black">
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] hidden lg:block mt-6">
              Callout
            </TableHead>
            <TableHead className="w-[300px]">Category</TableHead>
            {address && <TableHead className="w-[700px]">Address</TableHead>}
            <TableHead className="w-[300px]">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData?.slice(0, itemsToShow).map((callout: any) => (
            <TableRow
              key={callout?.id}
              className="hover:bg-light hover:cursor-pointer"
              onClick={() => (window.location.href = "callouts/" + callout?.id)}
            >
              <TableCell className="font-medium hidden lg:block">
                {callout?.callout_id ? callout?.callout_id : callout?.id}
              </TableCell>
              <TableCell>{callout?.type}</TableCell>
              {address && (
                <TableCell>
                  <div className="flex flex-row gap-2">{callout?.address}</div>
                </TableCell>
              )}
              <TableCell>
                {formatDateAndTime(
                  callout.date_start + " " + callout.time_start
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data?.length > 0 ? (
        itemsToShow < data?.length ? (
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
        )
      ) : null}
    </div>
  );
}
