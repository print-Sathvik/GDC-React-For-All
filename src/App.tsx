import React, { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter";
import { me } from "./utils/apiUtils";
import { User } from "./types/userTypes";

const getCurrentUser: (
  setCurrentUser: (currentUser: User) => void
) => void = async (setCurrentUser) => {
  const currentUser = await me();
  setCurrentUser(currentUser);
};

function App() {
  const [currentUser, setCurrentUser] = useState<User>(null);
  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  return <AppRouter currentUser={currentUser} />;
}

export default App;
