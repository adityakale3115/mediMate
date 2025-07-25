// src/components/LoginModal.js
import React, { useState } from 'react';
import './LoginModal.css';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';

function LoginModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return false;
    }
    return true;
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      if (onLoginSuccess) onLoginSuccess(userCredential.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (onLoginSuccess) onLoginSuccess(result.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmailAuth();
    }
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal" onKeyDown={handleKeyPress} tabIndex="0">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="submit-button" onClick={handleEmailAuth} disabled={loading}>
          {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
        </button>

        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="toggle-link"
            disabled={loading}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>

        <hr />

        <button className="google-button" onClick={handleGoogleSignIn} disabled={loading}>
          <FcGoogle style={{ marginRight: 8 }} />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
