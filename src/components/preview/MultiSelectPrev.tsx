/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

export default function MultiSelectPrev(props: {
  id: number;
  label: string;
  options: string[];
  value: string; //Will store the indices of chosen options as space seperated string
  setMultiSelectContentCB?: (id: number, ind: number) => void;
}) {
  const [expanded, setExpandedState] = useState(false);
  const valueArray =
    props.value !== ""
      ? props.value.split(" ").map((optionIndex) => Number(optionIndex))
      : [];
  const [chosenOptions, setChosenOptionsState] = useState(() =>
    props.options.filter((option, ind) => valueArray.includes(ind))
  );

  return (
    //This Component has set of Multiselect label and it options
    <div key={props.id} className="inputSet relative w-full mt-[30px]">
      <div>
        <p className="absolute left-0 -top-10 px-2.5 pb-2.5 mt-3 text-[#45f3ff] duration-500">
          {props.label}
        </p>
        <div className="mx-5">
          <div
            onClick={(_) => setExpandedState(!expanded)}
            className="flex w-full border-2 border-black rounded"
          >
            <div className="p-2 flex-1">
              {chosenOptions.map((option, ind) => (
                <div
                  className="bg-[#45f3ff] px-2 py-1 m-1 rounded-3xl inline-flex"
                  key={ind}
                >
                  {option}
                </div>
              ))}
            </div>
            {expanded ? (
              <ChevronUpIcon className="w-8 h-8 float-right pt-2" />
            ) : (
              <ChevronDownIcon className="w-8 h-8 float-right pt-2" />
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md w-full h-fit">
            {expanded &&
              props.options.map((option, ind) => {
                return (
                  <div key={ind} className="border-gray-400 border-b-2">
                    <input
                      type="checkbox"
                      name={String(props.id)}
                      id={String(ind)}
                      value={ind}
                      defaultChecked={chosenOptions.includes(option)}
                      disabled={props.setMultiSelectContentCB ? false : true}
                      hidden={true}
                      onChange={(e) => {
                        if (props.setMultiSelectContentCB !== undefined) {
                          chosenOptions.includes(option)
                            ? setChosenOptionsState(
                                chosenOptions.filter((opt) => option !== opt)
                              )
                            : setChosenOptionsState([...chosenOptions, option]);
                          props.setMultiSelectContentCB &&
                            props.setMultiSelectContentCB(
                              props.id,
                              Number(e.target.id)
                            );
                        }
                      }}
                      className="peer w-4 h-4 text-[#45f3ff] bg-gray-100 border-gray-300 focus:ring-[#45f3ff]"
                    />
                    <label
                      htmlFor={String(ind)}
                      className="text-base peer-checked:bg-[#45f3ff] cursor-pointer px-4 py-2 hover:bg-gray-300 w-full inline-block"
                    >
                      {option}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
