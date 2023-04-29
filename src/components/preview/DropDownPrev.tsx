import React from "react";

export default function DropDownPrev(props: {
  id: number;
  label: string;
  options: string[];
  value: string;
  setFieldContentCB?: (id: number, content: string) => void;
}) {
  return (
    //This Component has an dropdown field along with its label
    <div key={props.id} className="inputSet relative w-full mt-[30px]">
      <p className="absolute left-0 -top-10 px-2.5 pb-2.5 mt-3 text-[#45f3ff] duration-500">
        {props.label}
      </p>
      <div className="flex">
        <select
          required={true}
          onChange={(e) =>
            props.setFieldContentCB &&
            props.setFieldContentCB(props.id, e.target.value)
          }
          value={props.value}
          className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
        >
          <option value="">Select an option</option>
          {props.options.map((option, ind) => (
            <option key={ind} value={option}>
              {option}
            </option>
          ))}
        </select>
        <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
      </div>
    </div>
  );
}
