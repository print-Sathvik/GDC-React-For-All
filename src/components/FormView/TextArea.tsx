import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function TextArea(props: {
  id: number;
  label: string;
  value: string;
  setLabelContentCB?: (id: number, content: string) => void;
  removeFieldCB?: (id: number) => void;
}) {
  return (
    //This Component has an input field along with its label
    <div key={props.id} className="relative w-full mt-[30px]">
      <div className="flex">
        <textarea
          required={true}
          disabled={props.setLabelContentCB ? true : false}
          value={props.value}
          rows={props.setLabelContentCB ? 1 : 4}
          className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
        ></textarea>
        <input
          type="text"
          value={props.label}
          onChange={(e) =>
            props.setLabelContentCB &&
            props.setLabelContentCB(props.id, e.target.value)
          }
          className="absolute left-0 bottom-3 max-w-fit z-[1] text-[#8f8f8f] pt-1 px-2.5 m-0 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[14px] peer-valid:text-[14px] duration-500"
        />
        <i className="peer-focus:h-full peer-valid:h-full absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        {props.setLabelContentCB && (
          <div className="flex">
            <p className="pt-5">textarea</p>
            <button
              className="p-2 mt-2 ml-2 z-[1]"
              onClick={() =>
                props.removeFieldCB && props.removeFieldCB(props.id)
              }
            >
              <TrashIcon className="w-6 h-6" color="red" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
