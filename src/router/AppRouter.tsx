import { useRoutes } from "raviger";
import React, { useEffect, useState } from "react";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Form from "../components/Form";
import Home from "../components/Home";
import Preview from "../components/Preview";
import Login from "../components/Login";
import { User } from "../types/userTypes";
import Submissions from "../components/Submissions";
import NewSubmission from "../components/NewSubmission";
import { me } from "../utils/apiUtils";

const getCurrentUser: (
  setCurrentUser: (currentUser: User) => void
) => void = async (setCurrentUser) => {
  const currentUser = await me();
  setCurrentUser(currentUser);
};

export default function AppRouter() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  const routes = {
    "/": () => <Home currentUser={currentUser} />,
    "/login": () => <Login />,
    "/about": () => <About />,
    "/forms/:id": ({ id }: { id: string }) => (
      <Form id={Number(id)} currentUser={currentUser} />
    ),
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

  let routeResult = useRoutes(routes);
  return <AppContainer currentUser={currentUser}>{routeResult}</AppContainer>;
}
