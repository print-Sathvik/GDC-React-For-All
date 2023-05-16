import { useRoutes } from "raviger";
import React, { useEffect, useState } from "react";
import AppContainer from "../AppContainer";
import Form from "../components/Form";
import { User } from "../types/userTypes";
import { me } from "../utils/apiUtils";

const Home = React.lazy(() => import("../components/Home"));
const About = React.lazy(() => import("../components/About"));
const Preview = React.lazy(() => import("../components/Preview"));
const Login = React.lazy(() => import("../components/Login"));
const Submissions = React.lazy(() => import("../components/Submissions"));
const NewSubmission = React.lazy(() => import("../components/NewSubmission"));

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
    "/login": () => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <Login />
      </React.Suspense>
    ),
    "/about": () => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <About />
      </React.Suspense>
    ),
    "/forms/:id": ({ id }: { id: string }) => (
      <Form id={Number(id)} currentUser={currentUser} />
    ),
    "/submissions/:formId": ({ formId }: { formId: string }) => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <Submissions id={Number(formId)} />
      </React.Suspense>
    ),
    "/forms/:formId/submission/new": ({ formId }: { formId: string }) => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <NewSubmission formId={Number(formId)} />
      </React.Suspense>
    ),
    "/forms/:formId/submission/:submmissionId": ({
      formId,
      submmissionId,
    }: {
      formId: string;
      submmissionId: string;
    }) => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <Preview formId={Number(formId)} submissionId={Number(submmissionId)} />
      </React.Suspense>
    ),
  };

  let routeResult = useRoutes(routes);
  return <AppContainer currentUser={currentUser}>{routeResult}</AppContainer>;
}
