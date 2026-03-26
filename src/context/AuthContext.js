// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const USERS_KEY  = "civic_users";
const SESSION_KEY = "civic_session";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getSession());

  // signup → returns { ok, error }
  const signup = ({ name, email, password, role }) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = {
      id:       `u_${Date.now()}`,
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password, // plain-text; fine for a hackathon / localStorage demo
      role,     // "admin" | "user"
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session);
    return { ok: true };
  };

  // login → returns { ok, error }
  const login = ({ email, password }) => {
    const users = getUsers();
    const user  = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Invalid email or password." };
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
