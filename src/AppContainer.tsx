import React from "react";
import Header from "./Header";
import { User } from "./types/userTypes";

export default function AppContainer(props: {
  currentUser: User | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center">
      <div className="p-4 my-4 mx-auto max-w-lg bg-white shadow-lg rounded-xl">
        <Header currentUser={props.currentUser} />
        {props.children}
      </div>
    </div>
  );
}
