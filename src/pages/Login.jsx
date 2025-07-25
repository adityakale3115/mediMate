// src/pages/LoginPage.js
import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      onLogin(res.user);
    } catch (err) {
      alert("Login Failed: " + err.message);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(res.user);
    } catch (err) {
      alert("Signup Failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      onLogin(res.user);
    } catch (err) {
      alert("Google Sign-In Failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleEmailLogin} className="auth-button">Login</button>
      <button onClick={handleSignup} className="auth-button">Sign Up</button>
      <button onClick={handleGoogleLogin} className="google-button">
        Sign in with Google
      </button>
    </div>
  );
}
