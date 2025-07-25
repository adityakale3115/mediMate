import React, { useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";

export default function AuthModal({ onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      alert("Google Sign-in Error: " + err.message);
    }
  };

  const handleManualAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      alert("Auth Error: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleManualAuth}>
          {isRegistering ? "Register" : "Login"}
        </button>

        <div className="switch-auth">
          {isRegistering ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsRegistering(false)}>Login</span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsRegistering(true)}>Register</span>
            </p>
          )}
        </div>

        <hr />
        <button onClick={handleGoogleSignIn} className="btn-google">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
