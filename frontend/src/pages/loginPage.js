import React, { useState } from "react";
import useLogin from "../hooks/useLogin.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./loginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleSubmit = () => {
    const validation = true; // Add real validation logic
    if (validation) {
      login({ email, password });
    } else {
      toast.error("Validation failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <h1>Login to your account</h1>
        <p>
          Don't have an account yet? <Link to="/signup">Signup</Link>
        </p>

        <div className="input-group">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
          />
        </div>
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
