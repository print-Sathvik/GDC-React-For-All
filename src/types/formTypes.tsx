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

export type {
  textFieldType,
  formField,
  formData,
  TextField,
  DropdownField,
  RadioGroup,
  MultiSelect,
};
