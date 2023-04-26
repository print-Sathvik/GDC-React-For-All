import { PaginationParams } from "../types/common";
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

export const listFields = (form_id: number) => {
  return request(`forms/${form_id}/fields/`, 'GET')
}

export const getFormData = async (form_id: number) => {
  const response = await request(`forms/${form_id}/`, 'GET')
  return response as formData
}

export const patchFormData = async (form_id: number, data: patchPayload) => {
  return request(`forms/${form_id}/`, "PATCH", data)
}