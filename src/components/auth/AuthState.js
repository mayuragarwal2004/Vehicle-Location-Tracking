// import React from "react";
import React, { useContext, createContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { auth } from "../../base";

const AuthState = (props) => {
  const [currentUser, setcurrentUser] = useState();
  const [currentUserRole, setcurrentUserRole] = useState();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setcurrentUser(user);
      user
        ?.getIdTokenResult()
        .then((idTokenResult) => setcurrentUserRole(idTokenResult.claims.role));
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, currentUserRole };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthState;
