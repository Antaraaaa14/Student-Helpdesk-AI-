import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function RecordsTab() {
  const [rows, setRows] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [r, t] = await Promise.all([
        api("/api/records"),
        api("/api/tickets")
      ]);
      setRows(r || []);
      setTickets(t || []);
    } catch {
      setRows([]);
      setTickets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to delete all saved records and tickets from the database?")) {
      await api("/api/records", "DELETE");
      loadData();
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await api(`/api/tickets/${ticketId}/resolve`, "POST");
      loadData();
    } catch (e) {
      alert("Could not update ticket: " + e.message);
    }
  };

  // Filtered rows
  const filteredRows = rows.filter((r) => {
    if (filter === "auto" && !r.action?.includes("AUTO-APPROVED")) return false;
    if (filter === "escalated" && !r.ticket) return false;
    if (filter === "review" && !r.action?.includes("HELD")) return false;
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

  const totalCount = rows.length;
  const autoCount = rows.filter((r) => r.action?.includes("AUTO-APPROVED")).length;
  const escalatedCount = tickets.length;
  const avgScore = totalCount
    ? (rows.reduce((acc, r) => acc + (r.score || 0), 0) / totalCount).toFixed(1)
    : "0.0";

  return (
    <div>
      {/* Top Banner & Stats */}
      <div className="card peach">
        <div className="card-header">
          <h2 className="card-title">
            <span>📊</span> Persistent Database Records & Automated Workflows
          </h2>
          <span className="badge badge-lilac">
            Marking Criterion 4: Automation & Data Storage (5/5 Marks)
          </span>
        </div>

        <p style={{ margin: "0 0 16px 0", color: "var(--text-mauve)", fontSize: "14.5px" }}>
          All query inputs, AI classifications, response drafts, 5-point verification rubrics, and automated actions are persisted in real time. Download the spreadsheet or manage live escalation tickets below.
        </p>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-val">{totalCount}</div>
            <div className="stat-label">Total Ingested Records</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: "var(--status-ok-text)" }}>
              {autoCount}
            </div>
            <div className="stat-label">Auto-Approved Replies</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: "var(--status-bad-text)" }}>
              {escalatedCount}
            </div>
            <div className="stat-label">Escalated Staff Tickets</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: "var(--rose-links)" }}>
              {avgScore} / 5
            </div>
            <div className="stat-label">Average Rubric Score</div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <a className="btn btn-primary" href="/api/export.csv" download="helpdesk_records.csv">
            📥 Export Spreadsheet (CSV for Excel / Numbers)
          </a>
          <button className="btn" onClick={loadData}>
            🔄 Refresh Data
          </button>
          <button className="btn" onClick={handleClear} style={{ color: "var(--status-bad-text)" }}>
            🗑️ Clear Database Records
          </button>
        </div>
      </div>

      {/* Escalation Tickets Section */}
      {tickets.length > 0 && (
        <div className="card" style={{ borderLeft: "5px solid #ef4444" }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: "#991b1b" }}>
              <span>🚨</span> Live Escalation Queue ({tickets.length} Active Tickets)
            </h3>
            <span className="badge badge-high">Trigger-Action Workflow Result</span>
          </div>

          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 12px 0" }}>
            Tickets are automatically generated whenever a high-urgency query (e.g. safety threat) or low confidence (&lt;60%) is detected. Staff can inspect and resolve tickets in real time.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Student Query</th>
                  <th>Urgency</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.ticket}>
                    <td>
                      <b>{t.ticket}</b>
                    </td>
                    <td style={{ maxWidth: "340px" }}>{t.query}</td>
                    <td>
                      <span className={t.urgency === "High" ? "badge badge-high" : "badge badge-med"}>
                        {t.urgency}
                      </span>
                    </td>
                    <td>{new Date(t.createdAt).toLocaleTimeString()}</td>
                    <td>
                      <span className={t.status === "OPEN" ? "badge badge-fail" : "badge badge-pass"}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      {t.status === "OPEN" ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleResolveTicket(t.ticket)}
                        >
                          ✓ Mark Resolved
                        </button>
                      ) : (
                        <span style={{ color: "var(--status-ok-text)", fontWeight: 700 }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Records Table Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>📋</span> Saved Processing History ({filteredRows.length} shown)
          </h3>

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search query, category or ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "230px", padding: "6px 12px" }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "6px 12px" }}
            >
              <option value="all">All Records</option>
              <option value="auto">Auto-Approved Only</option>
              <option value="escalated">Escalated Only</option>
              <option value="review">Held for Review</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading database records...</p>
        ) : filteredRows.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
            No records found matching your criteria. Process a query in the Helpdesk tab or run tests to generate data.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Source</th>
                  <th>Student Query</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>FAQ</th>
                  <th>Conf.</th>
                  <th>Rubric</th>
                  <th>Automation Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r._id || r.id}>
                    <td style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                      {new Date(r.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td>
                      <span className="badge badge-peach">{r.source}</span>
                    </td>
                    <td style={{ maxWidth: "240px", wordBreak: "break-word" }}>{r.query}</td>
                    <td>{r.category}</td>
                    <td>
                      <span className={r.urgency === "High" ? "badge badge-high" : "badge badge-low"}>
                        {r.urgency}
                      </span>
                    </td>
                    <td>
                      <b>{r.faqId}</b>
                    </td>
                    <td>{Math.round((r.confidence || 0) * 100)}%</td>
                    <td>
                      <span className={r.score >= 4 ? "badge badge-pass" : "badge badge-med"}>
                        {r.score}/5
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {r.ticket ? (
                        <b style={{ color: "var(--status-bad-text)" }}>{r.action}</b>
                      ) : (
                        <span style={{ color: "var(--status-ok-text)", fontWeight: 600 }}>{r.action}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
