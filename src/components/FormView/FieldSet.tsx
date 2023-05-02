import React, { useEffect, useRef } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function FieldSet(props: {
  id: number;
  label: string;
  value: string;
  focus: boolean;
  meta: {
    description:
      | "text"
      | "textarea"
      | "tel"
      | "password"
      | "email"
      | "url"
      | "time"
      | "date"
      | "address";
  };
  setLabelContentCB: (id: number, content: string) => void;
  removeFieldCB: (id: number) => void;
}) {
  const inpRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    props.focus && inpRef.current?.focus();
  }, [props.focus]);

  return (
    //This Component has an input field along with its label
    <div key={props.id} className="relative w-full mt-[30px]">
      <div className="flex">
        <input
          type="text"
          required={true}
          disabled={true}
          value={""}
          className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
        />
        <input
          type="text"
          value={props.label}
          ref={inpRef}
          onChange={(e) => props.setLabelContentCB(props.id, e.target.value)}
          className="absolute left-0 bottom-3 max-w-fit z-[1] text-[#8f8f8f] pt-1 px-2.5 m-0 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[14px] peer-valid:text-[14px] duration-500"
        />
        <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        <div className="flex">
          <p className="pt-5">{props.meta.description}</p>
          <button
            className="p-2 mt-2 ml-2 z-[1]"
            onClick={() => props.removeFieldCB && props.removeFieldCB(props.id)}
          >
            <TrashIcon className="w-6 h-6" color="red" />
          </button>
        </div>
      </div>
    </div>
  );
}
