import React from "react";

export default function FieldSet(props: {
  id: number;
  type: string;
  label: string;
  value: string;
  setFieldContentCB: (id: number, content: string) => void;
  setLabelContentCB?: (id: number, content: string) => void;
  removeFieldCB?: (id: number) => void;
}) {
  return (
    //This Component has an input field along with its label
    <div key={props.id} className="inputSet relative w-full mt-[30px]">
      <div className="flex">
        <input
          type={props.type}
          required={true}
          //disabling input field if setLabelContent prop is absent because it is present only when editing form,
          //and absent while answering the form in preview mode
          disabled={props.setLabelContentCB ? true : false}
          value={props.setLabelContentCB ? "" : props.value}
          onChange={(e) => props.setFieldContentCB(props.id, e.target.value)}
          className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
        />
        {/*If we don't need to set the label content, it means we are in preview mode. So in preview mode I am using
        label and in edit mode I am using input fields to display the label content*/}
        {props.setLabelContentCB ? (
          <input
            type="text"
            value={props.label}
            onChange={(e) =>
              props.setLabelContentCB &&
              props.setLabelContentCB(props.id, e.target.value)
            }
            className="absolute left-0 bottom-3 z-[1] text-[#8f8f8f] pt-1 px-2.5 m-0 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500"
          />
        ) : (
          <label className="absolute left-0 text-[#8f8f8f] pt-5 px-2.5 pb-2.5 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500">
            {props.label}
          </label>
        )}
        <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        {props.setLabelContentCB && (
          <button
            className="p-2 mt-2 ml-2 z-[1]"
            onClick={() => props.removeFieldCB && props.removeFieldCB(props.id)}
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
        )}
      </div>
    </div>
  );
}
