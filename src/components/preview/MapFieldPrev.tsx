import React, { useState } from "react";
import GoogleMapReact, { Coords } from "google-map-react";
import { MapPinIcon } from "@heroicons/react/20/solid";

export default function Map(props: {
  id: number;
  label: string;
  value: string; //will store location as space seperated string - "latitide longitude"
  setFieldContentCB?: (id: number, content: string) => void;
}) {
  const initialValue = {
    center: {
      lat: props.value === "" ? 10.99835602 : Number(props.value.split(" ")[0]),
      lng: props.value === "" ? 77.01502627 : Number(props.value.split(" ")[1]),
    },
    zoom: 11,
  };
  const [state, setState] = useState<Coords>(initialValue.center);

  return (
    <div>
      <h4 className="text-[#45f3ff] pt-1 px-2.5 pb-2">{props.label}</h4>
      <p>
        <span>Latitude: {state.lat}</span>
        <span className="float-right">Longitude: {state.lng}</span>
      </p>
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          center={initialValue.center}
          defaultZoom={initialValue.zoom}
          onChange={(obj) => {
            props.setFieldContentCB && setState(obj.center);
            props.setFieldContentCB &&
              props.setFieldContentCB(
                props.id,
                obj.center.lat + " " + obj.center.lng
              );
          }}
        >
          <div
            style={{ position: "absolute", transform: "translate(-50%, -50%)" }}
          >
            <MapPinIcon color="red" className="w-6 h-6 scale-y-110" />
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
}
