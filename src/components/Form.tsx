import React, { useState } from "react";
import FieldSet from "../FieldSet";

const formFields = [
  { id: 1, label: "First Name", type: "text", value: "" },
  { id: 2, label: "Last Name", type: "text", value: "" },
  { id: 3, label: "Email", type: "email", value: "" },
  { id: 4, label: "Date of Birth", type: "date", value: "" },
  { id: 5, label: "Phone Number", type: "tel", value: "" },
];

export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(formFields);
  const [newField, setNewField] = useState("");
  const addField = () => {
    setState([
      ...state,
      {
        id: Number(new Date()),
        label: newField,
        type: "text",
        value: "",
      },
    ]);
    setNewField("");
  };

  const removeField = (id: number) => {
    setState(state.filter((field) => field.id !== id));
  };

  const setFieldContent = (id: number, content: string) => {
    setState(
      state.map((field) =>
        field.id === id
          ? {
              ...field,
              value: content,
            }
          : {
              ...field,
            }
      )
    );
  };

  const reset = () => {
    setState(
      state.map((field) => ({
        ...field,
        value: "",
      }))
    );
  };

  return (
    <div className="flex flex-col gap-2 p-4 divide-y-2 divide-dotted">
      <div>
        {state.map((field) => (
          <FieldSet
            id={field.id}
            type={field.type}
            label={field.label}
            value={field.value}
            setFieldContentCB={setFieldContent}
            removeFieldCB={removeField}
          />
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newField}
          className="border-2 border-gray-400 rounded p-2 my-4 flex-1"
          onChange={(e) => {
            setNewField(e.target.value);
          }}
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-800 text-white font-bold p-2 my-4 ml-2 rounded"
          onClick={addField}
        >
          Add Field
        </button>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-3 py-2 mt-4 mr-2 rounded"
        >
          Submit
        </button>
        <button
          className="bg-red-600 hover:bg-red-800 text-white font-bold p-2 mt-4 mx-2 rounded"
          onClick={props.closeFormCB}
        >
          Close Form
        </button>
        <button
          className="bg-red-600 hover:bg-red-800 text-white font-bold p-2 mt-4 ml-2 rounded"
          onClick={reset}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
