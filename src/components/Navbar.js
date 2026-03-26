// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { pathname }               = useLocation();
  const navigate                   = useNavigate();
  const { currentUser, logout }    = useAuth();
  const [open, setOpen]            = useState(false);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/login");
  };

  // Base nav links visible to everyone
  const baseLinks = [
    { to: "/",    label: "Home"     },
    { to: "/map", label: "Live Map" },
  ];

  // Role-specific links (in the link list, not CTA)
  const roleLinks = currentUser?.role === "admin"
    ? [{ to: "/dashboard", label: "Dashboard" }]
    : currentUser
    ? [{ to: "/report", label: "My Reports" }]
    : [];

  const allLinks = [...baseLinks, ...roleLinks];

  // Single CTA button per role
  const cta = !currentUser
    ? { to: "/login",     label: "Sign In"        }
    : currentUser.role === "admin"
    ? { to: "/dashboard", label: "📊 Dashboard"   }
    : { to: "/report",    label: "📌 Report Issue" };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={close}>
          <span className="logo-icon">📍</span>
          <span className="logo-text">CivicPulse</span>
        </Link>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          {allLinks.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`nav-link ${pathname === l.to ? "active" : ""}`}
                onClick={close}
              >
                {l.label}
              </Link>
            </li>
          ))}

          {/* User info + logout when logged in */}
          {currentUser && (
            <li className="nav-user">
              <span className="nav-role-badge nav-role-badge--${currentUser.role}">
                {currentUser.role === "admin" ? "🛡️ Admin" : "👤 Citizen"}
              </span>
              <span className="nav-username">{currentUser.name}</span>
              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}

          {/* Single CTA */}
          <li>
            <Link to={cta.to} className="btn btn-primary nav-cta" onClick={close}>
              {cta.label}
            </Link>
          </li>
        </ul>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
