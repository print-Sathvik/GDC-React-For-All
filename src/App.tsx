import React, { useState } from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";
import Home from "./components/Home";
import Form from "./components/Form";

function App() {
  const [state, setState] = useState<string>("HOME");

  const openForm: () => void = () => {
    setState("FORM");
  };

  const closeForm: () => void = () => {
    setState("HOME");
  };

  return (
    <AppContainer>
      <div className="p-4 mx-auto max-w-lg bg-white shadow-lg rounded-xl">
        <Header title="Welcome to Lesson 5 of $react-typescript with #tailwindcss" />
        {state === "HOME" ? (
          <Home openFormCB={openForm} />
        ) : (
          <Form closeFormCB={closeForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
