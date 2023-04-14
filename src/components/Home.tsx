import React, { useEffect, useState } from "react";
import { formData } from "./Form";
import { Link, useQueryParams } from "raviger";

export default function Home() {
  const savedFormsJSON = localStorage.getItem("savedForms");
  const savedForms = savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
  const [savedFormsState, setState] = useState(savedForms);
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");

  const deleteForm: (id: number) => void = (id: number) => {
    //Delets form from state and useEffect hook is triggered immediately to update local storage
    setState((savedFormsState: formData[]) =>
      savedFormsState.filter((form) => form.id !== id)
    );
  };

  useEffect(() => {
    localStorage.setItem("savedForms", JSON.stringify(savedFormsState));
  }, [savedFormsState]);

  return (
    //This renders form title, edit and delte buttons and a button to create new form
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ search: searchString });
        }}
      >
        <input
          type="text"
          name="search"
          value={searchString}
          placeholder="Search"
          onChange={(e) => setSearchString(e.target.value)}
          className="border-2 border-gray-400 rounded p-2 my-2 w-full flex-1"
        />
      </form>
      <div className="divide-y-2">
        {savedFormsState
          .filter((form: formData) =>
            form.title.toLowerCase().includes(search?.toLowerCase() || "")
          )
          .map((form: formData) => (
            <div key={form.id} className="flex">
              <h2 className="py-4 px-2 flex-1">
                {form.title || "Untitled Form"}
              </h2>
              <Link href={`/forms/${form.id}`} className="p-2 my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="blue"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Link>
              <Link href={`/preview/${form.id}`} className="p-2 my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
              <button className="px-2 my-2" onClick={() => deleteForm(form.id)}>
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
            </div>
          ))}
      </div>
      <div className="text-center my-2">
        <Link
          href={"/forms/0"}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 my-4 rounded"
        >
          New Form
        </Link>
      </div>
    </div>
  );
}
