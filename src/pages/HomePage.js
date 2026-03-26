// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import { useComplaints, STATUS_COLORS } from "../context/ComplaintsContext";
import "./HomePage.css";

const STEPS = [
  { icon: "📸", title: "Snap a Photo", desc: "Capture the civic issue on your phone camera." },
  { icon: "📍", title: "Auto-GPS Location", desc: "Your exact coordinates are captured automatically." },
  { icon: "🗺️", title: "Drops on the Map", desc: "Your complaint is pinned live on the city map." },
  { icon: "✅", title: "Track to Resolution", desc: "Watch the status update from Reported → Resolved." },
];

const STATS_LABELS = ["Total Reports", "In Progress", "Resolved"];

export default function HomePage() {
  const { complaints } = useComplaints();
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const recent = complaints.slice(0, 3);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">🏙️ Civic Tech · Smart City Platform</div>
          <h1 className="hero-title">
            Your City.<br />
            <span className="hero-accent">Your Voice.</span>
          </h1>
          <p className="hero-desc">
            Report potholes, broken streetlights, garbage overflow and more —
            instantly pinned on a live public map with real-time status tracking.
          </p>
          <div className="hero-ctas">
            <Link to="/report" className="btn btn-primary hero-btn">
              📌 Report an Issue
            </Link>
            <Link to="/map" className="btn btn-outline hero-btn">
              🗺️ View Live Map
            </Link>
          </div>

          <div className="hero-stats">
            {[complaints.length, inProgress, resolved].map((val, i) => (
              <div className="stat-pill" key={i}>
                <span className="stat-num">{val}</span>
                <span className="stat-label">{STATS_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="map-preview">
            <div className="map-dot dot1">🔴</div>
            <div className="map-dot dot2">🟡</div>
            <div className="map-dot dot3">🟢</div>
            <div className="map-dot dot4">🔴</div>
            <div className="map-pulse" />
            <span className="map-label">Live City Map</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <p className="label-tag">⚡ Simple Process</p>
          <h2 className="section-title">How CivicPulse Works</h2>
          <p className="section-sub">Four steps to a cleaner, safer neighbourhood.</p>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">0{i + 1}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Complaints */}
      <section className="section recent-section">
        <div className="container">
          <p className="label-tag">🕐 Live Feed</p>
          <h2 className="section-title">Recent Reports</h2>
          <p className="section-sub">Latest issues submitted by citizens.</p>

          {recent.length === 0 ? (
            <div className="empty-state">
              <span>🏙️</span>
              <p>No complaints yet. Be the first to report!</p>
              <Link to="/report" className="btn btn-primary">Report an Issue</Link>
            </div>
          ) : (
            <div className="recent-grid">
              {recent.map((c) => (
                <div className="recent-card card" key={c.id}>
                  {c.imageUrl && (
                    <img src={c.imageUrl} alt={c.title} className="recent-img" />
                  )}
                  <div className="recent-body">
                    <div className="recent-meta">
                      <span className={`tag tag-${statusTag(c.status)}`}>
                        ● {c.status}
                      </span>
                      <span className="recent-date">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : ""}
                      </span>
                    </div>
                    <h3 className="recent-title">{c.title}</h3>
                    <p className="recent-desc">{c.description?.slice(0, 80)}…</p>
                    <p className="recent-authority">🏛️ {c.authority}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/dashboard" className="btn btn-outline">
              View All Reports →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function statusTag(s) {
  if (s === "Reported") return "red";
  if (s === "In Progress") return "amber";
  return "green";
}
