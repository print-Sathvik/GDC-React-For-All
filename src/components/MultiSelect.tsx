import React, { useEffect, useState } from "react";
import { textFieldType } from "../types/formTypes";

export default function Multi(props: {
  id: number;
  label: string;
  fieldType: textFieldType;
  options: string[];
  value: string;
  selected: number[];
  setMultiSelectContentCB?: (id: number, ind: number) => void;
  setLabelContentCB?: (id: number, content: string) => void;
  removeFieldCB?: (id: number) => void;
  showOptionsCB?: (id: number) => void;
}) {
  const [expanded, setExpandedState] = useState(false);
  const [chosenOptions, setChosenOptionsState] = useState(() =>
    props.options
      .filter((option, ind) => props.selected.includes(ind))
      .join("; ")
  );

  useEffect(() => {
    setChosenOptionsState(
      props.options
        .filter((option, ind) => props.selected.includes(ind))
        .join("; ")
    );
  }, [props.options, props.selected]);

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
        {props.setLabelContentCB ? (
          <div>
            <input
              type="text"
              value={props.label}
              onChange={(e) =>
                props.setLabelContentCB &&
                props.setLabelContentCB(props.id, e.target.value)
              }
              className="absolute left-0 bottom-3 w-3/12 z-[1] text-[#8f8f8f] pt-1 px-2.5 m-0 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500"
            />
            <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
          </div>
        ) : (
          <p className="absolute left-0 -top-10 px-2.5 pb-2.5 mt-3 text-[#45f3ff] duration-500">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <p className="pt-5 float-right">{props.fieldType}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 float-right pt-2 rounded"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        ) : (
          <div className="mx-5">
            <div
              onClick={(_) => setExpandedState(!expanded)}
              className="flex w-full border-2 border-black rounded"
            >
              <input
                type="text"
                disabled={true}
                value={chosenOptions}
                className="p-2 flex-1"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 float-right pt-2 rounded"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="bg-white rounded-lg shadow-md w-full h-fit">
              {expanded &&
                props.options.map((option, ind) => (
                  <div key={ind} className="border-gray-400 border-b-2">
                    <input
                      type="checkbox"
                      name={String(props.id)}
                      id={String(ind)}
                      value={ind}
                      defaultChecked={props.selected.includes(ind)}
                      hidden={true}
                      onChange={(e) => {
                        props.setMultiSelectContentCB &&
                          props.setMultiSelectContentCB(
                            props.id,
                            Number(e.target.id)
                          );
                      }}
                      className="peer w-4 h-4 text-[#45f3ff] bg-gray-100 border-gray-300 focus:ring-[#45f3ff] dark:focus:ring-[#45f3ff] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 duration-500"
                    />
                    <label
                      htmlFor={String(ind)}
                      className="text-base peer-checked:bg-[#45f3ff] cursor-pointer px-4 py-2 hover:bg-gray-100 w-full inline-block"
                    >
                      {option}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
