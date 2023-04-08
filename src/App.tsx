import React from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";
import FieldSet from "./FieldSet";

const formFields = [
  { id: 1, label: "First Name", type: "text" },
  { id: 2, label: "Last Name", type: "text" },
  { id: 3, label: "Email", type: "email" },
  { id: 4, label: "Date of Birth", type: "date" },
  { id: 5, label: "Phone Number", type: "tel" },
];

function App() {
  return (
    <AppContainer>
      <div className="p-4 mx-auto max-w-lg bg-white shadow-lg rounded-xl">
        <Header title="Welcome to Lesson 5 of $react-typescript with #tailwindcss" />
        {formFields.map((field) => (
          <FieldSet id={field.id} type={field.type} label={field.label} />
        ))}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-3 py-2 mt-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </AppContainer>
  );
}

export default App;
