import React from "react";

export default function RadioGroupPrev(props: {
  id: number;
  label: string;
  options: string[];
  value: string;
  setFieldContentCB?: (id: number, content: string) => void;
}) {
  return (
    //This Component has set of radio buttons along with its label in preview and submit mode
    <div
      key={props.id}
      className="inputSet relative w-full mt-[30px]"
    >
      <div>
        <p className="absolute left-0 -top-10 px-2.5 pb-2.5 ml-4 mt-2 text-[#45f3ff] duration-500">
          {props.label}
        </p>
        {props.options.map((option, ind) => (
            <div key={ind} className="ml-4 py-1">
              <input
                type="radio"
                name={String(props.id)}
                id={String(ind)}
                value={option}
                defaultChecked={option === props.value && props.value!==""}
                disabled={props.setFieldContentCB ? false:true}
                onChange={(e) =>
                  props.setFieldContentCB &&
                  props.setFieldContentCB(props.id, e.target.value)
                }
                className="w-4 h-4 p-2 text-[#45f3ff] bg-gray-100 border-gray-300 focus:ring-[#45f3ff] focus:ring-2 disabled:focus:ring-[#45f3ff] disabled:focus:ring-2 disabled:text-[#45f3ff] disabled:bg-blue-400 duration-500"
              />
              <label htmlFor={String(ind)} className="cursor-pointer px-2">
                {option}
              </label>
            </div>
          ))
        }
      </div>
    </div>
  );
}
