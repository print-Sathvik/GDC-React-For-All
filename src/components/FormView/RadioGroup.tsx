import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function RadioGroup(props: {
  id: number;
  label: string;
  options: string[];
  value: string;
  setFieldContentCB?: (id: number, content: string) => void;
  setLabelContentCB?: (id: number, content: string) => void;
  removeFieldCB?: (id: number) => void;
  showOptionsCB?: (id: number) => void;
}) {
  return (
    //This Component has set of radio buttons along with its label
    <div
      key={props.id}
      onClick={() => {
        props.showOptionsCB && props.showOptionsCB(props.id);
      }}
      className="inputSet relative w-full mt-[30px]"
    >
      <div>
        {props.setLabelContentCB ? (
          <>
            <input
              type="text"
              value={props.label}
              onChange={(e) =>
                props.setLabelContentCB &&
                props.setLabelContentCB(props.id, e.target.value)
              }
              className="absolute left-0 bottom-3 w-3/12 z-[1] text-[#8f8f8f] pt-1 px-2.5 m-0 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[14px] peer-valid:text-[14px] duration-500"
            />
            <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
          </>
        ) : (
          <p className="absolute left-0 -top-10 px-2.5 pb-2.5 ml-4 mt-2 text-[#45f3ff] duration-500">
            {props.label}
          </p>
        )}
        {props.setLabelContentCB ? (
          <div className="float-right">
            <button
              className="p-2 mt-2 ml-2 z-[1] float-right"
              onClick={() =>
                props.removeFieldCB && props.removeFieldCB(props.id)
              }
            >
              <TrashIcon className="w-6 h-6" color="red" />
            </button>
            <p className="pt-5 float-right">radio</p>
            <ChevronDownIcon className="w-8 h-8 float-right pt-2" />
          </div>
        ) : (
          props.options.map((option, ind) => (
            <div key={ind} className="ml-4 py-1">
              <input
                type="radio"
                name={String(props.id)}
                id={String(ind)}
                value={option}
                defaultChecked={option === props.value}
                onChange={(e) =>
                  props.setFieldContentCB &&
                  props.setFieldContentCB(props.id, e.target.value)
                }
                className="w-4 h-4 p-2 text-[#45f3ff] bg-gray-100 border-gray-300 focus:ring-[#45f3ff] dark:focus:ring-[#45f3ff] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 duration-500"
              />
              <label htmlFor={String(ind)} className="cursor-pointer px-2">
                {option}
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
