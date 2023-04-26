import React, { useState, useEffect, useRef, useReducer } from "react";
import FieldSet from "./FieldSet";
import { Link } from "raviger";
import {
  formData,
  formField,
  newFieldType,
  textFieldType,
} from "../types/formTypes";
import DropDown from "./DropDown";
import RadioGroup from "./RadioGroup";
import MultiSelect from "./MultiSelect";
import TextArea from "./TextArea";
import { FormAction, NewFieldActions } from "../types/actionTypes";
import { getFormData, listForms, patchFormData } from "../utils/apiUtils";


const getLocalForms: () => formData[] = () => {
  const savedFormsJSON = localStorage.getItem("savedForms");
  const persistantormFields = savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
  return persistantormFields;
};

const initializeState = async (form_id:number, dispatchFormCB: React.Dispatch<FormAction>) => {
  try {
    const parsedData = await getFormData(form_id);
    dispatchFormCB({type: "render_form", form: parsedData})
    console.log("dispatched", parsedData)
  } catch(error) {
    console.log(error)
  }
}

const saveFormData = async (currentState: formData) => {
  try {
    await patchFormData(currentState.id, {title:currentState.title, description: currentState.description, is_public:currentState.is_public})
  } catch(error) {
    console.log(error)
  }
};

const newFieldReducer = (
  state: newFieldType,
  action: NewFieldActions
): newFieldType => {
  switch (action.type) {
    case "change_text":
      return { label: action.value.label, type: state.type };
    case "clear_text":
      return { label: "", type: state.type };
    case "change_type":
      return { label: state.label, type: action.value.type };
    default:
      return { label: "", type: "text" };
  }
};

const getNewFormFields: (type: "TEXT" | "DROPDOWN" | "RADIO" | "GENERIC", label: string) => formField = (
  type,
  label
) => {
  switch (type) {
    case "TEXT":
      return {
        kind: "text",
        id: Number(new Date()),
        label: label,
        value: "",
        meta: {description: "text"}
      };
    // case "dropdown":
    //   return {
    //     kind: type as "dropdown",
    //     id: Number(new Date()),
    //     label: label,
    //     fieldType: type,
    //     options: [],
    //     value: "",
    //   };
    // case "radio":
    //   return {
    //     kind: type as "radio",
    //     id: Number(new Date()),
    //     label: label,
    //     fieldType: type,
    //     options: [],
    //     value: "",
    //   };
    // case "multiselect":
    //   return {
    //     kind: type as "multiselect",
    //     id: Number(new Date()),
    //     label: label,
    //     fieldType: type,
    //     options: [],
    //     value: "",
    //     selected: [],
    //   };
    // case "textarea":
    //   return {
    //     kind: "textarea",
    //     id: Number(new Date()),
    //     label: label,
    //     fieldType: type,
    //     value: "",
    //   };
    default:
      return {
        kind: "text",
        id: Number(new Date()),
        label: label,
        fieldType: type,
        value: "",
      };
  }
};

const reducer:(state: formData | null, action: FormAction) => formData|null  = (state: formData | null, action: FormAction) => {
  if(action.type === "render_form") {
    //renderinh=g will take place initially when the state is null. So if state === null condition is
    //placed below this. This should take place even if the form state is null 
    return {id: action.form.id, title: action.form.title, description: action.form.description, is_public: action.form.is_public,
      created_by: action.form.created_by, created_date: action.form.created_date, modified_date: action.form.modified_date}
  }
  if(state === null) return null

  switch (action.type) {
      case "update_title":
      return { ...state, title: action.title };
    default:
      return state
  }
};

