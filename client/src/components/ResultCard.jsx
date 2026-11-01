import { useState } from "react";

export default function ResultCard({ r }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(r.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailSubject = (r.ticket ? `[ESCALATION ${r.ticket}] ` : "Helpdesk Response: ") + r.query.slice(0, 50);
  const mailTo = r.ticket ? "helpdesk-escalations@college.edu" : "student@college.edu";
  const mailUrl = `mailto:${mailTo}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(r.draft)}`;

  const urgencyBadgeClass =
    r.urgency === "High" ? "badge badge-high" : r.urgency === "Medium" ? "badge badge-med" : "badge badge-low";

  const actionBannerClass = r.ticket
    ? "action-banner escalated"
    : r.verdict === "PASS"
    ? "action-banner auto"
    : "action-banner review";

  return (
    <div className="card" style={{ borderLeft: "5px solid var(--rose-links)" }}>
      <div className="card-header">
        <h3 className="card-title">
          <span>⚡</span> Processing Result & Verification
        </h3>
        <span className="badge badge-lilac">
          Engine: {r.engine} • Prompt: {r.version.toUpperCase()}
        </span>
      </div>

      {/* 5-Stage Execution Summary Grid */}
      <div className="pipeline-stages">
        <div className="stage-pill">
          <div className="stage-num">Stage 1: Classification</div>
          <div className="stage-name">{r.category}</div>
          <div className="stage-status">
            Urgency: <span className={urgencyBadgeClass}>{r.urgency}</span>
          </div>
        </div>

        <div className="stage-pill">
          <div className="stage-num">Stage 2: Knowledge Match</div>
          <div className="stage-name">{r.faqId !== "NONE" ? `FAQ ${r.faqId}` : "No Approved Match"}</div>
          <div className="stage-status">
            Confidence: <b>{Math.round(r.confidence * 100)}%</b>
          </div>
        </div>

        <div className="stage-pill">
          <div className="stage-num">Stage 3: Draft Engine</div>
          <div className="stage-name">{r.engine}</div>
          <div className="stage-status">Prompt {r.version} formatted</div>
        </div>

        <div className="stage-pill">
          <div className="stage-num">Stage 4: Rubric Verification</div>
          <div className="stage-name">
            Score: <span className={r.score >= 4 ? "badge badge-pass" : "badge badge-fail"}>{r.score} / 5</span>
          </div>
          <div className="stage-status">Verdict: <b>{r.verdict}</b></div>
        </div>

        <div className="stage-pill">
          <div className="stage-num">Stage 5: Automation</div>
          <div className="stage-name">{r.ticket ? `Ticket ${r.ticket}` : "Direct Dispatch"}</div>
          <div className="stage-status">{r.ticket ? "Staff Queue" : "Auto-Approved"}</div>
        </div>
      </div>

      {/* Matched FAQ Reference (if any) */}
      {r.faqQuestion && (
        <div style={{ background: "#fffafa", border: "1px dashed var(--border-pink)", padding: "10px 14px", borderRadius: "10px", margin: "12px 0", fontSize: "13.5px" }}>
          <b>Approved Reference FAQ:</b> {r.faqQuestion} (ID: {r.faqId})
        </div>
      )}

      {/* Drafted Output Box */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
        <h4 style={{ margin: 0, color: "var(--text-mauve)" }}>Drafted Response (Ready for Student)</h4>
        <button className="btn btn-sm" onClick={copyToClipboard}>
          {copied ? "✓ Copied!" : "📋 Copy Draft"}
        </button>
      </div>

      <div className="draft-box">{r.draft}</div>

      {/* 5-Point Rubric Verification Breakdown */}
      <h4 style={{ margin: "16px 0 6px 0", color: "var(--text-mauve)" }}>
        5-Point Output Verification Rubric:{" "}
        <span style={{ color: r.score >= 4 ? "var(--status-ok-text)" : "var(--status-warn-text)" }}>
          {r.score}/5 ({r.verdict === "PASS" ? "PASSED VALIDATION" : "FLAGGED FOR REVIEW"})
        </span>
      </h4>

      <ul className="rubric-list">
        {r.checks.map((c, i) => (
          <li key={i} className={`rubric-item ${c.ok ? "pass" : "fail"}`}>
            <span>{c.ok ? "✓" : "✗"}</span>
            <span>{c.name}</span>
          </li>
        ))}
      </ul>

      {/* Automation Result Banner */}
      <div className={actionBannerClass}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "15px", marginBottom: "4px" }}>
            {r.ticket ? "🚨 AUTOMATED ACTION: ESCALATION TICKET DISPATCHED" : "✅ AUTOMATED ACTION: AUTO-APPROVED"}
          </div>
          <div style={{ fontSize: "13.5px" }}>
            {r.action} • {r.executed || "Logged in real-time"}. Stored in database (ID: {String(r.id || "").slice(-8)}).
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <a className="btn pri btn-sm" href={mailUrl} target="_blank" rel="noreferrer">
            ✉️ {r.ticket ? "Email Escalation to Staff" : "Open Email Draft"}
          </a>
        </div>
      </div>
    </div>
  );
}
