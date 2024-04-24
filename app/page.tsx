"use client";

// Import required
import React, { useState, useEffect } from "react";
import HomeIndex from "../components/Home";
import Progress from "@/components/Loaders/Progress";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";
import { useFetchUserCallouts } from "@/hooks/fetch/useFetchUserCallouts";
import useFetchUserStations from "../hooks/fetch/useFetchUserStations";

export default function Home() {
  // Auth
  const { session } = useSession();

  // Fetching
  const { data: dataCallouts, error: errorCallouts } = useFetchUserCallouts();
  const { data: dataStations, error: errorStations } = useFetchUserStations();

  if (!dataCallouts?.data || !dataStations) {
    return <Progress />;
  }

  return (
    <HomeIndex
      session={session}
      callouts={dataCallouts}
      stations={dataStations}
    />
  );
}
