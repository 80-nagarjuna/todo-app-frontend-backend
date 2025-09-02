import React, { useEffect, useState } from "react";
import Amplify from "aws-amplify";
import Auth from "@aws-amplify/auth";
import awsconfig from "./aws-exports"; // Make sure this exists

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  // Check if user is already signed in
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        setUser(currentUser);
        return Auth.currentSession();
      })
      .then((session) => {
        setToken(session.getAccessToken().getJwtToken());
      })
      .catch(() => {
        console.log("No user signed in");
      });
  }, []);

  const handleLogin = () => {
    Auth.federatedSignIn(); // opens Cognito Hosted UI
  };

  const handleLogout = () => {
    Auth.signOut()
      .then(() => {
        setUser(null);
        setToken("");
      })
      .catch((err) => console.log(err));
  };

  const callBackend = async () => {
    if (!token) {
      alert("You must be logged in!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setApiResponse(JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setApiResponse("Error calling backend");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AWS Cognito Auth Demo</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={callBackend} style={{ marginLeft: "10px" }}>
            Call Backend
          </button>
          <p>API Response: {apiResponse}</p>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login with Cognito</button>
        </div>
      )}
    </div>
  );
}

export default App;

