import React, { useState, useEffect, useRef } from "react";
import FieldSet from "../FieldSet";
import { Link, navigate } from "raviger";

interface formData {
  id: number;
  title: string;
  formFields: formField[];
}

interface formField {
  id: number;
  label: string;
  type: string;
  value: string;
}

const initialFormFields: formField[] = [
  { id: 1, label: "First Name", type: "text", value: "" },
  { id: 2, label: "Last Name", type: "text", value: "" },
  { id: 3, label: "Email", type: "email", value: "" },
  { id: 4, label: "Date of Birth", type: "date", value: "" },
  { id: 5, label: "Phone Number", type: "tel", value: "" },
];

const getLocalForms: () => formData[] = () => {
  const savedFormsJSON = localStorage.getItem("savedForms");
  const persistantormFields = savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
  return persistantormFields;
};

const initialState: (id: number) => formData = (id: number) => {
  // when new form button is clicked this method creates a new formData object when it is
  // found that form with the id required is not in the local storage.
  // If there exists a form with given id(this happens when edit button is clicked), then that form is rendered
  const localForms = getLocalForms();
  const currentForm = localForms.find((form) => form.id === id);
  if (currentForm !== undefined) {
    return currentForm;
  }
  const newForm = {
    id: Number(new Date()),
    title: "Untitled Form",
    formFields: initialFormFields,
  };
  saveLocalForms([...localForms, newForm]);
  return newForm;
};

const saveLocalForms = (localForms: formData[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
};

const saveFormData = (currentState: formData) => {
  const localForms = getLocalForms();
  const updatedLocalForms = localForms.map((form) =>
    form.id === currentState.id ? currentState : form
  );
  saveLocalForms(updatedLocalForms);
};

function Form(props: { id: number }) {
  const [state, setState] = useState(() => initialState(props.id));
  const [newField, setNewField] = useState({ label: "", type: "text" });
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    state.id !== props.id && navigate(`/forms/${state.id}`);
  }, [props.id, state.id]);

  useEffect(() => {
    document.title = "Form Editor";
    titleRef.current?.focus();

    return () => {
      document.title = "Home Page";
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(state);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  const addField = () => {
    setState({
      ...state,
      formFields: [
        ...state.formFields,
        {
          id: Number(new Date()),
          label: newField.label,
          type: newField.type,
          value: "",
        },
      ],
    });
    setNewField({ label: "", type: "text" });
  };

  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
  };

  const setFieldContent = (id: number, content: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) =>
        field.id === id
          ? {
              ...field,
              value: content,
            }
          : {
              ...field,
            }
      ),
    });
  };

  const setLabelContent = (id: number, content: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) =>
        field.id === id
          ? {
              ...field,
              label: content,
            }
          : {
              ...field,
            }
      ),
    });
  };

  const reset = () => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => ({
        ...field,
        value: "",
      })),
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 divide-y-2 divide-dotted">
      <div>
        <div className="inputSet relative w-full mt-[35px]">
          <input
            type="text"
            required={true}
            value={state.title}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
          />
          <label className="absolute left-0 text-[#8f8f8f] pt-5 px-2.5 pb-2.5 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500">
            Form Title
          </label>
          <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        </div>
        {state.formFields.map((field) => (
          <FieldSet
            id={field.id}
            key={field.id}
            type={field.type}
            label={field.label}
            value={field.value}
            setFieldContentCB={setFieldContent}
            setLabelContentCB={setLabelContent}
            removeFieldCB={removeField}
          />
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newField.label}
          placeholder="New Field"
          className="border-2 border-gray-400 rounded p-2 my-4 flex-auto"
          onChange={(e) => {
            setNewField({ label: e.target.value, type: newField.type });
          }}
        />
        <select
          onChange={(e) => {
            setNewField({ label: newField.label, type: e.target.value });
          }}
          className="h-fit p-2 my-4 flex-auto mx-2 border-2 border-gray-400 rounded"
        >
          {[
            "text",
            "date",
            "tel",
            "url",
            "color",
            "password",
            "radio",
            "range",
            "time",
            "file",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className="bg-yellow-500 hover:bg-yellow-800 text-white font-bold p-2 my-4 ml-2 rounded"
          onClick={addField}
        >
          Add Field
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={(_e) => saveFormData(state)}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-3 py-2 mt-4 mr-2 rounded"
        >
          Save
        </button>
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-800 text-white font-bold p-2 mt-4 mx-2 rounded"
        >
          Close Form
        </Link>
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

export type { formData, formField };
export default Form;
export { getLocalForms, saveFormData };
