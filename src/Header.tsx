import React from "react";
import logo from "./logo.svg";
import { ActiveLink } from "raviger";

export default function Header() {
  return (
    <div className="flex gap-2 items-center w-[500px]">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="React logo"
        style={{ animation: "spin 2s linear infinite" }}
      />
      <div className="flex gap-2 items-center">
        {[
          { page: "Home", url: "/" },
          { page: "About", url: "/about" },
        ].map((link) => (
          <ActiveLink
            key={link.url}
            href={link.url}
            className="p-2 px-4 m-2 mx-4 hover:bg-blue-300"
            exactActiveClass="bg-blue-300"
          >
            {link.page}
          </ActiveLink>
        ))}
      </div>
    </div>
  );
}
