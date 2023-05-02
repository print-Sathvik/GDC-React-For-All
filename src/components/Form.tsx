/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useReducer, useCallback } from "react";
import FieldSet from "./FormView/FieldSet";
import { Link, navigate } from "raviger";
import {
  formData,
  formField,
  newFieldType,
  textFieldType,
} from "../types/formTypes";
import DropDown from "./FormView/DropDown";
import RadioGroup from "./FormView/RadioGroup";
import MultiSelect from "./FormView/MultiSelect";
import TextArea from "./FormView/TextArea";
import { FormAction, NewFieldActions } from "../types/actionTypes";
import {
  deleteFieldreq,
  getFields,
  getFormData,
  patchField,
  postField,
} from "../utils/apiUtils";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Modal from "./common/Modal";
import EditForm from "./EditForm";
import { User } from "../types/userTypes";

const initializeState = async (
  form_id: number,
  dispatchFormCB: React.Dispatch<FormAction>
) => {
  try {
    const parsedData = await getFormData(form_id);
    dispatchFormCB({ type: "render_form", form: parsedData });
  } catch (error) {
    console.log(error);
  }
};

const initializeFields = async (
  form_id: number,
  dispatchFieldsCB: React.Dispatch<FormAction>
) => {
  try {
    const parsedFields = await getFields(form_id);
    dispatchFieldsCB({ type: "render_fields", fields: parsedFields.results });
  } catch (error) {}
};

const addField = async (form_id: number, newField: formField) => {
  try {
    const field = await postField(form_id, newField);
    return field.id;
  } catch (error) {
    console.log(error);
  }
};

const saveFields = async (form_id: number, fieldsState: formField[]) => {
  try {
    fieldsState.map(async (field) => await patchField(form_id, field));
  } catch (error) {
    console.log(error);
  }
};

