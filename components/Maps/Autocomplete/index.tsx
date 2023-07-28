"use client";

// Import required
import { useLoadScript } from "@react-google-maps/api";
import { NextPage } from "next";
import { useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
  getZipCode,
} from "use-places-autocomplete";

// Import icons
import {} from "react-feather";

// Import components

// Import hooks

// Types
interface Props {
  children?: React.ReactNode;
  onAddressSelect: any;
}

export default function AutocompleteAddress({
  children,
  onAddressSelect,
  ...props
}: Props) {
  // States
  const libraries = useMemo(() => ["places"], []);

  // Fetching

  // Functions
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDx2EH8Rs0zljU_4946aFIe80ir1fIkQ3M" as string,
    libraries: libraries as any,
  });

  // Return
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full">
      <PlacesAutocomplete
        onAddressSelect={(address) => {
          getGeocode({ address }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            const address = results[0].formatted_address;
            const zip = getZipCode(results[0], false);

            onAddressSelect(lat, lng, address, zip);
          });
        }}
      />
    </div>
  );
}

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect?.(description);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className="w-full">
      <input
        value={value}
        className="rounded-full px-2 w-full"
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
      />
      {status === "OK" && <ul className="">{renderSuggestions()}</ul>}
    </div>
  );
};
