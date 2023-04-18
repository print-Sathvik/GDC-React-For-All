import { useState, useEffect } from "react";
import { formField, getLocalForms, saveFormData } from "./Form";
import FieldSet from "./FieldSet";
import DropDown from "./DropDown";
import RadioGroup from "./RadioGroup";
import MultiSelect from "./MultiSelect";
import TextArea from "./TextArea";

interface previewFormData {
  id: number;
  title: string;
  currentFieldIndex: number;
  formFields: formField[];
}

//Answers are stored as an array of answerSetType where each answerSetType belongs to a form
interface answerSetType {
  formId: number;
  answers: { fieldId: number; answer: string | number[] }[];
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
      answer: field.kind === "multiselect" ? [] : "",
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
  //And setting answer state to null initially.
  //If url has correct form id, then state will not be undefined and the answer state will
  //then be set to the answerSetType data
  const [state, setState] = useState(() => initialState(props.id));
  const [answersState, setAnswersState] = useState<null | answerSetType>(null);

  useEffect(() => {
    state && setAnswersState(initialAnswersState(props.id, state))
  }, [state, props.id])

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

  const setMultiSelectContent = (id: number, ind: number) => {
    //this method will handle the change in multiselect element
    //The selected attribute stores indices of options selected
    state &&
      setState({
        ...state,
        formFields: state?.formFields.map((field) =>
          field.id === id && field.kind === "multiselect"
            ? {
                ...field,
                selected: field.selected.includes(ind)
                  ? field.selected.filter((optionIndex) => optionIndex !== ind)
                  : [...field.selected, ind],
                //If option is already stored the remove it(clickig on selected option means unselecting the option),
                //or else store it
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
          answerAndId.fieldId ===
            state.formFields[state.currentFieldIndex].id &&
          typeof answerAndId.answer === "object"
            ? {
                ...answerAndId,
                answer: answerAndId.answer.includes(ind)
                  ? answerAndId.answer.filter(
                      (optionIndex) => optionIndex !== ind
                    )
                  : [...answerAndId.answer, ind],
              }
            : answerAndId
        ),
      });
  };

  if (typeof state === "undefined") {
    return <div className="text-center">No Form exists at this URL</div>;
  } else if (state.formFields.length === 0) {
    return <div className="text-center">Nothing to fill!! Empty Form</div>;
  }

  const renderField = () => {
    const field = state.formFields[state.currentFieldIndex];
    switch (field.kind) {
      case "text":
        return (
          <FieldSet
            id={field.id}
            type={field.fieldType}
            label={field.label}
            value={field.value}
            setFieldContentCB={setFieldContent}
          />
        );
      case "dropdown":
        return (
          field.kind === "dropdown" && (
            <DropDown
              id={field.id}
              key={field.id}
              fieldType={field.fieldType}
              label={field.label}
              value={field.value}
              options={field.options}
              setFieldContentCB={setFieldContent}
            />
          )
        );
      case "radio":
        return (
          field.kind === "radio" && (
            <RadioGroup
              id={field.id}
              key={field.id}
              fieldType={field.fieldType}
              label={field.label}
              value={field.value}
              options={field.options}
              setFieldContentCB={setFieldContent}
            />
          )
        );
      case "multiselect":
        return (
          field.kind === "multiselect" && (
            <MultiSelect
              id={field.id}
              key={field.id}
              fieldType={field.fieldType}
              label={field.label}
              value={field.value}
              options={field.options}
              selected={field.selected}
              setMultiSelectContentCB={setMultiSelectContent}
            />
          )
        );
      case "textarea":
        return (
          field.kind === "textarea" && (
            <TextArea
              id={field.id}
              type={field.fieldType}
              label={field.label}
              value={field.value}
              setFieldContentCB={setFieldContent}
            />
          )
        );
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold">{state.title}</h1>
      <div>
        {state.currentFieldIndex <= state.formFields.length - 1 ? (
          renderField()
        ) : (
          <div className="text-center p-2 my-4">
            You have reached the end of this form
          </div>
        )}
      </div>
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
        {state.currentFieldIndex <= state.formFields.length - 1 && (
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
