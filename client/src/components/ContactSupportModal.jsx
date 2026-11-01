import { useState } from "react";
import { IconShield } from "./Icons.jsx";
import { api } from "../api.js";

export default function ContactSupportModal({ onClose, onSuccess }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Fees & Payments");
  const [urgency, setUrgency] = useState("Medium");
  const [busy, setBusy] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    try {
      const res = await api("/api/tickets/create", "POST", {
        query,
        category,
        urgency
      });
      setTicketId(res.ticket);
      if (onSuccess) onSuccess(res.ticket);
    } catch {}
    setBusy(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconShield size={20} color="#A65D7B" />
            <h3 className="modal-title">Contact Campus Helpdesk Staff</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {ticketId ? (
          <div>
            <div className="action-banner auto" style={{ margin: "14px 0" }}>
              <b>✓ Ticket Dispatched Successfully!</b>
              <div>Your ticket <b>{ticketId}</b> has been assigned to the {category} department.</div>
            </div>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
              A campus helpdesk officer will review your request and get back to you via your registered student email.
            </p>
            <div style={{ textAlign: "right", marginTop: "18px" }}>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
              If the AI assistant was unable to resolve your inquiry or if you have a special request, submit a ticket below directly to administrative staff.
            </p>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                Department / Category:
              </label>
              <select
                className="filter-select"
                style={{ width: "100%" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Fees & Payments">Fees & Payments (Accounts Section)</option>
                <option value="Attendance">Attendance (Dean Academic Affairs)</option>
                <option value="Examinations">Examinations & Hall Tickets</option>
                <option value="Assignments">Assignments & LMS Support</option>
                <option value="Hostel & Safety">Hostel & Campus Security (High Priority)</option>
                <option value="Technical Issues">IT & Portal Support</option>
                <option value="Other">General Student Services</option>
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                Urgency Level:
              </label>
              <select
                className="filter-select"
                style={{ width: "100%" }}
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="Low">Low - General query</option>
                <option value="Medium">Medium - Response needed this week</option>
                <option value="High">High - Urgent / Exam deadline or safety concern</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                Describe your inquiry:
              </label>
              <textarea
                rows={4}
                placeholder="Explain your situation in detail..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" className="btn" onClick={onClose} disabled={busy}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={busy || !query.trim()}>
                {busy ? "Submitting..." : "Submit Helpdesk Ticket"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

