import React, { useState } from "react";
import { Errors, Form, validateForm } from "../types/formTypes";
import { createForm } from "../utils/apiUtils";
import { navigate } from "raviger";

export default function CreateForm() {
  const [form, setForm] = useState<Form>({
    title: "",
    description:"",
    is_public: false
  });

  const [errors, setErrors] = useState<Errors<Form>>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    setForm({...form, [name]: value})
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if(Object.keys(validationErrors).length === 0) {
      try {
        const data = await createForm(form)
        navigate(`/forms/${data.id}`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text-2xl my-2 text-gray-700">Create Form</h1>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className={`${errors.title ? "text-red-500" : ""}`}>Title</label>
          <input type="text" className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1" name="title" id="title" value={form.title}
          onChange={(e) => {setForm({...form, title: e.target.value})}} />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className={`${errors.description ? "text-red-500" : ""}`}>Description</label>
          <input type="text" className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1" name="description" id="description" value={form.description}
          onChange={(e) => {setForm({...form, description: e.target.value})}} />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>
        <div className="mb-4">
          <input type="checkbox" className="mr-2 border-2 border-gray-200 rounded p-2 my-2 flex-1" name="is_public" id="is_public" 
          value={form.is_public ? "true" : "false"} onChange={(e) => {setForm({...form, is_public: e.target.checked})}} />
          <label htmlFor="is_public" className={`${errors.is_public ? "text-red-500" : ""}`}>Is Public</label>
          {errors.is_public && <p className="text-red-500">{errors.is_public}</p>}
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">New Form</button>
      </form>
    </div>
  )

}