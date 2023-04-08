import React from "react";

export default function FieldSet(props: {
  id: number;
  type: string;
  label: string;
}) {
  return (
    <div
      key={props.id}
      className="inputSet relative w-full mt-[35px] first:valid:"
    >
      <input
        type={props.type}
        required={true}
        className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500"
      />
      <label className="absolute left-0 text-[#8f8f8f] pt-5 px-2.5 pb-2.5 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500">
        {props.label}
      </label>
      <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
    </div>
  );
}
