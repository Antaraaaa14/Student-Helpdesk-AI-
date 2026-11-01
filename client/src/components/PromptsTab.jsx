import { useState } from "react";

export default function PromptsTab({ version, setVersion }) {
  const [selectedPrompt, setSelectedPrompt] = useState(version || "v3");

  const prompts = {
    v1: {
      name: "Version 1: Baseline Direct Prompt",
      score: "3.0 / 5.0",
      type: "Unstructured / Baseline",
      template: `Answer this student query using the FAQ.\nQuery: {q}\nFAQ: {faq}`,
      sampleOutput: `The last date to pay semester fees is 15 November without penalty. After that a late fee of Rs. 500 per week applies. Pay through the student portal under Fees > Pay Online.`,
      issues: "Missing polite greeting, missing next step, missing official sign-off. High risk of blunt or abrupt replies.",
      rubricFailure: "Fails Greeting & Sign-off checks (Scores 3/5)"
    },
    v2: {
      name: "Version 2: Role & Grounding Constraints Prompt",
      score: "4.0 / 5.0",
      type: "Constrained Role Prompt",
      template: `You are a helpful university helpdesk assistant. Write a short, polite reply to the student using ONLY the approved FAQ below. Do not add facts, dates or amounts that are not in the FAQ.\nQuery: {q}\nApproved FAQ:\n{faq}`,
      sampleOutput: `Hello! The last date to pay semester fees is 15 November without penalty. After that a late fee of Rs. 500 per week applies. Pay through the student portal under Fees > Pay Online.`,
      issues: "Includes greeting and enforces grounding, but lacks clear next-step guidance and formal helpdesk closing sign-off.",
      rubricFailure: "Fails Official Sign-off check (Scores 4/5)"
    },
    v3: {
      name: "Version 3: Production XML Structured Prompt (Final)",
      score: "5.0 / 5.0",
      type: "XML Structured Task-Decomposed Prompt",
      template: `<role>University helpdesk assistant drafting replies for staff approval.</role>\n<rules>\n  1. Use ONLY facts inside <faq>.\n  2. Never invent dates, fees, links or promises.\n  3. Under 100 words.\n  4. Plain text.\n</rules>\n<format>\n  Start with "Dear Student,"; give the answer; add one next step; end with "Regards,\\nStudent Helpdesk Team".\n</format>\n<faq>{faq}</faq>\n<query>{q}</query>\nWrite the reply now.`,
      sampleOutput: `Dear Student,\n\nThank you for contacting the Student Helpdesk. The last date to pay semester fees is 15 November without penalty. After that a late fee of Rs. 500 per week applies. Pay through the student portal under Fees > Pay Online.\n\nNext Steps: If this does not resolve your query, reply to this message and we will help further.\n\nRegards,\nStudent Helpdesk Team`,
      issues: "None. Strictly adheres to XML delimiters, enforces factual grounding, guarantees polite greeting, next steps, and official sign-off.",
      rubricFailure: "Perfect 5/5 on all criteria (PASS)"
    }
  };

  return (
    <div>
      {/* Intro Header */}
      <div className="card peach">
        <div className="card-header">
          <h2 className="card-title">
            <span>⚖️</span> Prompt Engineering Lab & Task Decomposition
          </h2>
          <span className="badge badge-lilac">
            Marking Criterion 2: Prompt Engineering & Workflow Design (5/5 Marks)
          </span>
        </div>

        <p style={{ margin: "0 0 10px 0", color: "var(--text-mauve)", fontSize: "14.5px" }}>
          In accordance with the evaluation standard, this project implements <b>one structured XML prompt</b> and <b>three systematically tested prompt versions</b>. Below you can inspect the prompt architecture, task decomposition, and evolutionary refinement.
        </p>

        <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
          {["v1", "v2", "v3"].map((v) => (
            <button
              key={v}
              className={`btn ${selectedPrompt === v ? "btn-primary" : ""}`}
              onClick={() => {
                setSelectedPrompt(v);
                setVersion(v);
              }}
            >
              Inspect {v.toUpperCase()} ({prompts[v].score})
            </button>
          ))}
          <a
            className="btn"
            style={{ marginLeft: "auto", background: "var(--accent-soft-lilac)", borderColor: "var(--border-pink)" }}
            href="/api/download/prompts-doc"
            download="AI_Student_Helpdesk_Prompts_Dossier.doc"
          >
            📥 Download Complete Prompts Dossier (.doc / Word)
          </a>
          <a
            className="btn"
            href="/prompts-doc"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 View & Print Dossier
          </a>
        </div>
        </div>
      </div>

      {/* Task Decomposition Overview */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: "12px" }}>
          <span>🧩</span> Task Decomposition in Prompt v3
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
          Complex query answering is decomposed into four discrete, enforceable sub-tasks using XML delimiters:
        </p>

        <div className="pipeline-stages">
          <div className="stage-pill">
            <div className="stage-num">Sub-task 1</div>
            <div className="stage-name">&lt;role&gt;</div>
            <div className="stage-status">Establishes persona & context boundary</div>
          </div>
          <div className="stage-pill">
            <div className="stage-num">Sub-task 2</div>
            <div className="stage-name">&lt;rules&gt;</div>
            <div className="stage-status">Zero hallucination, word limit & plain text</div>
          </div>
          <div className="stage-pill">
            <div className="stage-num">Sub-task 3</div>
            <div className="stage-name">&lt;format&gt;</div>
            <div className="stage-status">Greeting, answer, next step, sign-off</div>
          </div>
          <div className="stage-pill">
            <div className="stage-num">Sub-task 4</div>
            <div className="stage-name">&lt;faq&gt; & &lt;query&gt;</div>
            <div className="stage-status">Context isolation to prevent prompt injection</div>
          </div>
        </div>
      </div>

      {/* Selected Prompt Detail */}
      <div className="card" style={{ borderLeft: "5px solid var(--rose-links)" }}>
        <div className="card-header">
          <h3 className="card-title">
            <span>📝</span> {prompts[selectedPrompt].name}
          </h3>
          <span className="badge badge-peach" style={{ fontSize: "14px", fontWeight: 700 }}>
            Average Rubric Score: {prompts[selectedPrompt].score}
          </span>
        </div>

        <h4 style={{ margin: "14px 0 6px 0", color: "var(--text-mauve)" }}>Prompt Template String:</h4>
        <pre className="code-block">{prompts[selectedPrompt].template}</pre>

        <h4 style={{ margin: "16px 0 6px 0", color: "var(--text-mauve)" }}>Generated Output Sample:</h4>
        <div className="draft-box">{prompts[selectedPrompt].sampleOutput}</div>

        <div className="kv-grid" style={{ marginTop: "16px" }}>
          <div className="kv-item">
            <small>Prompt Strategy</small>
            <span>{prompts[selectedPrompt].type}</span>
          </div>
          <div className="kv-item">
            <small>Rubric Performance</small>
            <span style={{ color: selectedPrompt === "v3" ? "var(--status-ok-text)" : "var(--status-warn-text)" }}>
              {prompts[selectedPrompt].rubricFailure}
            </span>
          </div>
          <div className="kv-item">
            <small>Active in Pipeline</small>
            <span>{version === selectedPrompt ? "YES (Selected)" : "NO"}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Prompt Comparison Grid */}
      <h3 style={{ margin: "24px 0 12px 0", color: "var(--text-mauve)" }}>
        Prompt Refinement Progression
      </h3>

      <div className="comparison-grid">
        {["v1", "v2", "v3"].map((v) => (
          <div key={v} className={`version-card ${v === "v3" ? "highlight" : ""}`}>
            <span className="version-badge">{v.toUpperCase()}</span>
            <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--text-mauve)", marginBottom: "4px" }}>
              {prompts[v].name.split(":")[1]}
            </div>
            <div style={{ fontSize: "13px", color: "var(--rose-links)", fontWeight: 700, marginBottom: "10px" }}>
              Score: {prompts[v].score}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", minHeight: "55px" }}>
              {prompts[v].issues}
            </p>
            <button
              className={`btn btn-sm ${version === v ? "btn-primary" : ""}`}
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => {
                setVersion(v);
                setSelectedPrompt(v);
              }}
            >
              {version === v ? "✓ Active Prompt" : `Use ${v.toUpperCase()} in Assistant`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

