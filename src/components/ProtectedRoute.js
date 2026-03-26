// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Usage:
 *   <ProtectedRoute>           – only logged-in users
 *   <ProtectedRoute role="admin"> – only admins
 */
export default function ProtectedRoute({ children, role }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Not logged in → send to login, remember where they came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    // Wrong role → redirect to appropriate home
    return <Navigate to={currentUser.role === "admin" ? "/dashboard" : "/"} replace />;
  }

  return children;
}
