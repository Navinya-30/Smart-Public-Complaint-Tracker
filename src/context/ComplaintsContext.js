// src/context/ComplaintsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const STATUSES = ["Reported", "In Progress", "Resolved"];

export const STATUS_COLORS = {
  Reported: "#ef4444",
  "In Progress": "#f59e0b",
  Resolved: "#22c55e",
};

export const CATEGORIES = [
  { id: "pothole",     icon: "🕳️",  label: "Pothole",       authority: "Municipal Roads Dept." },
  { id: "garbage",    icon: "🗑️",  label: "Garbage",       authority: "Solid Waste Management" },
  { id: "streetlight",icon: "💡",  label: "Street Light",  authority: "Electricity Board" },
  { id: "water",      icon: "💧",  label: "Water Leakage", authority: "Water Supply Dept." },
  { id: "sewage",     icon: "🚽",  label: "Sewage",        authority: "Sanitation Dept." },
  { id: "encroachment",icon: "🏗️", label: "Encroachment",  authority: "Town Planning Dept." },
  { id: "noise",      icon: "📢",  label: "Noise",         authority: "Pollution Control Board" },
  { id: "other",      icon: "📌",  label: "Other",         authority: "General Administration" },
];

const STORAGE_KEY = "smart_tracker_complaints";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(complaints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ComplaintsContext = createContext(null);

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    setComplaints(loadFromStorage());
    setLoading(false);
  }, []);

  // Persist whenever complaints change
  useEffect(() => {
    if (!loading) {
      saveToStorage(complaints);
    }
  }, [complaints, loading]);

  // ── Submit a new complaint ──────────────────────────────────────────────────
  const submitComplaint = ({ title, description, category, lat, lng, imageFile, userId }) => {
    return new Promise((resolve) => {
      const cat = CATEGORIES.find((c) => c.id === category);

      // Convert image to base64 if provided (so it survives a page refresh)
      const saveComplaint = (imageDataUrl) => {
        const newComplaint = {
          id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          title,
          description,
          category,
          status: "Reported",
          authority: cat?.authority || "General Administration",
          lat: lat || null,
          lng: lng || null,
          imageUrl: imageDataUrl || null,
          votes: 0,
          userId: userId || null,
          createdAt: new Date().toISOString(),
        };

        setComplaints((prev) => [newComplaint, ...prev]);
        resolve(newComplaint);
      };

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => saveComplaint(reader.result);
        reader.onerror = () => saveComplaint(null);
        reader.readAsDataURL(imageFile);
      } else {
        saveComplaint(null);
      }
    });
  };

  // ── Update status ───────────────────────────────────────────────────────────
  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  // ── Upvote ──────────────────────────────────────────────────────────────────
  const upvote = (id, currentVotes) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, votes: (currentVotes || 0) + 1 } : c))
    );
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteComplaint = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ComplaintsContext.Provider
      value={{ complaints, loading, submitComplaint, updateStatus, upvote, deleteComplaint }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error("useComplaints must be used inside ComplaintsProvider");
  return ctx;
}