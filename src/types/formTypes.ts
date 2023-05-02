type formData = {
  id: number;
  title: string;
  description: string | null;
  is_public: boolean;
  created_by?: number;
  created_date?: string;
  modified_date?: string;
};

type Form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

type Errors<T> = Partial<Record<keyof T, string>>;

export const validateForm = (form: formData) => {
  const errors: Errors<Form> = {};
  if (form.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (form.title.length > 100) {
    errors.title = "Title must be shorter than 100 characters";
  }
  return errors;
};

type textFieldType =
  | "text"
  | "dropdown"
  | "radio"
  | "multiselect"
  | "email"
  | "date"
  | "time"
  | "tel"
  | "url"
  | "password"
  | "textarea"
  | "address";

type TextField = {
  kind: "TEXT";
  id: number;
  label: string;
  value: string;
  options: [];
  meta: {
    description:
      | "text"
      | "textarea"
      | "tel"
      | "password"
      | "email"
      | "url"
      | "time"
      | "date"
      | "address";
  };
};

type DropdownField = {
  kind: "DROPDOWN";
  id: number;
  label: string;
  options: string[];
  value: string;
  meta: { description: "SINGLE" };
};

type RadioGroup = {
  kind: "RADIO";
  id: number;
  label: string;
  options: string[];
  value: string;
  meta: {};
};

type MultiSelect = {
  kind: "DROPDOWN";
  id: number;
  label: string;
  options: string[];
  value: string;
  meta: { description: "MULTIPLE" };
};

type MapField = {
  kind: "GENERIC";
  id: number;
  label: string;
  options: string[];
  value: string;
  meta: { description: "address" };
};

type formField =
  | TextField
  | DropdownField
  | RadioGroup
  | MultiSelect
  | MapField;

type newFieldType = { label: string; type: textFieldType };

type previewFormData = {
  id: number;
  title: string;
  currentFieldIndex: number;
  formFields: formField[];
};

type patchPayload = {
  title: string;
  description: string | null;
  is_public: boolean;
};

type Answer = {
  form_field: number;
  value: string;
};

type Submission = {
  answers: Answer[];
  id?: number;
  form?: formData;
  created_date?: string;
};

type allSubmissions = {
  count: number;
  next?: string;
  previous?: string;
  results: Submission[];
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
  Form,
  Errors,
  patchPayload,
  Answer,
  Submission,
  allSubmissions,
};
