import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "us-east-1", // 🔹 your region
    userPoolId: "us-east-1_xxxxxxx", // 🔹 your User Pool ID
    userPoolWebClientId: "7jc9hfga5mmhm4e8tnht8p8akq", // 🔹 your App Client ID
    oauth: {
      domain: "us-east-1v56kyf0zh.auth.us-east-1.amazoncognito.com", // 🔹 your Cognito domain
      scope: ["email", "openid", "profile"],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "code", // 🔹 Authorization Code Flow
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

