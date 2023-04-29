import React from "react";
import logo from "./logo.svg";
import { ActiveLink } from "raviger";
import { User } from "./types/userTypes";

export default function Header(props: { currentUser: User }) {
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
          ...(props.currentUser?.username?.length > 0
            ? [
                {
                  page: "Logout",
                  onClick: () => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  },
                },
              ]
            : [{ page: "Login", url: "/login" }]),
        ].map((link) =>
          link.url ? (
            <ActiveLink
              key={link.url}
              href={link.url}
              className="p-2 px-4 m-2 mx-4 hover:bg-blue-300"
              exactActiveClass="bg-blue-300"
            >
              {link.page}
            </ActiveLink>
          ) : (
            <button
              key={link.page}
              onClick={link.onClick}
              className="p-2 px-4 m-2 mx-4 hover:bg-blue-300"
            >
              {link.page}
            </button>
          )
        )}
      </div>
    </div>
  );
}
