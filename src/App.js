import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Uploads from "./pages/Uploads";
import Profile from "./pages/Profile"; // ✅ Add Profile Page
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Chatbot from "./components/ChatBot";
import logo from "./assets/logo.png";
import './index.css';

import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <img src={logo} alt="MediMate.Ai Logo" />
          <div className="header-title">MediMate.Ai</div>
        </header>

        {/* Navigation */}
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/availabledoctors" className={({ isActive }) => isActive ? "active" : ""}>Doctors</NavLink>
          <NavLink to="/appointments" className={({ isActive }) => isActive ? "active" : ""}>Appointments</NavLink>
          <NavLink to="/uploads" className={({ isActive }) => isActive ? "active" : ""}>Uploads</NavLink>
          <NavLink to="/chatbot" className={({ isActive }) => isActive ? "active" : ""}>Chatbot</NavLink>

          {user ? (
            <>
              {/* ✅ 👤 Name Redirects to Profile */}
              <NavLink
                to="/profile"
                style={{
                  marginLeft: "1rem",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                👤 {user.displayName}
              </NavLink>
              <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ marginLeft: "1rem" }}>
              Sign in / Register
            </button>
          )}
        </nav>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}

        {/* Page Content */}
        <div className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/availabledoctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/profile" element={<Profile />} /> {/* ✅ Add Profile Route */}
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
