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
  | "radio";

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

type formField = TextField | DropdownField | RadioGroup;

export type { textFieldType, formField, formData, TextField, DropdownField };
