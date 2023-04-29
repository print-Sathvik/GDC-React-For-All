import { PaginationParams } from "../types/common";
import { Submission, formField } from "../types/formTypes";
import { Form, formData, patchPayload } from "../types/formTypes";

const API_BASE_URL = "https://tsapi.coronasafe.live/api/"

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"

export const request = async (endpoint: string, method: RequestMethod = "GET", data: any = {}) => {
  let url;
  let payload: string;
  if(method === "GET") {
    const requestParams = data ? `?${Object.keys(data).map(key => `${key}=${data[key]}`).join('&')}` : ""
    url = `${API_BASE_URL}${endpoint}${requestParams}`
    payload = ""
  } else {
    url = `${API_BASE_URL}${endpoint}`
    payload = data ? JSON.stringify(data) : ""
  }

  //Basic authentication
  //const auth = "Basic " + window.btoa("Sathvik:W6eQy7b8ubRi9iy");

  //Token Authentication
  const token = localStorage.getItem("token")
  const auth = token ? "Token " + token : ""

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth
    },
    body: (method !== "GET") ? payload : null
  });
  if(response.ok) {
    const jsonResponse = await response.json()
    return jsonResponse
  } else {
    const errorJson = await response.json();
    throw Error(errorJson);
  }
}

export const createForm = (form: Form) => {
  return request("forms/", "POST", form)
}

export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", {username, password})
}

export const me = async () => {
  const res = await request("users/me/", "GET")
  return res
}

export const listForms = (pageParams: PaginationParams) => {
  return request('forms/', 'GET', pageParams)
}

export const getFormData = async (form_pk: number) => {
  const response = await request(`forms/${form_pk}/`, 'GET')
  return response as formData
}

export const patchFormData = async (form_pk: number, data: patchPayload) => {
  return request(`forms/${form_pk}/`, "PATCH", data)
}

export const deleteForm = async (form_pk: number) => {
  return request(`forms/${form_pk}/`, "DELETE")
}

export const postField = async (form_pk: number, field: Omit<formField, "id">) => {
  return request(`forms/${form_pk}/fields/`, "POST", field)
}

export const getFields = async (form_pk: number) => {
  return request(`forms/${form_pk}/fields/`, 'GET')
}

export const patchField = async (form_pk: number, field: formField) => {
  return request(`forms/${form_pk}/fields/${field.id}/`, "PATCH", field)
}

export const deleteFieldreq = async (form_pk: number, field_id: number) => {
  return request(`forms/${form_pk}/fields/${field_id}/`, 'DELETE', {})
}

export const getSubmissions = async (form_pk: number) => {
  return request(`forms/${form_pk}/submission/`, 'GET')
}

export const getSubmission = async (form_pk: number, submission_id: number) => {
  return request(`forms/${form_pk}/submission/${submission_id}/`, 'GET')
}

export const getField = async (form_pk: number, field_id: number) => {
  return request(`forms/${form_pk}/fields/${field_id}/`, 'GET')
}

export const postSubmission =async (form_pk:number, submission:Submission) => {
  return request(`forms/${form_pk}/submission/`, "POST", submission)
}

export const getFormsCount = async () => {
  const allFormsData = await request(`forms/`, 'GET', {offset: 0, limit: 1})
  return allFormsData.count
}