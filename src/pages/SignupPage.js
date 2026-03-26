// src/pages/SignupPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

const ROLES = [
  { id: "user",  icon: "👤", label: "Citizen",       desc: "Submit complaints" },
  { id: "admin", icon: "🛡️", label: "Administrator",  desc: "Manage all reports" },
];

export default function SignupPage() {
  const { signup, currentUser } = useAuth();
  const navigate = useNavigate();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("user");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  if (currentUser) {
    navigate(currentUser.role === "admin" ? "/dashboard" : "/", { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const result = signup({ name, email, password, role });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    navigate(role === "admin" ? "/dashboard" : "/", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏙️</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join CivicPulse and make your city better</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              className="auth-input"
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="su-email">Email address</label>
            <input
              id="su-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="su-password">Password</label>
            <input
              id="su-password"
              type="password"
              className="auth-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Account type</label>
            <div className="role-grid">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`role-btn ${role === r.id ? "selected" : ""}`}
                  onClick={() => setRole(r.id)}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span>{r.label}</span>
                  <span style={{ fontSize: "0.68rem", color: "inherit", opacity: 0.7 }}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
