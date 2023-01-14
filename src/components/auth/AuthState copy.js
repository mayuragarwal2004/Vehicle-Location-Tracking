// import React from "react";
import React, { useContext, createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "./AuthContext";
import { auth } from "../../base";

// const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = () => {
//   const [currentUser, setcurrentUser] = useState();
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setcurrentUser(user);
//     });

//     return unsubscribe;
//   }, []);

//   const value = { currentUser };
  const value = "Hello World";

  return (
    <AuthProvider.Provider value={"value"}>
      <Outlet />
    </AuthProvider.Provider>
  );
}

export default AuthProvider;