/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useEffect, useReducer, useState } from "react";
import { SubmitAction } from "../types/actionTypes";
import { Submission, formData, formField } from "../types/formTypes";
import { getFields, getFormData, postSubmission } from "../utils/apiUtils";
import { navigate } from "raviger";
import FieldSetPrev from "./preview/FieldSetPrev";
import RadioGroupPrev from "./preview/RadioGroupPrev";
import DropDownPrev from "./preview/DropDownPrev";
import MultiSelectPrev from "./preview/MultiSelectPrev";
import TextAreaPrev from "./preview/TextAreaPrev";
import { ArrowRightCircleIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/outline'


const initializeFormFields = async (formId: number, setFormFieldsCB: React.Dispatch<SetStateAction<formField[] | null>>) =>{
  try {
    const fields = await getFields(formId)
    setFormFieldsCB(fields.results)
  } catch (error) {
    console.log(error)
  }
}

const initializeForm = async (formId: number, setFormCB: React.Dispatch<SetStateAction<formData | null>>) => {
  try {
    const form = await getFormData(formId)
    setFormCB(form)
  } catch (error) {
    console.log(error)
  }
}

const saveSubmission = async (formId:number, submission: Submission) => {
  try {
    return await postSubmission(formId, submission)
  } catch (error) {
    console.log(error)
  }
};

const reducer: (state: Submission | null, action: SubmitAction) => Submission | null = (state, action) => {
  if(action.type === "render_newSubmission") {
    if(action.form === null) {return state}
    return {answers: [], form: action.form };
  }
  if (state === null) return null;
  switch (action.type) {
    case "update_answer":
      if(state.answers.find(answer => answer.form_field === action.field_id) === undefined) {
        //It means that the answer is not present in the answer[], so a new answer has to be added
        return {
          ...state,
          answers: [...state.answers, {form_field:action.field_id, value: action.answer}]
        }
      } else {
        return {
          ...state,
          answers: state?.answers.map((answer) =>
            answer.form_field === action.field_id
              ? {
                  ...answer,
                  value: action.answer,
                }
              : {
                  ...answer,
                }
          )
        }
      }
    case "update_multiselect":
      if(state.answers.find(answer => answer.form_field === action.field_id) === undefined) {
        return {
          ...state,
          answers: [...state.answers, {form_field:action.field_id, value: String(action.index)}]
        }
      }
      return {
        ...state,
        answers: state.answers.map((answer) => {
          return answer.form_field === action.field_id
            ? {
                ...answer,
                value: answer.value.split(" ").includes(String(action.index))
                  ? answer.value.split(" ").filter(
                      (optionIndex) => optionIndex !== String(action.index)
                    ).join(" ")
                  : answer.value + " " + String(action.index)
                //If option is already stored then remove it(clicking on selected option means unselecting the option),
                //or else store it
              }
            : {
                ...answer,
              }
            }
        )
      }
    default: return state
  }
};


export default function NewSubmission(props: { formId: number }) {
  // Setting the state to Submission without id
  // currentField will contain the field that is rendered currently
  const [state, dispatch] = useReducer(reducer, null)
  const [currentFieldIndex, setCurFieldIndex] = useState(0)
  const [formFields, setFormFields] = useState<formField[] | null>(null)
  const [form, setForm] = useState<formData | null>(null) //To pass form as a property in Submission object

  useEffect(() => {
    initializeForm(props.formId, setForm)
  }, [])


  useEffect(() => {
    dispatch({type: "render_newSubmission", form: form})
  }, [form])
  //form is always constant except in the start when it is changed from null to formData type.
  //Since state requires form, state should be initialized only after form is initialized

  useEffect(() => {
    initializeFormFields(props.formId, setFormFields)
  }, [])


  const renderField = (currentField: formField) => {
    if(currentField === null) return currentField
    switch (currentField.kind) {
      case "TEXT":
        return currentField.meta.description !== "textarea" ? (
          <FieldSetPrev
            id={currentField.id}
            label={currentField.label}
            value={state?.answers.find(answer => answer.form_field === currentField.id)?.value || ""}
            meta={currentField.meta}
            setFieldContentCB={(id, content) => {
              dispatch({ type: "update_answer", field_id: id, answer: content });
            }}
          />
        ) : (
          <TextAreaPrev
              id={currentField.id}
              label={currentField.label}
              value={state?.answers.find(answer => answer.form_field === currentField.id)?.value || ""}
              setFieldContentCB={(id, content) => {
                dispatch({ type: "update_answer", field_id: id, answer: content });
              }}
            />
        )
      case "DROPDOWN":
        return currentField.meta.description === "SINGLE" ? (
          currentField.kind === "DROPDOWN" && (
            <DropDownPrev
              id={currentField.id}
              key={currentField.id}
              label={currentField.label}
              value={state?.answers.find(answer => answer.form_field === currentField.id)?.value || ""}
              options={currentField.options}
              setFieldContentCB={(id, content) => {
                dispatch({ type: "update_answer", field_id: id, answer: content });
              }}
            />
          )
        ) : (
              <MultiSelectPrev
                id={currentField.id}
                key={currentField.id}
                label={currentField.label}
                options={currentField.options}
                value={state?.answers.find(answer => answer.form_field === currentField.id)?.value || ""}
                setMultiSelectContentCB={(id, ind) => {
                  dispatch({ type: "update_multiselect", field_id: id, index: ind });

                }}
              />
            );
      case "RADIO":
        return (
          currentField.kind === "RADIO" && (
            <RadioGroupPrev
              id={currentField.id}
              key={currentField.id}
              label={currentField.label}
              value={state?.answers.find(answer => answer.form_field === currentField.id)?.value || ""}
              options={currentField.options}
              setFieldContentCB={(id, content) => {
                dispatch({ type: "update_answer", field_id: id, answer: content });
              }}
            />
          )
        );
    }
  };

  if (formFields === null) {
    return <div className="text-center">Fetching form ....</div>;
  } else {
  return (
    <div>
      <h1 className="text-center font-bold">{state?.form?.title}</h1>
      <div>
        {currentFieldIndex <= formFields.length - 1? (
          formFields && renderField(formFields[currentFieldIndex])
        ) : (
          <div className="text-center p-2 my-4">
            You have reached the end of this form
          </div>
        )}
      </div>
      <div>
        {currentFieldIndex !== 0 && (
          <button
            onClick={_ => setCurFieldIndex(currentFieldIndex - 1)}
            className="p-2 m-2"
          >
            <ArrowLeftCircleIcon className="w-8 h-8" />
          </button>
        )}
        {currentFieldIndex <= formFields.length - 1 && (
          <button
            onClick={_ => setCurFieldIndex(currentFieldIndex + 1)}
            className="p-2 m-2 text-end float-right"
          >
            <ArrowRightCircleIcon className="w-8 h-8" />
          </button>
        )}
      </div>
      <button className="bg-blue-600 hover:bg-blue-800 rounded p-2 text-white font-bold"
      onClick={_ => {
        state && saveSubmission(props.formId, state).then(() => navigate(`/submissions/${props.formId}`)).catch(() => navigate(`/submissions/${props.formId}`))
        }}>
        Submit
      </button>
    </div>
  );
}
}