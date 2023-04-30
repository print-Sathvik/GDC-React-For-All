import React, { useState } from "react";
import { Errors, Form, formData, validateForm } from "../types/formTypes";
import { patchFormData } from "../utils/apiUtils";

const saveFormData = async (form: formData, ) => {
  try {
    await patchFormData(form.id ?? 0, {
      title: form.title,
      description: form.description ?? "",
      is_public: form.is_public ?? false,
    });

  } catch (error) {
    console.log(error);
  }
};

export default function EditForm(props: {closeCB: () => void, form: formData, setFormStateCB: (title: string, description: string, is_public: boolean)=>void}) {
  const [form, setForm] = useState<formData>({
    id: props.form.id,
    title: props.form.title,
    description: props.form.description ?? "",
    is_public: props.form.is_public,
  });

  const [errors, setErrors] = useState<Errors<Form>>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await saveFormData(form);
        props.setFormStateCB(form.title, form.description ?? "", form.is_public)
        props.closeCB();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text-2xl my-2 text-gray-700">Create Form</h1>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className={`${errors.title ? "text-red-500" : ""}`}
          >
            Title
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="title"
            id="title"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
            }}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Description
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="description"
            id="description"
            value={form.description ?? ""}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
            }}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-600 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-600 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-blue-600 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
            name="is_public"
            id="is_public"
            role="switch"
            checked={form.is_public}
            onChange={(e) => {
              setForm({ ...form, is_public: e.target.checked });
            }}
          />
          <label
            htmlFor="is_public"
            className={`${errors.is_public ? "text-red-500" : ""}`}
          >
            Is Public
          </label>
          {errors.is_public && (
            <p className="text-red-500">{errors.is_public}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
        <button type="button"
        onClick={props.closeCB}
        className="m-3 inline-flex float-right w-full justify-center rounded bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </form>
    </div>
  );
}
