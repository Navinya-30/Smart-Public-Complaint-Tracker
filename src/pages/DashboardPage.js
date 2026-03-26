// src/pages/DashboardPage.js
import React, { useState, useMemo } from "react";
import { useComplaints, CATEGORIES, STATUS_COLORS, STATUSES } from "../context/ComplaintsContext";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { complaints, loading, updateStatus, upvote } = useComplaints();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter]     = useState("All");
  const [sortNewest, setSortNewest]   = useState(true);

  // Scope to user's own complaints if not admin
  const scopedComplaints = isAdmin
    ? complaints
    : complaints.filter((c) => c.userId === currentUser?.id);

  const filtered = useMemo(() => {
    let list = scopedComplaints.filter((c) => {
      const matchSearch =
        !search ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchCat    = catFilter === "All"    || c.category === catFilter;
      return matchSearch && matchStatus && matchCat;
    });

    // Sort by createdAt
    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return sortNewest ? db - da : da - db;
    });

    return list;
  }, [scopedComplaints, search, statusFilter, catFilter, sortNewest]);

  const total      = scopedComplaints.length;
  const inProgress = scopedComplaints.filter((c) => c.status === "In Progress").length;
  const resolved   = scopedComplaints.filter((c) => c.status === "Resolved").length;
  const reported   = scopedComplaints.filter((c) => c.status === "Reported").length;

  return (
    <div className="dashboard">
      <div className="dash-container">
        <div className="dash-header">
          <div className="dash-header-top">
            <h1>📊 {isAdmin ? "Admin Dashboard" : "My Complaints"}</h1>
            <span className={`role-badge ${isAdmin ? "role-badge--admin" : "role-badge--user"}`}>
              {isAdmin ? "🛡️ Admin" : "👤 Citizen"}
            </span>
          </div>
          <p>{isAdmin
            ? "All citizen-submitted issues with real-time status tracking."
            : "Your submitted complaints and their current status."}
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: "Total Reports", val: total,      color: "blue"  },
            { label: "Reported",      val: reported,   color: "red"   },
            { label: "In Progress",   val: inProgress, color: "amber" },
            { label: "Resolved",      val: resolved,   color: "green" },
          ].map((s) => (
            <div className={`stat-card stat-${s.color}`} key={s.label}>
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + Sort */}
        <div className="dash-filters">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search complaints…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-row">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select
              className="filter-select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>

            <button
              className="btn btn-ghost sort-btn"
              onClick={() => setSortNewest((v) => !v)}
              title="Toggle sort order"
            >
              {sortNewest ? "🕒 Newest First" : "🕐 Oldest First"}
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="results-info">
            Showing <strong>{filtered.length}</strong> of <strong>{total}</strong> complaints
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="dash-loading">Loading complaints…</div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">
            {total === 0 ? "No complaints yet. Be the first to report an issue! 🚀" : "No complaints match your filters."}
          </div>
        ) : (
          <div className="complaints-grid">
            {filtered.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                onStatusChange={updateStatus}
                onUpvote={upvote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Complaint Card ────────────────────────────────────────────────────────────

function ComplaintCard({ complaint: c, onStatusChange, onUpvote }) {
  const cat = CATEGORIES.find((x) => x.id === c.category);

  // Next status in the flow
  const statusFlow = STATUSES;
  const currentIdx = statusFlow.indexOf(c.status);
  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  const formattedDate = c.createdAt
    ? new Date(c.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "";

  const statusClass = statusTagClass(c.status);

  return (
    <div className="cc card">
      <div className="cc-top">
        {c.imageUrl && <img src={c.imageUrl} alt={c.title} className="cc-img" />}
        <div className="cc-body">
          <div className="cc-header">
            <span className="cc-icon">{cat?.icon || "📌"}</span>
            <span className={`tag tag-${statusClass}`}>
              ● {c.status}
            </span>
            <span className="cc-cat-label">{cat?.label || "Other"}</span>
          </div>

          <h3 className="cc-title">{c.title}</h3>
          {c.description && <p className="cc-desc">{c.description}</p>}

          <div className="cc-meta">
            <span className="cc-authority">🏛️ {c.authority}</span>
            {c.lat && <span>📍 {c.lat.toFixed(3)}, {c.lng.toFixed(3)}</span>}
            <span>🗓️ {formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="cc-actions">
        {/* Upvote */}
        <button
          className="btn btn-ghost upvote-btn"
          onClick={() => onUpvote(c.id, c.votes || 0)}
          title="Upvote this issue"
        >
          👍 {c.votes || 0}
        </button>

        {/* Quick advance button */}
        {nextStatus && (
          <button
            className="btn-advance"
            style={{ "--adv-color": STATUS_COLORS[nextStatus] }}
            onClick={() => onStatusChange(c.id, nextStatus)}
            title={`Mark as ${nextStatus}`}
          >
            ▶ Mark "{nextStatus}"
          </button>
        )}

        {/* All status buttons */}
        <div className="status-change">
          <span className="status-label">Status:</span>
          <div className="status-btns">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`status-btn ${c.status === s ? "active" : ""}`}
                style={
                  c.status === s
                    ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s], background: STATUS_COLORS[s] + "20" }
                    : {}
                }
                onClick={() => onStatusChange(c.id, s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function statusTagClass(s) {
  if (s === "Reported")   return "red";
  if (s === "In Progress") return "amber";
  return "green";
}