const fieldsReducer: (fieldsState: formField[], action: FormAction) => formField[] = (fieldsState: formField[], action: FormAction) => {
  switch(action.type)  {
    case "add_field":
      const newFormField = getNewFormFields(action.kind, action.label);
      // action.callback();
      if (newFormField.label.length === 0) {
        return fieldsState;
      }
      return [...fieldsState, newFormField]
    case "remove_field":
      return fieldsState.filter((field) => field.id !== action.id)
    case "update_label":
      return fieldsState.map((field) =>
          field.id === action.id
            ? {
                ...field,
                label: action.content,
              }
            : {
                ...field,
              }
        )
    case "add_option":
      return fieldsState.map((field) =>
          field.id === action.id &&
          (field.kind === "DROPDOWN" ||
            field.kind === "RADIO")
            ? {
                ...field,
                options: [...field.options, ""],
              }
            : {
                ...field,
              }
        )
    case "remove_option":
      return fieldsState.map((field) =>
          field.id === action.id &&
          (field.kind === "DROPDOWN" ||
            field.kind === "RADIO")
            ? {
                ...field,
                options: field.options.filter(
                  (_option, index) => action.index !== index
                ),
              }
            : { ...field }
        )
    case "update_option":
      return fieldsState.map((field) =>
          field.id === action.id &&
          (field.kind === "DROPDOWN" ||
            field.kind === "RADIO" )
            ? {
                ...field,
                options: field.options.map((option, index) =>
                  action.index === index ? action.content : option
                ),
              }
            : {
                ...field,
              }
        )
    default:
      return fieldsState
  }
}

