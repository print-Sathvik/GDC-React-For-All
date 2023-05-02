/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Submission, formField } from "../types/formTypes";
import { getFields, getSubmission } from "../utils/apiUtils";
import FieldSetPrev from "./preview/FieldSetPrev";
import RadioGroupPrev from "./preview/RadioGroupPrev";
import DropDownPrev from "./preview/DropDownPrev";
import MultiSelectPrev from "./preview/MultiSelectPrev";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import TextAreaPrev from "./preview/TextAreaPrev";
import Map from "./preview/MapFieldPrev";

const initializeState = async (
  fromId: number,
  submissionId: number,
  setStateCB: React.Dispatch<SetStateAction<Submission | null>>
) => {
  try {
    const submission = await getSubmission(fromId, submissionId);
    setStateCB(submission);
  } catch (error) {
    console.log(error);
  }
};

const initializeFormFields = async (
  formId: number,
  setFormFieldsCB: React.Dispatch<SetStateAction<formField[] | null>>
) => {
  try {
    const fields = await getFields(formId);
    setFormFieldsCB(fields.results);
  } catch (error) {
    console.log(error);
  }
};

export default function Preview(props: {
  formId: number;
  submissionId: number;
}) {
  // Setting the state to Submission with id in the url
  //currentField will contain the field that is rendered currently
  const [state, setState] = useState<Submission | null>(null);
  const [currentFieldIndex, setCurFieldIndex] = useState(0);
  const [formFields, setFormFields] = useState<formField[] | null>(null);

  useEffect(() => {
    initializeState(props.formId, props.submissionId, setState);
  }, []);

  useEffect(() => {
    initializeFormFields(props.formId, setFormFields);
  }, []);

  const navForm = useCallback(
    (e: KeyboardEvent) => {
      console.log(e.key, formFields?.length, currentFieldIndex);
      if (e.key === "ArrowRight" || e.key === "Enter") {
        formFields &&
          currentFieldIndex < formFields.length &&
          setCurFieldIndex(currentFieldIndex + 1);
      } else if (e.key === "ArrowLeft") {
        currentFieldIndex > 0 && setCurFieldIndex(currentFieldIndex - 1);
      }
    },
    [formFields, currentFieldIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", navForm);
    return () => {
      document.removeEventListener("keydown", navForm);
    };
  }, [navForm, state]);

  if (state === null) {
    return <div className="text-center">No submission exists at this URL</div>;
  }

  const renderField = (currentField: formField) => {
    if (currentField === null) return currentField;
    switch (currentField.kind) {
      case "TEXT":
        return currentField.meta.description !== "textarea" ? (
          <FieldSetPrev
            id={currentField.id}
            label={currentField.label}
            value={
              state.answers.find(
                (answer) => answer.form_field === currentField.id
              )?.value ?? ""
            }
          />
        ) : (
          <TextAreaPrev
            id={currentField.id}
            label={currentField.label}
            value={
              state.answers.find(
                (answer) => answer.form_field === currentField.id
              )?.value ?? ""
            }
          />
        );
      case "DROPDOWN":
        return currentField.meta.description === "SINGLE" ? (
          <DropDownPrev
            id={currentField.id}
            key={currentField.id}
            label={currentField.label}
            value={
              state.answers.find(
                (answer) => answer.form_field === currentField.id
              )?.value ?? ""
            }
            options={currentField.options}
          />
        ) : (
          <MultiSelectPrev
            id={currentField.id}
            key={currentField.id}
            label={currentField.label}
            value={
              state.answers.find(
                (answer) => answer.form_field === currentField.id
              )?.value ?? ""
            }
            options={currentField.options}
          />
        );
      case "RADIO":
        return (
          <RadioGroupPrev
            id={currentField.id}
            key={currentField.id}
            label={currentField.label}
            value={
              state.answers.find(
                (answer) => answer.form_field === currentField.id
              )?.value ?? ""
            }
            options={currentField.options}
          />
        );
      case "GENERIC":
        switch (currentField.meta.description) {
          case "address":
            return (
              <Map
                id={currentField.id}
                key={currentField.id}
                label={currentField.label}
                value={
                  state?.answers.find(
                    (answer) => answer.form_field === currentField.id
                  )?.value || ""
                }
              />
            );
        }
    }
  };

  if (formFields === null) {
    return <div className="text-center">Fetching form ....</div>;
  } else {
    return (
      <div>
        <h1 className="text-center font-bold">{state?.form?.title}</h1>
        <div>
          {currentFieldIndex <= formFields.length - 1 ? (
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
              onClick={(_) => setCurFieldIndex(currentFieldIndex - 1)}
              className="p-2 m-2"
            >
              <ArrowLeftCircleIcon className="w-8 h-8" />
            </button>
          )}
          {currentFieldIndex <= formFields.length - 1 && (
            <button
              onClick={(_) => setCurFieldIndex(currentFieldIndex + 1)}
              className="p-2 m-2 text-end float-right"
            >
              <ArrowRightCircleIcon className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    );
  }
}
