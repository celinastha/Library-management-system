import React from "react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
    const [mode, setMode] = useState(null);
    const [input, setInput] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLibrarianLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
        try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        const token = await user.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/librarian");
        } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
        }
  };

  const handleBorrowerLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!input.trim()) {
      setError("Please enter your SSN or Card ID");
      return;
    }
    localStorage.setItem("borrowerId", input);
    navigate("/borrower");
  };

  const handleGuestAccess = () => {
    navigate("/guest");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!mode ? (
          <div className="welcome-screen">
            <h1 className="welcome-title">Welcome to Library System</h1>
            <p className="welcome-subtitle">Please select your role to continue</p>
            <div className="role-selection">
              <button
                className="role-button"
                onClick={() => setMode("librarian")}
              >
                <div className="role-content">
                  <h3>Librarian</h3>
                  <p>Access with email and password</p>
                </div>
              </button>
              <button
                className="role-button"
                onClick={() => setMode("borrower")}
              >
                <div className="role-content">
                  <h3>Borrower</h3>
                  <p>Login with SSN or Card ID</p>
                </div>
              </button>
              <button
                className="role-button role-button-guest"
                onClick={handleGuestAccess}
              >
                <div className="role-content">
                  <h3>Guest</h3>
                  <p>Browse without logging in</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="login-screen">
            <button
              className="back-to-selection"
              onClick={() => {
                setMode(null);
                setError("");
                setEmail("");
                setPassword("");
                setInput("");
              }}
            >
              ← Back to Selection
            </button>

        {mode === "librarian" && (
              <form onSubmit={handleLibrarianLogin} className="login-form">
                <h2 className="login-title">Librarian Login</h2>
                <p className="login-subtitle">Enter your credentials to access the system</p>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                <input
                    id="password"
                type="password"
                    className="form-input"
                    placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        )}

        {mode === "borrower" && (
              <form onSubmit={handleBorrowerLogin} className="login-form">
                <h2 className="login-title">Borrower Login</h2>
                <p className="login-subtitle">Enter your SSN or Card ID to continue</p>

                <div className="form-group">
                  <label htmlFor="borrower-id" className="form-label">
                    SSN or Card ID
                  </label>
                <input
                    id="borrower-id"
                    type="text"
                    className="form-input"
                    placeholder="Enter your SSN or Card ID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                    required
                />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="login-button">
                  Login
                </button>
            </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
