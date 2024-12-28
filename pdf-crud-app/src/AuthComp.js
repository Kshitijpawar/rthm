import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authObj } from "./firebase"; // Ensure this points to your Firebase configuration file
import { useNavigate } from "react-router-dom";
const AuthComp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authObj,
        email,
        password
      );
      console.log("User signed up successfully:", userCredential.user);
      alert("Signup successful! Welcome!");
      navigate("/setlists");
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        authObj,
        email,
        password
      );
      console.log("User logged in successfully:", userCredential.user);
      alert("Login successful! Welcome back!");
      navigate("/setlists");
    } catch (error) {
      console.error("Error during login:", error.message);
      alert(error.message);
    }
  };

  return (
    // <div style={{ textAlign: "center", marginTop: "50px" }}>
    <div className="create">
      <h2>{isLogin ? "Login" : "Sign Up"} Page</h2>
      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {!isLogin && (
          <div style={{ marginBottom: "10px" }}>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        )}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "#007BFF",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthComp;
