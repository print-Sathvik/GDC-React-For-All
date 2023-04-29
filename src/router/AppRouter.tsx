import { useRoutes } from "raviger";
import React from "react";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Form from "../components/Form";
import Home from "../components/Home";
import Preview from "../components/Preview";
import Login from "../components/Login";
import { User } from "../types/userTypes";
import Submissions from "../components/Submissions";
import NewSubmission from "../components/NewSubmission";

const routes = {
  "/": () => <Home />,
  "/login": () => <Login />,
  "/about": () => <About />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/submissions/:formId": ({ formId }: { formId: string }) => (
    <Submissions id={Number(formId)} />
  ),
  "/forms/:formId/submission/new": ({ formId }: { formId: string }) => (
    <NewSubmission formId={Number(formId)} />
  ),
  "/forms/:formId/submission/:submmissionId": ({
    formId,
    submmissionId,
  }: {
    formId: string;
    submmissionId: string;
  }) => (
    <Preview formId={Number(formId)} submissionId={Number(submmissionId)} />
  ),
};

export default function AppRouter(props: { currentUser: User }) {
  let routeResult = useRoutes(routes);
  return (
    <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
  );
}
