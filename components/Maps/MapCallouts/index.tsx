"use client";

// Import required
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  HeatmapLayer,
  useGoogleMap,
  InfoWindowF,
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
  markers?: true | false;
  markerData?: any;
  description?: true | false;
}

export default function MapCallouts({
  children,
  center,
  locations,
  single,
  heatmap,
  heatmapLocations,
  markers,
  markerData,
  description,
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
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);

  const markerRef = useRef<google.maps.Marker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

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

  const formatDateAndTime = (dateTimeString: any) => {
    const dateTime = new Date(dateTimeString);
    const day = String(dateTime.getMonth() + 1).padStart(2, "0");
    const month = String(dateTime.getDate()).padStart(2, "0");
    const year = String(dateTime.getFullYear()).slice(2);
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    return `${month}.${day}.${year} - ${hours}:${minutes}`;
  };

  // Handlers
  // Handle the click event on the MarkerF
  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
  };

  // Use effects
  useEffect(() => {
    if (markerData) {
      // This will point to the last marker in markerData
      // If you want to handle multiple markers, you'll need to find a way to reference them individually
      markerRef.current = markerData[markerData.length - 1];
    }
  }, [markerData]);

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
            parseFloat(
              location.callout?.latitude
                ? location.callout.latitude
                : location.latitude
            ),
            parseFloat(
              location.callout?.longitude
                ? location.callout.longitude
                : location.longitude
            )
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
        zoom={10}
        center={mapCenter ? mapCenter : mapCenterDefault}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {heatmap ? (
          heatmapData ? (
            <div>
              <HeatmapLayer
                data={heatmapData}
                options={{
                  radius: 30,
                }}
              />
            </div>
          ) : null
        ) : null}
        {markers
          ? markerData?.map((data: any, i: number) => {
              return (
                <React.Fragment key={i}>
                  <MarkerF
                    title="Test"
                    position={
                      new google.maps.LatLng(
                        parseFloat(
                          data.callout?.latitude
                            ? data.callout.latitude
                            : data.latitude
                        ),
                        parseFloat(
                          data.callout?.longitude
                            ? data.callout.longitude
                            : data.longitude
                        )
                      )
                    }
                    onClick={() => handleMarkerClick(data)}
                  />
                  {selectedMarker === data ? (
                    <InfoWindowF
                      position={
                        new google.maps.LatLng(
                          parseFloat(
                            data.callout?.latitude
                              ? data.callout.latitude
                              : data.latitude
                          ),
                          parseFloat(
                            data.callout?.longitude
                              ? data.callout.longitude
                              : data.longitude
                          )
                        )
                      }
                      onCloseClick={() => setSelectedMarker(null)} // Close the info window when clicked on close button
                    >
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex flex-row gap-2">
                          <div className="">
                            {selectedMarker.callout?.station &&
                              selectedMarker.callout?.station.code_full}
                            {selectedMarker?.station &&
                              selectedMarker?.station.code_full}
                          </div>
                          <div>
                            {selectedMarker.callout?.date_start
                              ? formatDateAndTime(
                                  selectedMarker.callout?.date_start +
                                    " " +
                                    selectedMarker.callout?.time_start
                                )
                              : formatDateAndTime(
                                  selectedMarker.date_start +
                                    " " +
                                    selectedMarker.time_start
                                )}
                          </div>
                          <div className="font-semibold">
                            {selectedMarker.callout?.type
                              ? selectedMarker.callout?.type
                              : selectedMarker.type}
                          </div>
                        </div>
                        {description && (
                          <div>
                            {selectedMarker.callout?.description
                              ? selectedMarker.callout?.description
                              : selectedMarker.description
                              ? selectedMarker.description
                              : null}
                          </div>
                        )}
                      </div>
                    </InfoWindowF>
                  ) : null}
                </React.Fragment>
              );
            })
          : null}
        {single ? <MarkerF position={mapCenter} /> : null}
      </GoogleMap>
    </div>
  );
}
