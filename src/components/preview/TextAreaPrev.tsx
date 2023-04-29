import React from "react";

export default function TextAreaPrev(props: {
  id: number;
  label: string;
  value: string;
  setFieldContentCB?: (id: number, content: string) => void;
}) {
  return (
    //This Component has an input field along with its label
    <div key={props.id} className="relative w-full mt-[30px]">
      <div className="flex">
        <textarea
          required={true}
          value={props.value}
          onChange={(e) =>
            props.setFieldContentCB &&
            props.setFieldContentCB(props.id, e.target.value)
          }
          rows={4}
          className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
        ></textarea>
        <label className="absolute left-0 -top-2 text-[#8f8f8f] pt-5 px-2.5 pb-2.5 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[14px] peer-valid:text-[14px] duration-500">
          {props.label}
        </label>
        <i className="peer-focus:h-full peer-valid:h-full absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
      </div>
    </div>
  );
}