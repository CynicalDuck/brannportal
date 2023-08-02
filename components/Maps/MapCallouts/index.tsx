"use client";

// Import required
import React, { useState, useMemo, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  HeatmapLayer,
  useGoogleMap,
} from "@react-google-maps/api";

// Import icons
import {} from "react-feather";

// Import components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";

// Types
interface Props {
  children?: React.ReactNode;
  center?: any;
  locations?: any;
  single?: true | false;
  heatmap?: true | false;
  heatmapLocations?: any;
}

export default function MapCallouts({
  children,
  center,
  locations,
  single,
  heatmap,
  heatmapLocations,
  ...props
}: Props) {
  // States
  const [lat, setLat] = useState(27.672932021393862);
  const [lng, setLng] = useState(85.31184012689732);
  const libraries = useMemo(() => ["places", "visualization"], []);
  const mapCenterDefault = useMemo(
    () =>
      center
        ? { lat: center.latitude, lng: center.longitude }
        : { lat: 59.7990983, lng: 14.470943562706905 },
    []
  );
  const [mapCenter, setMapCenter] = useState<any>();
  const [heatmapData, setHeatmapData] = useState<any>(null);

  // Auth
  const { session } = useSession();

  // Configs
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  // Fetching

  // Functions
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: libraries as any,
  });

  // Use effects
  useEffect(() => {
    if (center) {
      setMapCenter({
        lat: parseFloat(center.latitude),
        lng: parseFloat(center.longitude),
      });
    }
  }, [center]);

  useEffect(() => {
    if (isLoaded) {
      let locationArray: any = [];
      heatmapLocations?.forEach((location: any) => {
        locationArray.push(
          new google.maps.LatLng(
            parseFloat(location.callout.latitude),
            parseFloat(location.callout.longitude)
          )
        );
      });
      setHeatmapData(locationArray);
    }
  }, [heatmapLocations]);

  // Return
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full h-[94%] rounded-[20px] overflow-hidden">
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter ? mapCenter : mapCenterDefault}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        {heatmap ? (
          heatmapData ? (
            <div>
              <HeatmapLayer data={heatmapData} />
              {heatmapData.map((location: any, i: number) => (
                <MarkerF position={location} />
              ))}
            </div>
          ) : null
        ) : null}
        {single ? <MarkerF position={mapCenter} /> : null}
      </GoogleMap>
    </div>
  );
}
