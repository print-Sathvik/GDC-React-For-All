import { formData, newFieldType, previewFormData, textFieldType } from "./formTypes";

type AddAction = {
  type: "add_field";
  kind: textFieldType;
  label: string;
  callback: () => void;
};

type UpdateTitleAction = {
  type: "update_title";
  title: string;
};

type RemoveAction = {
  type: "remove_field";
  id: number;
};

type UpdateLabelAction = {
  type: "update_label";
  id: number;
  content: string;
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
  form: formData
}

type FormAction =
  | AddAction
  | RemoveAction
  | UpdateTitleAction
  | UpdateLabelAction
  | UpdateLabelAction
  | AddOption
  | RemoveOption
  | UpdateOption
  
  |FormRenderAction

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

type AnswerValueAction = {
  type: "answer_value";
  id: number;
  content: string;
  formState: previewFormData;
};

type AnswerMultiSelectAction = {
  type: "answer_multiselect";
  id: number;
  index: number;
  formState: previewFormData;
};

type AnswerAction = AnswerValueAction | AnswerMultiSelectAction;

export type { FormAction, NewFieldActions, PreviewAction, AnswerAction };
