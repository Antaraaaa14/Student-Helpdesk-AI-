import { useState, useEffect } from "react";
import {
  IconBarChart,
  IconShield,
  IconFileText,
  IconClock,
  IconSparkles,
  IconSettings
} from "./Icons.jsx";
import { api } from "../api.js";

export default function AdminDashboardView() {
  const [analytics, setAnalytics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [conflicts, setConflicts] = useState(null);
  const [extractedFaqs, setExtractedFaqs] = useState([]);
  const [docText, setDocText] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState("overview");
  const [replyText, setReplyText] = useState({});
  const [busy, setBusy] = useState(false);

  const loadAdminData = async () => {
    try {
      const [an, tk] = await Promise.all([
        api("/api/analytics"),
        api("/api/tickets")
      ]);
      setAnalytics(an);
      setTickets(tk || []);
    } catch {}
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleResolve = async (ticketId) => {
    await api(`/api/tickets/${ticketId}/resolve`, "POST");
    loadAdminData();
  };

  const handleReplyTicket = async (ticketId) => {
    const text = replyText[ticketId];
    if (!text || !text.trim()) return;
    await api(`/api/tickets/${ticketId}/reply`, "POST", { reply: text });
    setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
    loadAdminData();
  };

  const runConflictDetection = async () => {
    setBusy(true);
    try {
      const res = await api("/api/faqs/detect-conflicts", "POST");
      setConflicts(res);
    } catch {}
    setBusy(false);
  };

  const runDocExtraction = async () => {
    setBusy(true);
    try {
      const res = await api("/api/faqs/extract-from-doc", "POST", {
        text: docText || "Sample campus handbook text",
        filename: "Campus_Academic_Handbook_2026.pdf"
      });
      setExtractedFaqs(res.suggestedFaqs || []);
    } catch {}
    setBusy(false);
  };

  return (
    <div className="admin-page-layout">
      {/* Header */}
      <div className="page-header-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="page-icon-square">
            <IconBarChart size={22} color="#A65D7B" />
          </div>
          <div>
            <h2 className="page-title">Administrator Portal & AI Insights</h2>
            <p className="page-desc">
              Monitor campus query volume, manage escalation tickets, review AI suggestions, and detect knowledge base conflicts.
            </p>
          </div>
        </div>

        <div className="admin-nav-tabs">
          <button
            className={`admin-nav-btn ${activeAdminTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveAdminTab("overview")}
          >
            Analytics Overview
          </button>
          <button
            className={`admin-nav-btn ${activeAdminTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveAdminTab("tickets")}
          >
            Escalation Queue ({tickets.filter((t) => t.status === "OPEN").length})
          </button>
          <button
            className={`admin-nav-btn ${activeAdminTab === "conflicts" ? "active" : ""}`}
            onClick={() => setActiveAdminTab("conflicts")}
          >
            AI FAQ Conflict Detector
          </button>
          <button
            className={`admin-nav-btn ${activeAdminTab === "extraction" ? "active" : ""}`}
            onClick={() => setActiveAdminTab("extraction")}
          >
            Document Ingestion (PDF/DOCX)
          </button>
        </div>
      </div>

      {/* 1. Overview Tab */}
      {activeAdminTab === "overview" && (
        <div className="admin-overview-grid">
          {/* Top KPI Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-val">{analytics?.totalQueries || 0}</div>
              <div className="stat-label">Total Student Inquiries</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: "var(--status-ok-text)" }}>
                {analytics?.autoApproved || 0}
              </div>
              <div className="stat-label">Auto-Approved (Passed Rubric)</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: "var(--status-bad-text)" }}>
                {analytics?.openTickets || 0}
              </div>
              <div className="stat-label">Open Escalations</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: "var(--rose-links)" }}>
                {analytics?.avgConfidence || 92}%
              </div>
              <div className="stat-label">Average AI Confidence</div>
            </div>
          </div>

          {/* Real Category Distribution Bar Chart */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "14px" }}>
              <span>📊</span> Inquiries Breakdown by Category (Real Database Records)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(analytics?.categoryChart || []).map((c) => {
                const max = Math.max(...(analytics.categoryChart.map((x) => x.count) || [1]), 1);
                const pct = Math.round((c.count / max) * 100);
                return (
                  <div key={c.name} style={{ display: "grid", gridTemplateColumns: "170px 1fr 40px", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-mauve)" }}>{c.name}</span>
                    <div style={{ background: "#FFF0EA", height: "14px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border-pink)" }}>
                      <div
                        style={{
                          width: `${Math.max(pct, c.count > 0 ? 8 : 0)}%`,
                          height: "100%",
                          background: "var(--btn-pink)",
                          borderRadius: "10px",
                          transition: "width 0.4s ease"
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "12.5px", fontWeight: 700, textAlign: "right" }}>{c.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Escalations Tab */}
      {activeAdminTab === "tickets" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span>🚨</span> Live Escalation & Human Support Queue
            </h3>
            <span className="badge badge-high">Staff Approval Workflow</span>
          </div>

          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
            Review inquiries that were escalated due to high urgency (safety / danger) or low confidence (&lt;60%). Staff can provide an official reply directly to the student.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Student Question</th>
                  <th>Urgency</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Staff Action / Reply</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.ticket}>
                    <td><b>{t.ticket}</b></td>
                    <td style={{ maxWidth: "300px" }}>{t.query}</td>
                    <td>
                      <span className={t.urgency === "High" ? "badge badge-high" : "badge badge-med"}>
                        {t.urgency}
                      </span>
                    </td>
                    <td><span className="badge badge-lilac">{t.department}</span></td>
                    <td>
                      <span className={t.status === "OPEN" ? "badge badge-fail" : "badge badge-pass"}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      {t.status === "OPEN" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <input
                            type="text"
                            placeholder="Type official staff reply..."
                            value={replyText[t.ticket] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [t.ticket]: e.target.value })}
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                          />
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleReplyTicket(t.ticket)}
                              disabled={!replyText[t.ticket]?.trim()}
                            >
                              Send Reply & Resolve
                            </button>
                            <button className="btn btn-sm" onClick={() => handleResolve(t.ticket)}>
                              Resolve
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ color: "var(--status-ok-text)", fontWeight: 700 }}>Resolved</span>
                          {t.reply && <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Reply: {t.reply}</div>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                      No active tickets in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. AI FAQ Conflict Detector Tab */}
      {activeAdminTab === "conflicts" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span>🤖</span> AI FAQ Conflict & Redundancy Detector
            </h3>
            <button className="btn btn-primary" disabled={busy} onClick={runConflictDetection}>
              {busy ? "Scanning..." : "Scan Knowledge Base for Conflicts"}
            </button>
          </div>

          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
            The AI scans all approved FAQs across categories to identify duplicate rules, overlapping questions, and conflicting policy deadlines.
          </p>

          {conflicts && (
            <div>
              <div style={{ padding: "12px", background: "#FFF8F5", borderRadius: "10px", border: "1px solid var(--border-pink)", marginBottom: "14px" }}>
                <b>Audit Summary:</b> Checked {conflicts.totalChecked} FAQs • Found {conflicts.conflictCount} potential overlaps.
              </div>

              {conflicts.conflictCount > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {conflicts.conflicts.map((c, i) => (
                    <div key={i} style={{ background: "#FFFFFF", border: "1px solid var(--border-pink)", padding: "12px", borderRadius: "8px" }}>
                      <span className="badge badge-med">Potential Redundancy</span>
                      <p style={{ margin: "6px 0 0 0", fontSize: "13px" }}>{c.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--status-ok-text)", fontWeight: 700 }}>
                  ✓ Clean knowledge base: No contradictory or conflicting policy rules detected!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Document Ingestion Tab */}
      {activeAdminTab === "extraction" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span>📄</span> AI Document Processing & FAQ Generation
            </h3>
            <button className="btn btn-primary" disabled={busy} onClick={runDocExtraction}>
              {busy ? "Extracting..." : "Simulate Document Ingestion (PDF)"}
            </button>
          </div>

          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
            Upload campus handbook, academic syllabus, or official circulars (PDF/DOCX). The AI extracts text, generates structured FAQs, and queues them for administrative review before publishing.
          </p>

          <textarea
            rows={3}
            placeholder="Paste raw handbook text or circular content here..."
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
          />

          {extractedFaqs.length > 0 && (
            <div style={{ marginTop: "18px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "var(--text-mauve)" }}>
                AI-Suggested FAQs Awaiting Administrator Approval:
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {extractedFaqs.map((f, i) => (
                  <div key={i} style={{ background: "#FFF8F5", border: "1.5px solid var(--border-pink)", padding: "14px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span className="badge badge-lilac">{f.cat}</span>
                      <span className="badge badge-med">Pending Review</span>
                    </div>
                    <b>Q: {f.q}</b>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "var(--text-muted)" }}>A: {f.a}</p>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        api("/api/faqs", "POST", f).then(() => {
                          alert(`Approved & Published FAQ to ${f.cat}!`);
                          setExtractedFaqs((prev) => prev.filter((_, idx) => idx !== i));
                        });
                      }}
                    >
                      ✓ Approve & Publish as Official FAQ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

