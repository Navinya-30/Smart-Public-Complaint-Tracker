// src/pages/MapPage.js
import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useComplaints, STATUS_COLORS, CATEGORIES } from "../context/ComplaintsContext";
import { Link } from "react-router-dom";
import "./MapPage.css";

export default function MapPage() {
  const { complaints, loading } = useComplaints();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? complaints
    : complaints.filter((c) => c.status === filter);

  const center = [19.076, 72.877]; // Default: Mumbai

  return (
    <div className="map-page">
      <div className="map-sidebar">
        <div className="sidebar-header">
          <h2>🗺️ Live City Map</h2>
          <p>{filtered.length} issue{filtered.length !== 1 ? "s" : ""} visible</p>
        </div>

        <div className="filter-group">
          <label>Filter by Status</label>
          <div className="filter-btns">
            {["All", "Reported", "In Progress", "Resolved"].map((s) => (
              <button
                key={s}
                className={`filter-btn ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="legend">
          <label>Legend</label>
          {Object.entries(STATUS_COLORS).map(([s, c]) => (
            <div className="legend-item" key={s}>
              <span className="legend-dot" style={{ background: c }} />
              {s}
            </div>
          ))}
        </div>

        <div className="sidebar-list">
          {loading && <p className="loading-text">Loading complaints…</p>}
          {!loading && filtered.length === 0 && (
            <div className="sidebar-empty">
              <p>No complaints found.</p>
              <Link to="/report" className="btn btn-primary" style={{ marginTop: 12 }}>
                Be the first to report
              </Link>
            </div>
          )}
          {filtered.map((c) => (
            <SidebarCard key={c.id} complaint={c} />
          ))}
        </div>
      </div>

      <div className="map-area">
        {loading ? (
          <div className="map-loading">Loading map…</div>
        ) : (
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />
            {filtered.map((c) => (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={10}
                pathOptions={{
                  color: STATUS_COLORS[c.status] || "#3b82f6",
                  fillColor: STATUS_COLORS[c.status] || "#3b82f6",
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="popup-content">
                    {c.imageUrl && (
                      <img src={c.imageUrl} alt={c.title} className="popup-img" />
                    )}
                    <div className="popup-emoji">
                      {CATEGORIES.find((cat) => cat.id === c.category)?.icon || "📌"}
                    </div>
                    <strong>{c.title}</strong>
                    <p>{c.description?.slice(0, 80)}</p>
                    <span
                      className="popup-status"
                      style={{ color: STATUS_COLORS[c.status] }}
                    >
                      ● {c.status}
                    </span>
                    <p className="popup-authority">🏛️ {c.authority}</p>
                    <p className="popup-date">
                      {c.createdAt instanceof Date
                        ? c.createdAt.toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

function SidebarCard({ complaint: c }) {
  return (
    <div className="sidebar-card">
      <div className="sc-top">
        <span className="sc-icon">
          {CATEGORIES.find((cat) => cat.id === c.category)?.icon || "📌"}
        </span>
        <div>
          <div className="sc-title">{c.title}</div>
          <div className="sc-meta">
            <span
              className="sc-status"
              style={{ color: STATUS_COLORS[c.status] }}
            >
              ● {c.status}
            </span>
          </div>
        </div>
      </div>
      <div className="sc-authority">🏛️ {c.authority}</div>
    </div>
  );
}
