import React from "react";
import logo from "../logo.svg";

export default function Home(props: { openFormCB: () => void }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex">
        <img src={logo} alt="logo" className="h-48" />
        <div className="flex-1 flex justify-center items-center h-48">
          <p>Welcome to the Home Page</p>
        </div>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 my-4 rounded"
        onClick={props.openFormCB}
      >
        Open Form
      </button>
    </div>
  );
}
