import { useEffect, useState } from "react";
import { api } from "../api.js";
import ResultCard from "./ResultCard.jsx";

const SAMPLES = [
  { label: "💳 Semester Fees", text: "When is the last date to pay my semester fees? I want to avoid the late fine.", category: "Fees & Scholarships" },
  { label: "🎫 Exam Hall Ticket", text: "Where do I download my hall ticket for the exams?", category: "Exams & Results" },
  { label: "📶 Campus Wi-Fi", text: "I forgot my wifi password and can't log in to the network", category: "IT Support" },
  { label: "📚 Library Books", text: "How many books can I take from the library and for how long?", category: "Hostel & Library" },
  { label: "🚨 Hostel Safety (Edge Case)", text: "URGENT: my roommate is threatening me and I feel unsafe in the hostel", category: "Urgent Safety", edge: true },
  { label: "❓ Out of Scope", text: "What is the capital of France?", category: "Out of Scope" },
  { label: "🏆 Scholarship Aid", text: "How do I apply for a scholarship and when is the last date?", category: "Fees & Scholarships" },
  { label: "📄 Bonafide Certificate", text: "How do I get a bonafide certificate for my bus pass?", category: "Certificates & Documents" }
];

export default function HelpdeskTab({ version, setVersion, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  async function submit() {
    setResult(null);
    if (!query.trim()) {
      return setError("Please enter or select a student query to process.");
    }
    setError("");
    setBusy(true);
    try {
      const res = await api("/api/process", "POST", { query, version });
      setResult(res);
    } catch (e) {
      setError(e.message || "Pipeline execution failed.");
    }
    setBusy(false);
  }

  const handleClear = () => {
    setQuery("");
    setResult(null);
    setError("");
  };

  return (
    <div>
      {/* Prompt Selector Bar */}
      <div className="prompt-bar">
        <div className="prompt-bar-label">
          <span>🧠 Active Prompt Strategy:</span>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ fontWeight: 700, padding: "6px 12px" }}
          >
            <option value="v1">Version 1: Basic Direct Prompt (Avg 3.0/5)</option>
            <option value="v2">Version 2: Role + Grounding Rules (Avg 4.0/5)</option>
            <option value="v3">Version 3: Production XML Structured Prompt (Avg 5.0/5 - Recommended)</option>
          </select>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          {version === "v1" && "Raw answer from FAQ without greeting/sign-off"}
          {version === "v2" && "Role persona + strict fact constraints"}
          {version === "v3" && "Strict XML formatting: Greeting + Answer + Next Step + Sign-off"}
        </div>
      </div>

      {/* Main Query Input Card */}
      <div className="card peach">
        <div className="card-header">
          <h2 className="card-title">
            <span>💬</span> Student Query Intake & Ingestion Form
          </h2>
          {query && (
            <button className="btn btn-sm" onClick={handleClear}>
              Clear Input
            </button>
          )}
        </div>

        <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-muted)" }}>
          Enter a student question below or click any pre-loaded test case to observe the 5-stage classification, retrieval, drafting, verification, and automation pipeline.
        </p>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. When is the last date to pay semester fees? Or: I forgot my wifi password..."
          rows={3}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {query.length} / 1000 characters
          </span>
          <span style={{ fontSize: "12px", color: "var(--rose-links)", fontWeight: 600 }}>
            TF-IDF + Cosine Retrieval Active
          </span>
        </div>

        {/* Quick Sample Queries */}
        <div className="chips-container">
          <div className="chips-label">🎯 Click a pre-loaded query to test:</div>
          <div className="chips">
            {SAMPLES.map((s, idx) => (
              <button
                key={idx}
                className={`chip-btn ${s.edge ? "edge" : ""}`}
                onClick={() => setQuery(s.text)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="btn btn-primary"
            style={{ padding: "10px 24px", fontSize: "15px" }}
            disabled={busy || !query.trim()}
            onClick={submit}
          >
            {busy ? "⚙️ Running 5 Stages..." : "🚀 Process Query with AI Pipeline"}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="card" style={{ backgroundColor: "var(--status-bad-bg)", borderColor: "#fca5a5", color: "var(--status-bad-text)" }}>
          ⚠️ <b>Error:</b> {error}
        </div>
      )}

      {/* Result Card */}
      {result && <ResultCard r={result} />}
    </div>
  );
}
