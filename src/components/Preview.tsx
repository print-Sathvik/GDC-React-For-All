import { useState, useEffect } from "react";
import { formField, getLocalForms, saveFormData } from "./Form";
import FieldSet from "../FieldSet";

interface previewFormData {
  id: number;
  title: string;
  currentFieldIndex: number;
  formFields: formField[];
}

//Answers are stored as an array of answerSetType where each answerSetType belongs to a form
interface answerSetType {
  formId: number;
  answers: { fieldId: number; answer: string }[];
}

const initialState: (id: number) => previewFormData | undefined = (id) => {
  const form = getLocalForms().find((form) => form.id === id);
  if (form === undefined) {
    return undefined;
  }
  return { ...form, currentFieldIndex: 0 };
};

const initialAnswersState: (
  id: number,
  formState: previewFormData
) => answerSetType = (id, formState) => {
  const savedAnswersJSON = localStorage.getItem("savedAnswers");
  const savedAnswers = savedAnswersJSON ? JSON.parse(savedAnswersJSON) : [];
  let answerSet = savedAnswers.find(
    (answers: answerSetType) => answers.formId === id
  );
  if (answerSet === undefined) {
    //Creating and Saving a new answerSet for current form if it does not exist in localStorage
    const answers = formState.formFields.map((field) => ({
      fieldId: field.id,
      answer: "",
    }));
    saveAnswersData({ formId: formState.id, answers });
    return { formId: formState.id, answers };
  } else if (answerSet.answers.length < formState.formFields.length) {
    //If a new field has been added after answering in preview mode, then the new state is also added to answers' localStorage
    const answers = formState.formFields.map((field) => ({
      fieldId: field.id,
      answer: field.value,
    }));
    saveAnswersData({ formId: formState.id, answers });
    return { formId: formState.id, answers };
  }
  return answerSet;
};

const saveAnswersData = (currentState: answerSetType) => {
  const savedAnswersJSON = localStorage.getItem("savedAnswers");
  const savedAnswers = savedAnswersJSON ? JSON.parse(savedAnswersJSON) : [];
  let updatedAnswers = savedAnswers.map((answerSet: answerSetType) =>
    answerSet.formId === currentState.formId ? currentState : answerSet
  );
  savedAnswers.find(
    (answerSet: answerSetType) => answerSet.formId === currentState.formId
  ) || updatedAnswers.push(currentState);
  localStorage.setItem("savedAnswers", JSON.stringify(updatedAnswers));
};

export default function Preview(props: { id: number }) {
  // Setting the state to index of first field
  const [state, setState] = useState(() => initialState(props.id));
  const [answersState, setAnswersState] = useState(
    () => state && initialAnswersState(props.id, state)
  );

  useEffect(() => {
    let timeout = setTimeout(() => {
      state && saveFormData(state);
      state && answersState && saveAnswersData(answersState);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state, answersState]);

  const setFieldContent = (id: number, content: string) => {
    //if state is not null(url is correct) this will handle the content change in the input fields
    //that is it will update answersState
    state &&
      setState({
        ...state,
        formFields: state?.formFields.map((field) =>
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

    state &&
      answersState &&
      setAnswersState({
        ...answersState,
        answers: answersState.answers.map((answerAndId) =>
          answerAndId.fieldId === state.formFields[state.currentFieldIndex].id
            ? { ...answerAndId, answer: content }
            : answerAndId
        ),
      });
  };

  if (typeof state === "undefined") {
    return <div className="text-center">No Form exists at this URL</div>;
  }
  return (
    <div>
      <h1 className="text-center font-bold">{state.title}</h1>
      <FieldSet
        id={state.formFields[state.currentFieldIndex].id}
        type={state.formFields[state.currentFieldIndex].type}
        label={state.formFields[state.currentFieldIndex].label}
        value={state.formFields[state.currentFieldIndex].value}
        setFieldContentCB={setFieldContent}
      />
      <div>
        {state.currentFieldIndex !== 0 && (
          <button
            onClick={() =>
              setState({
                ...state,
                currentFieldIndex: state.currentFieldIndex - 1,
              })
            }
            className="p-2 m-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
        {state.currentFieldIndex !== state.formFields.length - 1 && (
          <button
            onClick={() =>
              setState({
                ...state,
                currentFieldIndex: state.currentFieldIndex + 1,
              })
            }
            className="p-2 m-2 text-end float-right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
