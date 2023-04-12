import React from "react";
import logo from "./logo.svg";

export default function Header(props: { title: string }) {
  return (
    <div className="flex gap-2 items-center w-[500px]">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="React logo"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <h1 className="text-center text-xl flex-1">{props.title}</h1>
    </div>
  );
}