const deleteField = async (form_id: number, field_id: number) => {
  try {
    await deleteFieldreq(form_id, field_id);
  } catch (error) {
    console.log(error);
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

const getNewFormFields: (type: textFieldType, label: string) => formField = (
  type,
  label
) => {
  switch (type) {
    case "text":
    case "email":
    case "date":
    case "time":
    case "tel":
    case "url":
    case "password":
      return {
        kind: "TEXT",
        id: Number(new Date()),
        label: label,
        value: "",
        options: [],
        meta: { description: type },
      };
    case "textarea":
      return {
        kind: "TEXT",
        id: Number(new Date()),
        label: label,
        value: "",
        options: [],
        meta: { description: "textarea" },
      };
    case "dropdown":
      return {
        kind: "DROPDOWN",
        id: Number(new Date()),
        label: label,
        options: [],
        value: "",
        meta: { description: "SINGLE" },
      };
    case "radio":
      return {
        kind: "RADIO",
        id: Number(new Date()),
        label: label,
        options: [],
        value: "",
        meta: {},
      };
    case "multiselect":
      return {
        kind: "DROPDOWN",
        id: Number(new Date()),
        label: label,
        options: [],
        value: "",
        meta: { description: "MULTIPLE" },
      };
    case "address":
      return {
        kind: "GENERIC",
        id: Number(new Date()),
        label: label,
        options: [],
        value: "",
        meta: { description: "address" },
      };
  }
};

const reducer: (
  state: formData | null,
  action: FormAction
) => formData | null = (state: formData | null, action: FormAction) => {
  if (action.type === "render_form") {
    //rendering will take place initially when the state is null. So if state === null condition is
    //placed below this. This should take place even if the form state is null
    return {
      id: action.form.id,
      title: action.form.title,
      description: action.form.description,
      is_public: action.form.is_public,
      created_by: action.form.created_by,
      created_date: action.form.created_date,
      modified_date: action.form.modified_date,
    };
  }
  if (state === null) return null;

  switch (action.type) {
    case "update_title":
      return {
        ...state,
        title: action.title,
        description: action.description,
        is_public: action.is_public,
      };
    default:
      return state;
  }
};

const fieldsReducer: (
  fieldsState: formField[],
  action: FormAction
) => formField[] = (fieldsState: formField[], action: FormAction) => {
  switch (action.type) {
    case "render_fields":
      return action.fields;
    case "add_field":
      const newFormField = getNewFormFields(action.fieldType, action.label);
      action.callback();
      if (newFormField.label.length === 0) {
        return fieldsState;
      }
      addField(action.form_id, newFormField)
        .then((fieldId) => (newFormField.id = fieldId))
        .catch((error) => {
          console.log(error);
          return fieldsState;
        });
      return [...fieldsState, newFormField];
    case "remove_field":
      deleteField(action.form_id, action.field_id);
      return fieldsState.filter((field) => field.id !== action.field_id);
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
      );
    case "add_option":
      return fieldsState.map((field) =>
        field.id === action.id &&
        (field.kind === "DROPDOWN" || field.kind === "RADIO")
          ? {
              ...field,
              options: [...field.options, ""],
            }
          : {
              ...field,
            }
      );
    case "remove_option":
      return fieldsState.map((field) =>
        field.id === action.id &&
        (field.kind === "DROPDOWN" || field.kind === "RADIO")
          ? {
              ...field,
              options: field.options.filter(
                (_option, index) => action.index !== index
              ),
            }
          : { ...field }
      );
    case "update_option":
      return fieldsState.map((field) =>
        field.id === action.id &&
        (field.kind === "DROPDOWN" || field.kind === "RADIO")
          ? {
              ...field,
              options: field.options.map((option, index) =>
                action.index === index ? action.content : option
              ),
            }
          : {
              ...field,
            }
      );
    default:
      return fieldsState;
  }
};

function Form(props: { id: number; currentUser: User }) {
  const [state, dispatchForm] = useReducer(reducer, null);
  const [fieldsState, dispatchFields] = useReducer(fieldsReducer, []);
  const [edit, setEdit] = useState<boolean>(false);
  const defaultNewField: newFieldType = {
    label: "",
    type: "text",
  };
  const [newField, dispatch] = useReducer(newFieldReducer, defaultNewField);
  //This will hold the id of the element which is expanded in the form
  //Elements like deopdown, radio button group, multiselect, can be expanded to see/edit options while creating form
  //Only 1 element can be expanded
  const [expandedElement, setExpandedElement] = useState(0);
  const [currentFocus, setCurrentFocus] = useState<number>(0);
  //currentFocus will save the index of field which is currently focussed(1st field by default)
  //so that focus can be changed based on keyboard events to navigate the form fields

  useEffect(() => {
    initializeState(props.id, dispatchForm);
    initializeFields(props.id, dispatchFields);
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFields(props.id, fieldsState);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [fieldsState]);

  const changeFocus = useCallback(
    (e: KeyboardEvent) => {
      console.log(e.key, fieldsState.length);
      if (e.key === "ArrowUp" && currentFocus > 0)
        setCurrentFocus((currentFocus) => currentFocus - 1);
      else if (
        (e.key === "ArrowDown" || e.key === "Enter") &&
        currentFocus < fieldsState.length - 1
      )
        setCurrentFocus((currentFocus) => currentFocus + 1);
      else if (e.key === "Escape") navigate("/");
    },
    [fieldsState, currentFocus]
  );

  useEffect(() => {
    document.addEventListener("keydown", changeFocus);
    return () => {
      document.removeEventListener("keydown", changeFocus);
    };
  }, [fieldsState, currentFocus]);

  const showOptions: (id: number) => void = (id) => {
    //If same element is clicked close it if its open, if different element is clicked, then open that element
    id === expandedElement ? setExpandedElement(0) : setExpandedElement(id);
  };

  if (props.currentUser?.username === "" || props.currentUser === null)
    return <p className="p-4">Please login to create/view forms</p>;

  return (
    <div className="flex flex-col gap-2 p-4 pt-0 divide-y-2 divide-dotted">
      <div>
        <div className="inputSet relative w-full mt-2 items-center justify-center flex">
          <h2 className="relative font-semibold px-2.5 flex-none">
            {state ? state.title : ""}
          </h2>
          <PencilSquareIcon
            onClick={() => setEdit(true)}
            className="w-5 h-5 flex-none cursor-pointer"
            color="blue"
          />
        </div>
        {state && (
          <Modal open={edit} closeCB={() => setEdit(false)}>
            <EditForm
              closeCB={() => setEdit(false)}
              form={state}
              setFormStateCB={(
                title: string,
                description: string,
                is_public: boolean
              ) => {
                dispatchForm({
                  type: "update_title",
                  title: title,
                  description: description,
                  is_public: is_public,
                });
              }}
            />
          </Modal>
        )}
        {fieldsState.map((field) => {
          switch (field.kind) {
            case "TEXT":
            case "GENERIC":
              return field.meta.description !== "textarea" ? (
                <FieldSet
                  id={field.id}
                  key={field.id}
                  label={field.label}
                  value={field.value}
                  focus={field.id === fieldsState[currentFocus].id}
                  meta={field.meta}
                  setLabelContentCB={(id, content) =>
                    dispatchFields({
                      type: "update_label",
                      id: id,
                      content: content,
                    })
                  }
                  removeFieldCB={(id) =>
                    dispatchFields({
                      type: "remove_field",
                      form_id: props.id,
                      field_id: id,
                    })
                  }
                />
              ) : (
                <TextArea
                  id={field.id}
                  key={field.id}
                  label={field.label}
                  value={field.value}
                  focus={field.id === fieldsState[currentFocus].id}
                  setLabelContentCB={(id, content) =>
                    dispatchFields({
                      type: "update_label",
                      id: id,
                      content: content,
                    })
                  }
                  removeFieldCB={(id) =>
                    dispatchFields({
                      type: "remove_field",
                      form_id: props.id,
                      field_id: id,
                    })
                  }
                />
              );
            case "DROPDOWN":
              return field.meta.description === "SINGLE" ? (
                <div key={field.id}>
                  <div className="flex">
                    <DropDown
                      id={field.id}
                      key={field.id}
                      label={field.label}
                      value=""
                      options={field.options}
                      focus={field.id === fieldsState[currentFocus].id}
                      setLabelContentCB={(id, content) =>
                        dispatchFields({
                          type: "update_label",
                          id: id,
                          content: content,
                        })
                      }
                      removeFieldCB={(id) =>
                        dispatchFields({
                          type: "remove_field",
                          form_id: props.id,
                          field_id: id,
                        })
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
                          <TrashIcon className="w-5 h-5" color="red" />
                        </button>
                        <i className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff]"></i>
                      </div>
                    ))}
                </div>
              ) : (
                <div key={field.id}>
                  <div className="flex">
                    <MultiSelect
                      id={field.id}
                      key={field.id}
                      label={field.label}
                      options={field.options}
                      focus={field.id === fieldsState[currentFocus].id}
                      value={field.value}
                      setLabelContentCB={(id, content) =>
                        dispatchFields({
                          type: "update_label",
                          id: id,
                          content: content,
                        })
                      }
                      removeFieldCB={(id) =>
                        dispatchFields({
                          type: "remove_field",
                          form_id: props.id,
                          field_id: id,
                        })
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
                          <TrashIcon className="w-5 h-5" color="red" />
                        </button>
                        <i className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff]"></i>
                      </div>
                    ))}
                </div>
              );
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
                      focus={field.id === fieldsState[currentFocus].id}
                      setLabelContentCB={(id, content) =>
                        dispatchFields({
                          type: "update_label",
                          id: id,
                          content: content,
                        })
                      }
                      removeFieldCB={(id) =>
                        dispatchFields({
                          type: "remove_field",
                          form_id: props.id,
                          field_id: id,
                        })
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
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                          <TrashIcon className="w-5 h-5" color="red" />
                        </button>
                        <i className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-[#45f3ff]"></i>
                      </div>
                    ))}
                </div>
              );
            default:
              return <div key="nofield">No such field exists</div>;
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
            "address",
            "password",
            "tel",
            "url",
            "range",
            "time",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className="bg-yellow-500 hover:bg-yellow-800 flex-shrink text-white font-bold p-2 my-4 ml-2 rounded"
          onClick={(_) =>
            dispatchFields({
              type: "add_field",
              form_id: props.id,
              label: newField.label,
              fieldType: newField.type,
              callback: () => dispatch({ type: "clear_text" }),
            })
          }
        >
          Add Field
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={(_e) => {
            saveFields(props.id, fieldsState);
          }}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-3 py-2 mt-4 mr-2 rounded"
        >
          Save
        </button>
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-800 text-white font-bold p-2 mt-4 mx-2 rounded"
        >
          Close
        </Link>
      </div>
    </div>
  );
}

export type { formData, formField };
export default Form;
