import React, { useState } from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";
import Home from "./components/Home";
import Form from "./components/Form";

function App() {
  const [state, setState] = useState<string>("HOME");

  const openForm = (id: number) => {
    setState(String(id));
    console.log(id);
  };

  const closeForm: () => void = () => {
    setState("HOME");
  };

  return (
    <AppContainer>
      <div className="p-4 mx-auto max-w-lg bg-white shadow-lg rounded-xl">
        <Header title="React Forms" />
        {state === "HOME" ? (
          <Home openFormCB={openForm} />
        ) : (
          <Form closeFormCB={closeForm} id={Number(state)} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
