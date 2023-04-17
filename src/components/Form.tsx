import React, { useState, useEffect, useRef } from "react";
import FieldSet from "./FieldSet";
import { Link, navigate } from "raviger";
import { formData, formField, textFieldType } from "../types/formTypes";
import DropDown from "./DropDown";
import RadioGroup from "./RadioGroup";
import MultiSelect from "./MultiSelect";
import TextArea from "./TextArea";

const initialFormFields: formField[] = [
  { kind: "text", id: 1, label: "First Name", fieldType: "text", value: "" },
  { kind: "text", id: 2, label: "Last Name", fieldType: "text", value: "" },
  { kind: "text", id: 3, label: "Email", fieldType: "email", value: "" },
  { kind: "text", id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  { kind: "text", id: 5, label: "Phone Number", fieldType: "tel", value: "" },
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
  const defaultNewField: { label: string; type: textFieldType } = {
    label: "",
    type: "text",
  };
  const [newField, setNewField] = useState(() => defaultNewField);
  //This will hold the id of the element which is expanded in the form
  //Elements like deopdown, radio button group, multiselect, can be expanded to see/edit options while creating form
  //Only 1 element can be expanded
  const [expandedElement, setExpandedElement] = useState(0);
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

  const getNewFormFields: (type: textFieldType) => formField[] = (type) => {
    switch (type) {
      case "text":
        return [
          ...state.formFields,
          {
            kind: "text",
            id: Number(new Date()),
            label: newField.label,
            fieldType: newField.type,
            value: "",
          },
        ];
      case "dropdown":
        return [
          ...state.formFields,
          {
            kind: newField.type as "dropdown",
            id: Number(new Date()),
            label: newField.label,
            fieldType: newField.type,
            options: [],
            value: "",
          },
        ];
      case "radio":
        return [
          ...state.formFields,
          {
            kind: newField.type as "radio",
            id: Number(new Date()),
            label: newField.label,
            fieldType: newField.type,
            options: [],
            value: "",
          },
        ];
      case "multiselect":
        return [
          ...state.formFields,
          {
            kind: newField.type as "radio",
            id: Number(new Date()),
            label: newField.label,
            fieldType: newField.type,
            options: [],
            value: "",
            selected: [],
          },
        ];
      case "textarea":
        return [
          ...state.formFields,
          {
            kind: "textarea",
            id: Number(new Date()),
            label: newField.label,
            fieldType: newField.type,
            value: "",
          },
        ];
      default:
        return [
          ...state.formFields,
          {
            kind: "text",
            id: Number(new Date()),
            label: newField.label,
            fieldType: newField.type,
            value: "",
          },
        ];
    }
  };

  const addField = () => {
    setState({
      ...state,
      formFields: getNewFormFields(newField.type),
    });
    setNewField({ label: "", type: newField.type });
  };

  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
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

  const createEmptyOption: (id: number) => void = (id) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) =>
        field.id === id &&
        (field.kind === "dropdown" ||
          field.kind === "radio" ||
          field.kind === "multiselect")
          ? {
              ...field,
              options: [...field.options, ""],
            }
          : {
              ...field,
            }
      ),
    });
  };

  const setOption: (id: number, ind: number, content: string) => void = (
    id,
    ind,
    content
  ) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) =>
        field.id === id &&
        (field.kind === "dropdown" ||
          field.kind === "radio" ||
          field.kind === "multiselect")
          ? {
              ...field,
              options: field.options.map((option, index) =>
                ind === index ? content : option
              ),
            }
          : {
              ...field,
            }
      ),
    });
  };

  const deleteOption: (id: number, ind: number) => void = (id, ind) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) =>
        field.id === id &&
        (field.kind === "dropdown" ||
          field.kind === "radio" ||
          field.kind === "multiselect")
          ? {
              ...field,
              options: field.options.filter((option, index) => ind !== index),
            }
          : { ...field }
      ),
    });
  };

  const showOptions: (id: number) => void = (id) => {
    //If same element is clicked close it if its open, if different element is clicked, then open that element
    id === expandedElement ? setExpandedElement(0) : setExpandedElement(id);
  };

  return (
    <div className="flex flex-col gap-2 p-4 pt-0 divide-y-2 divide-dotted">
      <div>
        <div className="inputSet relative w-full mt-[35px]">
          <input
            type="text"
            required={true}
            value={state.title}
            ref={titleRef}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
          />
          <label className="absolute left-0 text-[#8f8f8f] pt-5 px-2.5 pb-2.5 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500">
            Form Title
          </label>
          <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        </div>
        {state.formFields.map((field) => {
          switch (field.kind) {
            case "text":
              return (
                <FieldSet
                  id={field.id}
                  key={field.id}
                  type={field.fieldType}
                  label={field.label}
                  value={field.value}
                  setLabelContentCB={setLabelContent}
                  removeFieldCB={removeField}
                />
              );
            case "dropdown":
              return (
                <div key={field.id}>
                  <div className="flex">
                    <DropDown
                      id={field.id}
                      key={field.id}
                      fieldType={field.fieldType}
                      label={field.label}
                      value=""
                      options={field.options}
                      setLabelContentCB={setLabelContent}
                      removeFieldCB={removeField}
                      showOptionsCB={showOptions}
                    />
                    <button
                      onClick={() => {
                        createEmptyOption(field.id);
                        setExpandedElement(field.id);
                      }}
                      className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 mt-10 mr-2 flex-1 h-fit text-center rounded"
                    >
                      New
                    </button>
                  </div>
                  {expandedElement === field.id &&
                    field.options.map((option, ind) => (
                      <div
                        className="flex relative left-10 mt-[30px] w-1/2"
                        key={ind}
                      >
                        <input
                          type="text"
                          placeholder={`Option ${ind + 1}`}
                          required={true}
                          value={option}
                          onChange={(e) =>
                            setOption(field.id, ind, e.target.value)
                          }
                          className="peer relative w-full px-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
                        />
                        <button
                          className="z-[1] hidden pb-1 peer-hover:block peer-focus:block hover:block focus:block"
                          onClick={() => field && deleteOption(field.id, ind)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.2"
                            stroke="red"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                        <i className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff]"></i>
                      </div>
                    ))}
                </div>
              );
            case "radio":
              return (
                <div key={field.id}>
                  <div className="flex">
                    <RadioGroup
                      id={field.id}
                      key={field.id}
                      fieldType={field.fieldType}
                      label={field.label}
                      value=""
                      options={field.options}
                      setLabelContentCB={setLabelContent}
                      removeFieldCB={removeField}
                      showOptionsCB={showOptions}
                    />
                    <button
                      onClick={() => {
                        createEmptyOption(field.id);
                        setExpandedElement(field.id);
                      }}
                      className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 mt-10 mr-2 flex-1 h-fit text-center rounded"
                    >
                      New
                    </button>
                  </div>
                  {/*This part displays the options on clicking on a dropdown or radio group or multiselect in edit mode*/}
                  {expandedElement === field.id &&
                    field.options.map((option, ind) => (
                      <div
                        className="flex relative left-10 mt-[30px] w-1/2"
                        key={ind}
                      >
                        <input
                          type="radio"
                          name={String(field.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${ind + 1}`}
                          required={true}
                          value={option}
                          onChange={(e) =>
                            setOption(field.id, ind, e.target.value)
                          }
                          className="peer relative w-full px-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
                        />
                        <button
                          className="z-[1] hidden peer-hover:block peer-focus:block pb-1"
                          onClick={() => deleteOption(field.id, ind)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.2"
                            stroke="red"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                        <i className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff]"></i>
                      </div>
                    ))}
                </div>
              );
            case "multiselect":
              return (
                <div key={field.id}>
                  <div className="flex">
                    <MultiSelect
                      id={field.id}
                      key={field.id}
                      fieldType={field.fieldType}
                      label={field.label}
                      value=""
                      selected={field.selected}
                      options={field.options}
                      setLabelContentCB={setLabelContent}
                      removeFieldCB={removeField}
                      showOptionsCB={showOptions}
                    />
                    <button
                      onClick={() => {
                        createEmptyOption(field.id);
                        setExpandedElement(field.id);
                      }}
                      className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 mt-10 mr-2 flex-1 h-fit text-center rounded"
                    >
                      New
                    </button>
                  </div>
                  {/*This part displays the options on clicking on multiselect in file edit mode*/}
                  {expandedElement === field.id &&
                    field.options.map((option, ind) => (
                      <div
                        className="flex relative left-10 mt-[30px] w-1/2"
                        key={ind}
                      >
                        <input
                          type="text"
                          placeholder={`Option ${ind + 1}`}
                          required={true}
                          value={option}
                          onChange={(e) =>
                            setOption(field.id, ind, e.target.value)
                          }
                          className="peer relative w-full px-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
                        />
                        <button
                          className="z-[1] hidden peer-hover:block peer-focus:block pb-1"
                          onClick={() => deleteOption(field.id, ind)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.2"
                            stroke="red"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                        <i className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff]"></i>
                      </div>
                    ))}
                </div>
              );
            case "textarea":
              return (
                <TextArea
                  id={field.id}
                  key={field.id}
                  type={field.fieldType}
                  label={field.label}
                  value={field.value}
                  setLabelContentCB={setLabelContent}
                  removeFieldCB={removeField}
                />
              );
            default:
              return <div>No such field exists</div>;
          }
        })}
      </div>
      <div className="flex-auto">
        <input
          type="text"
          value={newField.label}
          placeholder="New Field"
          className="border-2 border-gray-400 rounded p-2 my-4 flex-grow w-5/12"
          onChange={(e) => {
            setNewField({ label: e.target.value, type: newField.type });
          }}
        />
        <select
          value={newField.type}
          onChange={(e) => {
            setNewField({
              label: newField.label,
              type: e.target.value as textFieldType,
            });
          }}
          className="h-fit p-2 my-4 flex-shrink mx-2 border-2 border-gray-400 rounded"
        >
          {[
            "text",
            "date",
            "dropdown",
            "radio",
            "multiselect",
            "textarea",
            "password",
            "tel",
            "url",
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
          className="bg-yellow-500 hover:bg-yellow-800 flex-shrink text-white font-bold p-2 my-4 ml-2 rounded"
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
