import { useState, useEffect } from "react";
import { IconClock, IconSearch, IconFileText, IconChevronRight } from "./Icons.jsx";
import { api } from "../api.js";

export default function MyQueriesView({ onAskQuestion }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    api("/api/records")
      .then((recs) => setRecords(recs || []))
      .catch(() => setRecords([]));
  }, []);

  const filtered = records.filter((r) => {
    if (filter === "auto" && !r.action?.includes("AUTO-APPROVED")) return false;
    if (filter === "escalated" && !r.ticket) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.query?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.ticket?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="my-queries-layout">
      {/* Header */}
      <div className="page-header-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="page-icon-square">
            <IconClock size={22} color="#A65D7B" />
          </div>
          <div>
            <h2 className="page-title">My Inquiries & Query Tracking</h2>
            <p className="page-desc">
              Track the status of your queries, review drafted answers, and monitor tickets escalated to campus administration.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" }}>
          <div className="search-bar-container" style={{ width: "260px" }}>
            <IconSearch size={16} color="#A65D7B" className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search my queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Queries ({records.length})</option>
            <option value="auto">Auto-Approved Only</option>
            <option value="escalated">Escalated Tickets Only</option>
          </select>
        </div>
      </div>

      {/* Queries Table Card */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Question</th>
                <th>Category</th>
                <th>Urgency</th>
                <th>Confidence</th>
                <th>Status / Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id || r.id} onClick={() => setSelectedRecord(r)} style={{ cursor: "pointer" }}>
                  <td style={{ whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    {new Date(r.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: "280px" }}>{r.query}</td>
                  <td>
                    <span className="faq-cat-tag">{r.category}</span>
                  </td>
                  <td>
                    <span className={r.urgency === "High" ? "badge badge-high" : "badge badge-low"}>
                      {r.urgency}
                    </span>
                  </td>
                  <td>{Math.round((r.confidence || 0) * 100)}%</td>
                  <td>
                    {r.ticket ? (
                      <span className="badge badge-high">Ticket: {r.ticket} (Escalated)</span>
                    ) : (
                      <span className="badge badge-pass">Auto-Approved</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedRecord(r); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                    No queries found. Ask a question on the Home or Ask a Question page!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Query Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Query Processing Details</h3>
              <button className="modal-close-btn" onClick={() => setSelectedRecord(null)}>✕</button>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <b>Question:</b>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-mauve)", marginTop: "4px" }}>
                "{selectedRecord.query}"
              </div>
            </div>

            <div className="kv-grid" style={{ margin: "10px 0" }}>
              <div className="kv-item">
                <small>Category</small>
                <span>{selectedRecord.category}</span>
              </div>
              <div className="kv-item">
                <small>Confidence</small>
                <span>{Math.round((selectedRecord.confidence || 0) * 100)}%</span>
              </div>
              <div className="kv-item">
                <small>Urgency</small>
                <span>{selectedRecord.urgency}</span>
              </div>
              <div className="kv-item">
                <small>Rubric Score</small>
                <span>{selectedRecord.score} / 5</span>
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <b>Official Draft Response:</b>
              <div className="draft-box" style={{ marginTop: "6px" }}>
                {selectedRecord.draft}
              </div>
            </div>

            {selectedRecord.ticket && (
              <div className="action-banner escalated" style={{ marginTop: "14px" }}>
                <b>Staff Escalation Ticket: {selectedRecord.ticket}</b>
                <div>Status: OPEN • A campus helpdesk officer is reviewing this request.</div>
              </div>
            )}

            <div style={{ marginTop: "18px", textAlign: "right" }}>
              <button className="btn btn-primary" onClick={() => setSelectedRecord(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