function Form(props: { id: number }) {
  const [state, dispatchForm] = useReducer(reducer, null)
  const [fieldsState, dispatchFields] = useReducer(fieldsReducer, [])
  const defaultNewField: newFieldType = {
    label: "",
    type: "text",
  };
  const [newField, dispatch] = useReducer(newFieldReducer, defaultNewField);
  //This will hold the id of the element which is expanded in the form
  //Elements like deopdown, radio button group, multiselect, can be expanded to see/edit options while creating form
  //Only 1 element can be expanded
  const [expandedElement, setExpandedElement] = useState(0);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeState(props.id, dispatchForm)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  useEffect(() => {
    document.title = "Form Editor";
    titleRef.current?.focus();

    return () => {
      document.title = "Home Page";
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      state && saveFormData(state);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

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
            value={state?.title}
            ref={titleRef}
            onChange={(e) =>
              dispatchForm({ type: "update_title", title: e.target.value })
            }
            className="peer relative w-full pt-5 px-2.5 pb-2.5 bg-transparent outline-none z-[1] invalid:text-transparent focus:text-black duration-500 flex-1"
          />
          <label className="absolute left-0 text-[#8f8f8f] pt-5 px-2.5 pb-2.5 peer-hover:text-[#45f3ff] peer-focus:text-[#45f3ff] peer-valid:text-[#45f3ff] peer-focus:-translate-y-8 peer-valid:-translate-y-8 peer-focus:text-[12px] peer-valid:text-[12px] duration-500">
            Form Title
          </label>
          <i className="peer-focus:h-11 peer-valid:h-11 absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff] duration-500"></i>
        </div>
        {fieldsState.map((field) => {
          switch (field.kind) {
            case "TEXT":
              return (
                <FieldSet
                  id={field.id}
                  key={field.id}
                  label={field.label}
                  value={field.value}
                  meta={{description: "text"}}
                  setLabelContentCB={(id, content) =>
                    dispatchFields({
                      type: "update_label",
                      id: id,
                      content: content,
                    })
                  }
                  removeFieldCB={(id) =>
                    dispatchFields({ type: "remove_field", id: id })
                  }
                />
              );
            case "DROPDOWN":
              switch(field.meta.description) {
                case "SINGLE":
                  return (
                    <div key={field.id}>
                      <div className="flex">
                        <DropDown
                          id={field.id}
                          key={field.id}
                          label={field.label}
                          value=""
                          options={field.options}
                          setLabelContentCB={(id, content) =>
                            dispatchFields({
                              type: "update_label",
                              id: id,
                              content: content,
                            })
                          }
                          removeFieldCB={(id) =>
                            dispatchFields({ type: "remove_field", id: id })
                          }
                          showOptionsCB={showOptions}
                        />
                        <button
                          onClick={() => {
                            dispatchForm({ type: "add_option", id: field.id });
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
                                dispatchFields({
                                  type: "update_option",
                                  id: field.id,
                                  index: ind,
                                  content: e.target.value,
                                })
                              }
                              className="peer relative w-full px-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
                            />
                            <button
                              className="z-[1] hidden pb-1 peer-hover:block peer-focus:block hover:block focus:block"
                              onClick={() =>
                                dispatchFields({
                                  type: "remove_option",
                                  id: field.id,
                                  index: ind,
                                })
                              }
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
                case "MULTIPLE":
                  return (
                    <div key={field.id}>
                      <div className="flex">
                        {/* <MultiSelect
                          id={field.id}
                          key={field.id}
                          label={field.label}
                          value={field.value}
                          selected={field.selected}
                          options={field.options}
                          setLabelContentCB={(id, content) =>
                            dispatchFields({
                              type: "update_label",
                              id: id,
                              content: content,
                            })
                          }
                          removeFieldCB={(id) =>
                            dispatchFields({ type: "remove_field", id: id })
                          }
                          showOptionsCB={showOptions}
                        /> */}
                        <button
                          onClick={() => {
                            dispatchFields({ type: "add_option", id: field.id });
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
                                dispatchFields({
                                  type: "update_option",
                                  id: field.id,
                                  index: ind,
                                  content: e.target.value,
                                })
                              }
                              className="peer relative w-full px-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
                            />
                            <button
                              className="z-[1] hidden peer-hover:block peer-focus:block pb-1"
                              onClick={() =>
                                dispatchFields({
                                  type: "remove_option",
                                  id: field.id,
                                  index: ind,
                                })
                              }
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
                            }
                            break
            case "RADIO":
              return (
                <div key={field.id}>
                  <div className="flex">
                    <RadioGroup
                      id={field.id}
                      key={field.id}
                      label={field.label}
                      value=""
                      options={field.options}
                      setLabelContentCB={(id, content) =>
                        dispatchFields({
                          type: "update_label",
                          id: id,
                          content: content,
                        })
                      }
                      removeFieldCB={(id) =>
                        dispatchFields({ type: "remove_field", id: id })
                      }
                      showOptionsCB={showOptions}
                    />
                    <button
                      onClick={() => {
                        dispatchFields({ type: "add_option", id: field.id });
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
                            dispatchFields({
                              type: "update_option",
                              id: field.id,
                              index: ind,
                              content: e.target.value,
                            })
                          }
                          className="peer relative w-full px-2.5 bg-transparent outline-none z-[1] focus:text-black flex-1"
                        />
                        <button
                          className="z-[1] hidden peer-hover:block peer-focus:block pb-1"
                          onClick={() =>
                            dispatchFields({
                              type: "remove_option",
                              id: field.id,
                              index: ind,
                            })
                          }
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
            // case "textarea":
            //   return (
            //     <TextArea
            //       id={field.id}
            //       key={field.id}
            //       type={field.fieldType}
            //       label={field.label}
            //       value={field.value}
            //       setLabelContentCB={(id, content) =>
            //         dispatchFields({
            //           type: "update_label",
            //           id: id,
            //           content: content,
            //         })
            //       }
            //       removeFieldCB={(id) =>
            //         dispadispatchFieldstchForm({ type: "remove_field", id: id })
            //       }
            //     />
            //   );
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
            dispatch({
              type: "change_text",
              value: { label: e.target.value, type: newField.type },
            });
          }}
        />
        <select
          value={newField.type}
          onChange={(e) => {
            dispatch({
              type: "change_type",
              value: {
                label: newField.label,
                type: e.target.value as textFieldType,
              },
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
          onClick={(_) =>
            dispatchForm({
              type: "add_field",
              label: newField.label,
              kind: newField.type,
              callback: () => dispatch({ type: "clear_text" }),
            })
          }

        >
          Add Field
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={(_e) => state && saveFormData(state)}
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
      </div>
    </div>
  );
}

export type { formData, formField };
export default Form;
export { getLocalForms, saveFormData };
