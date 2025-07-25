import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginSuccess = () => {
    setShowModal(false); // close modal on login
  };

  return (
    <>
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        <NavLink to="/symptoms" className={({ isActive }) => (isActive ? "active" : "")}>Symptom Checker</NavLink>
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? "active" : "")}>Appointments</NavLink>
        <NavLink to="/uploads" className={({ isActive }) => (isActive ? "active" : "")}>Uploads</NavLink>

        {user ? (
          <>
            <span style={{ marginLeft: "1rem" }}>👤 {user.displayName}</span>
            <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
          </>
        ) : (
          <button onClick={() => setShowModal(true)} style={{ marginLeft: "1rem" }}>
            Login / Register
          </button>
        )}
      </nav>

      {showModal && (
        <LoginModal onClose={() => setShowModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default Navbar;
