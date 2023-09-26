import React, { useState } from "react";
import Axios from "axios";
import "../RegisterForm.css";
function RegisterForm({ onRegistration }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/checkUsername/${username}`
      );
      if (response.data.isTaken) {
        setIsUsernameTaken(true);
        return;
      }

      const userResp = await Axios.post("http://localhost:3001/registerUser", {
        username,
        password,
      });
      console.log("user", userResp.data);

      onRegistration(userResp.data.user);

      setUsername("");
      setPassword("");
      setIsUsernameTaken(false);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const userResp = await Axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      console.log("user", userResp.data);

      onRegistration(userResp.data.user);

      setUsername("");
      setPassword("");
      setIsUsernameTaken(false);
    } catch (error) {
      console.error("Error Logginf in  user:", error);
    }
  };

  return (
    <div className="register-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        required
        style={{ marginBottom: "10px" }}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        style={{ marginBottom: "10px" }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button-container">
        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
        {isUsernameTaken && (
          <p className="error-message">Username is already taken.</p>
        )}
        <span className="or-text">OR</span>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
