type formData = {
  id: number;
  title: string;
  formFields: formField[];
};

type textFieldType =
  | "text"
  | "email"
  | "date"
  | "time"
  | "tel"
  | "url"
  | "password"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "multiselect"
  | "textarea";

type TextField = {
  kind: "text";
  id: number;
  label: string;
  fieldType: textFieldType;
  value: string;
};

type DropdownField = {
  kind: "dropdown";
  id: number;
  label: string;
  fieldType: textFieldType;
  options: string[];
  value: string;
};

type RadioGroup = {
  kind: "radio";
  id: number;
  label: string;
  fieldType: textFieldType;
  options: string[];
  value: string;
};

type MultiSelect = {
  kind: "multiselect";
  id: number;
  label: string;
  fieldType: textFieldType;
  options: string[];
  value: string;
  selected: number[]; //stores indices of options selected
};

type TextArea = {
  kind: "textarea";
  id: number;
  label: string;
  fieldType: textFieldType;
  value: string;
};

type formField =
  | TextField
  | DropdownField
  | RadioGroup
  | MultiSelect
  | TextArea;

type newFieldType = { label: string; type: textFieldType };

type previewFormData = {
  id: number;
  title: string;
  currentFieldIndex: number;
  formFields: formField[];
};

//Answers are stored as an array of answerSetType where each answerSetType belongs to a form
type answerSetType = {
  formId: number;
  answers: { fieldId: number; answer: string | number[] }[];
};

export type {
  textFieldType,
  formField,
  formData,
  newFieldType,
  TextField,
  DropdownField,
  RadioGroup,
  MultiSelect,
  previewFormData,
  answerSetType,
};
