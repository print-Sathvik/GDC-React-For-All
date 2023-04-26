import { useRoutes } from "raviger";
import React from "react";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Form from "../components/Form";
import Home from "../components/Home";
import Preview from "../components/Preview";
import Login from "../components/Login";
import { User } from "../types/userTypes";

const routes = {
  "/": () => <Home />,
  "/login": () => <Login />,
  "/about": () => <About />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <Preview id={Number(formId)} />
  ),
};

export default function AppRouter(props: {currentUser:User}) {
  let routeResult = useRoutes(routes);
  return <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>;
}
