import React, { Component } from "react";

import {AuthLogin} from "./auth/auth";

const Login = () => {
  const { isAuthenticated, loginWithRedirect, logout } = AuthLogin();

  return (
    <div>
      {!isAuthenticated && (
        <button
          onClick={() =>
            loginWithRedirect({})
          }
        >
          Log in
        </button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default Login;
