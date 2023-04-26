type formData = {
  id: number;
  title: string;
  description: string | null
  is_public: boolean
  created_by: number
  created_date: string
  modified_date: string
};

type Form = {
  id?: number;
  title: string;
  description?: string
  is_public?: boolean
};

type Errors<T> = Partial<Record<keyof T, string>>

export const validateForm = (form: Form) => {
  const errors: Errors<Form> = {}
  if(form.title.length < 1) {
    errors.title = "Title is Required"
  }
  if(form.title.length > 100) {
    errors.title = "Title must be shorter than 100 characters"
  }
  return errors
}

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
  kind: "TEXT";
  id: number;
  label: string;
  value: string;
  meta: {description: "text" | "textarea" | "tel" | "password" | "email" | "url" | "time" | "date"}
};

type DropdownField = {
  kind: "DROPDOWN";
  id: number;
  label: string;
  options: string[];
  value: string;
  meta: {description: "SINGLE"}
};

type RadioGroup = {
  kind: "RADIO";
  id: number;
  label: string;
  options: string[];
  value: string;
};

type MultiSelect = {
  kind: "DROPDOWN";
  id: number;
  label: string;
  options: string[];
  value: number[];
  meta: {description: "MULTIPLE"}
};

type formField =
  | TextField
  | DropdownField
  | RadioGroup
  | MultiSelect

type newFieldType = { label: string; type: textFieldType };

type previewFormData = {
  id: number;
  title: string;
  currentFieldIndex: number;
  formFields: formField[];
};

type answerSetType = {
  formId: number;
  answers: { fieldId: number; answer: string | number[] }[];
};

type patchPayload = {
  title: string
  description: string | null,
  is_public: boolean
}

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
  Form,
  Errors,

  patchPayload
};












// type formData = {
//   id: number;
//   title: string;
//   formFields: formField[];
// };


// type Meta = {description: string | null}

// type TextField = {
//   kind: "TEXT";
//   id: number;
//   label: string;
//   value: string;
//   meta: {description: "text" | "textarea" | "tel" | "password" | "textarea"}
// };

// type DropdownField = {
//   kind: "DROPDOWN";
//   id: number;
//   label: string;
//   options: string[];
//   value: string;
//   meta: {description: "SIMPLE"}
// };

// type RadioGroup = {
//   kind: "RADIO";
//   id: number;
//   label: string;
//   options: string[];
//   value: string;
// };

// type MultiSelect = {
//   kind: "DROPDOWN";
//   id: number;
//   label: string;
//   options: string[];
//   selected: number[];
//   meta: {description: "MULTISELECT"}
// };

// type TextArea = {
//   kind: "textarea";
//   id: number;
//   label: string;
//   value: string;
// };

// type formField =
//   | TextField
//   | DropdownField
//   | RadioGroup
//   | MultiSelect

// type newFieldType = { label: string; kind:  };

// type previewFormData = {
//   id: number;
//   title: string;
//   currentFieldIndex: number;
//   formFields: formField[];
// };

// //Answers are stored as an array of answerSetType where each answerSetType belongs to a form
// type answerSetType = {
//   formId: number;
//   answers: { fieldId: number; answer: string | number[] }[];
// };

// export type {
//   textFieldType,
//   formField,
//   formData,
//   newFieldType,
//   TextField,
//   DropdownField,
//   RadioGroup,
//   MultiSelect,
//   previewFormData,
//   answerSetType,
//   Form,
//   Errors
// };
