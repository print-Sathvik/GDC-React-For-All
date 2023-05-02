/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function MultiSelect(props: {
  id: number;
  label: string;
  options: string[];
  value: string; //Will store the indices of chosen options as space seperated string
  focus: boolean;
  setLabelContentCB: (id: number, content: string) => void;
  removeFieldCB: (id: number) => void;
  showOptionsCB: (id: number) => void;
}) {
  const inpRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    props.focus && inpRef.current?.focus();
  }, [props.focus]);

  return (
    //This Component has set of Multiselect label and it options
    <div
      key={props.id}
      onClick={() => {
        props.showOptionsCB && props.showOptionsCB(props.id);
      }}
      className="inputSet relative w-full mt-[30px]"
    >
      <div>
        <div>
          <input
            type="text"
            value={props.label}
            ref={inpRef}
            onChange={(e) => props.setLabelContentCB(props.id, e.target.value)}
            className="absolute left-0 bottom-3 w-3/12 z-[1] text-[#8f8f8f] pt-1 px-2.5 m-0 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[14px] peer-valid:text-[14px] duration-500"
          />
          <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        </div>
        <div className="float-right">
          <button
            className="p-2 mt-2 ml-2 z-[1] float-right"
            onClick={() => props.removeFieldCB(props.id)}
          >
            <TrashIcon className="w-6 h-6" color="red" />
          </button>
          <p className="pt-5 float-right">multiselect</p>
          <ChevronDownIcon className="w-8 h-8 float-right pt-2" />
        </div>
      </div>
    </div>
  );
}
