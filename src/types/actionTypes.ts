import {
  Submission,
  formData,
  formField,
  newFieldType,
  textFieldType,
} from "./formTypes";

type AddAction = {
  type: "add_field";
  form_id: number;
  fieldType: textFieldType;
  label: string;
  callback: () => void;
};

type UpdateTitleAction = {
  type: "update_title";
  title: string;
  description: string;
  is_public: boolean;
};

type UpdateLabelAction = {
  type: "update_label";
  id: number;
  content: string;
};

type RemoveFieldAction = {
  type: "remove_field";
  form_id: number;
  field_id: number;
};

type AddOption = {
  type: "add_option";
  id: number;
};

type RemoveOption = {
  type: "remove_option";
  id: number;
  index: number;
};

type UpdateOption = {
  type: "update_option";
  id: number;
  index: number;
  content: string;
};

type FormRenderAction = {
  type: "render_form";
  form: formData;
};

type FieldsRenderAction = {
  type: "render_fields";
  fields: formField[];
};

type FormAction =
  | AddAction
  | UpdateTitleAction
  | UpdateLabelAction
  | UpdateLabelAction
  | AddOption
  | RemoveOption
  | UpdateOption
  | FormRenderAction
  | FieldsRenderAction
  | RemoveFieldAction;

type UpdateAnswerAction = {
  type: "update_answer";
  field_id: number;
  answer: string;
};

type RenderSubmission = {
  type: "render_submission";
  submission: Submission;
};

type newSubmission = {
  type: "render_newSubmission";
  form: formData | null;
};

type MultiSelectUpdateAction = {
  type: "update_multiselect";
  field_id: number;
  index: number;
};

type SubmitAction =
  | UpdateAnswerAction
  | RenderSubmission
  | newSubmission
  | MultiSelectUpdateAction;

type ChangeText = {
  type: "change_text";
  value: newFieldType;
};

type ClearText = {
  type: "clear_text";
};

type ChangeType = {
  type: "change_type";
  value: newFieldType;
};

type NewFieldActions = ChangeText | ClearText | ChangeType;

type PreviewMultiSelectUpdate = {
  type: "update_multiselect";
  id: number;
  index: number;
};

type ChangeQuestion = {
  type: "prev_question" | "next_question";
};

type PreviewAction =
  | UpdateLabelAction
  | PreviewMultiSelectUpdate
  | ChangeQuestion;

export type { FormAction, NewFieldActions, PreviewAction, SubmitAction };
