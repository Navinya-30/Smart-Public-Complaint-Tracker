// src/pages/ReportPage.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useComplaints, CATEGORIES } from "../context/ComplaintsContext";
import { useAuth } from "../context/AuthContext";
import "./ReportPage.css";

export default function ReportPage() {
  const { submitComplaint } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileRef = useRef();

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      (err) => {
        setError("Could not get location. Please enable GPS.");
        setLocLoading(false);
      }
    );
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !category || !location) {
      setError("Please fill in the title, select a category, and capture your location.");
      return;
    }

    setSubmitting(true);
    try {
      await submitComplaint({
        title,
        description,
        category,
        lat: location.lat,
        lng: location.lng,
        imageFile,
        userId: currentUser?.id || null,
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("Failed to submit. Please try again: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="report-success">
        <div className="success-icon">✅</div>
        <h2>Complaint Submitted!</h2>
        <p>Your issue has been pinned on the live map. Redirecting to dashboard…</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <h1>📌 Report a Civic Issue</h1>
          <p>Fill in the details below. Your report will be publicly visible on the live city map.</p>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>
          {/* Category */}
          <div className="form-group">
            <label>Issue Category <span className="req">*</span></label>
            <div className="category-grid">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`cat-btn ${category === c.id ? "selected" : ""}`}
                  onClick={() => setCategory(c.id)}
                >
                  <span className="cat-icon">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Issue Title <span className="req">*</span></label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="e.g. Large pothole on MG Road near bus stop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              className="form-input form-textarea"
              placeholder="Describe the issue in detail — size, severity, how long it's been there…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Photo Evidence</label>
            <div
              className="upload-zone"
              onClick={() => fileRef.current.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="img-preview" />
              ) : (
                <>
                  <span className="upload-icon">📷</span>
                  <p>Click to upload a photo</p>
                  <span className="upload-hint">JPG, PNG up to 5MB</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>GPS Location <span className="req">*</span></label>
            <div className="location-row">
              <button
                type="button"
                className={`btn btn-ghost loc-btn ${locLoading ? "loading" : ""}`}
                onClick={getLocation}
                disabled={locLoading}
              >
                {locLoading ? "⏳ Getting location…" : "📍 Capture My Location"}
              </button>
              {location && (
                <div className="loc-pill">
                  ✅ {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </div>
              )}
            </div>
            <p className="form-hint">We use your coordinates to pin the issue on the public map.</p>
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}

          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={submitting}
          >
            {submitting ? "⏳ Submitting…" : "🚀 Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
