"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../../app/supabase";

// Import icons
import { Plus } from "react-feather";

// Import components
import TableCallout from "@/components/Tables/TableCallout";
import NavHamburger from "../../components/Nav/NavHamburger";
import CalloutsIndex from "../../components/Callouts";
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
import useFetchUserStations from "../../hooks/fetch/useFetchUserStations";

export default function Callouts() {
  // Fetching
  const { session } = useSession();
  const { data: dataCallouts, error: errorCallouts } = useFetchUserCallouts();
  const { data: dataStations, error: errorStations } = useFetchUserStations();

  // Return
  return (
    <CalloutsIndex
      session={session}
      callouts={dataCallouts}
      stations={dataStations}
    />
  );
}
