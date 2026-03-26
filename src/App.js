// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }        from "./context/AuthContext";
import { ComplaintsProvider }  from "./context/ComplaintsContext";
import ProtectedRoute          from "./components/ProtectedRoute";
import Navbar                  from "./components/Navbar";
import HomePage                from "./pages/HomePage";
import MapPage                 from "./pages/MapPage";
import ReportPage              from "./pages/ReportPage";
import DashboardPage           from "./pages/DashboardPage";
import LoginPage               from "./pages/LoginPage";
import SignupPage              from "./pages/SignupPage";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <ComplaintsProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public */}
                <Route path="/"       element={<HomePage />} />
                <Route path="/map"    element={<MapPage />} />
                <Route path="/login"  element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Logged-in users only */}
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <ReportPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin only */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ComplaintsProvider>
    </AuthProvider>
  );
}
