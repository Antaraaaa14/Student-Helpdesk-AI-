export default function WorkflowTab() {
  return (
    <div>
      {/* Intro Header */}
      <div className="card peach">
        <div className="card-header">
          <h2 className="card-title">
            <span>📐</span> 5-Stage Architecture & Processing Workflow
          </h2>
          <span className="badge badge-lilac">
            Requirement: Workflow Design (3+ Processing Stages)
          </span>
        </div>

        <p style={{ margin: "0", color: "var(--text-mauve)", fontSize: "14.5px", lineHeight: "1.6" }}>
          The AI Student Helpdesk Assistant operates a deterministic, multi-stage processing pipeline that combines NLP semantic classification, context grounding, prompt engineering, rubric verification, and trigger-action automation.
        </p>
      </div>

      {/* Visual Workflow Steps */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: "16px" }}>
          <span>🔄</span> End-to-End Execution Flowchart
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Step 1 */}
          <div style={{ background: "#FFF8F5", border: "1.5px solid var(--border-pink)", borderRadius: "14px", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: 800, color: "var(--rose-links)", fontSize: "13px" }}>STAGE 1</span>
              <span className="badge badge-lilac">NLP Tokenizer + Urgency Scanner</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-mauve)", marginBottom: "4px" }}>
              Query Ingestion & Intent Classification
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
              Student query is stripped of stop-words, stemmed, and scanned for urgency signals (<i>urgent, danger, safety, deadline</i>). Assigns Urgency Level: <b>Low</b>, <b>Medium</b>, or <b>High</b>.
            </p>
          </div>

          <div style={{ textAlign: "center", color: "var(--rose-links)", fontSize: "18px", fontWeight: 800 }}>↓</div>

          {/* Step 2 */}
          <div style={{ background: "#FFF8F5", border: "1.5px solid var(--border-pink)", borderRadius: "14px", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: 800, color: "var(--rose-links)", fontSize: "13px" }}>STAGE 2</span>
              <span className="badge badge-lilac">TF-IDF Vector Space Model</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-mauve)", marginBottom: "4px" }}>
              Approved FAQ Retrieval & Confidence Thresholding
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
              Computes TF-IDF cosine similarity between the query and 12 approved university FAQs. Calculates confidence score (0% - 100%). If confidence &lt; 60% or no keyword hits exist, marked for escalation.
            </p>
          </div>

          <div style={{ textAlign: "center", color: "var(--rose-links)", fontSize: "18px", fontWeight: 800 }}>↓</div>

          {/* Decision Branch */}
          <div style={{ background: "var(--card-peach)", border: "1.5px solid var(--border-pink-strong)", borderRadius: "14px", padding: "16px 20px" }}>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-mauve)", marginBottom: "6px" }}>
              ⚖️ Decision Gate: Should this query be answered or escalated?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
              <div style={{ background: "#FFFFFF", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border-pink)" }}>
                <b>Route A: Safety or Unmatched Query</b><br />
                Trigger: High Urgency OR Confidence &lt; 0.60 OR No FAQ<br />
                Action: Dispatch Ticket (T-xxxx) + Emergency contacts reply
              </div>
              <div style={{ background: "#FFFFFF", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border-pink)" }}>
                <b>Route B: Valid FAQ Query</b><br />
                Trigger: Confidence &ge; 0.60 AND Urgency Low/Med<br />
                Action: Send approved FAQ context to Drafting Engine
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", color: "var(--rose-links)", fontSize: "18px", fontWeight: 800 }}>↓</div>

          {/* Step 3 */}
          <div style={{ background: "#FFF8F5", border: "1.5px solid var(--border-pink)", borderRadius: "14px", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: 800, color: "var(--rose-links)", fontSize: "13px" }}>STAGE 3</span>
              <span className="badge badge-lilac">Prompt v1 / v2 / v3</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-mauve)", marginBottom: "4px" }}>
              Response Drafting (LLM / High-Fidelity Local Engine)
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
              Fills the selected prompt template with query and approved FAQ facts. Uses XML delimiters (&lt;faq&gt;, &lt;query&gt;) to constrain the AI and ensure no unapproved information is injected.
            </p>
          </div>

          <div style={{ textAlign: "center", color: "var(--rose-links)", fontSize: "18px", fontWeight: 800 }}>↓</div>

          {/* Step 4 */}
          <div style={{ background: "#FFF8F5", border: "1.5px solid var(--border-pink)", borderRadius: "14px", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: 800, color: "var(--rose-links)", fontSize: "13px" }}>STAGE 4</span>
              <span className="badge badge-lilac">5-Point Rubric Rule Engine</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-mauve)", marginBottom: "4px" }}>
              Reference-Based Output Verification
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
              Verifies the draft against 5 strict rules: Grounding (no invented figures/dates), completeness (50%+ key terms), greeting, sign-off, and length (10-120 words with zero false guarantees). Score &ge; 4 is required to PASS.
            </p>
          </div>

          <div style={{ textAlign: "center", color: "var(--rose-links)", fontSize: "18px", fontWeight: 800 }}>↓</div>

          {/* Step 5 */}
          <div style={{ background: "#FFF8F5", border: "1.5px solid var(--border-pink)", borderRadius: "14px", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: 800, color: "var(--rose-links)", fontSize: "13px" }}>STAGE 5</span>
              <span className="badge badge-lilac">Trigger-Action Automation</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-mauve)", marginBottom: "4px" }}>
              Automated Action & Audit Persistence
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
              If verified, marks AUTO-APPROVED and queues email draft. If escalated, generates tracked Ticket ID (T-100x). Persists all inputs, outputs, scores, and timestamps to database and CSV spreadsheet.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI Box */}
      <div className="card" style={{ borderLeft: "5px solid var(--rose-links)" }}>
        <h3 className="card-title" style={{ marginBottom: "10px" }}>
          <span>🛡️</span> Responsible AI & Ethical Design Framework
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", fontSize: "13.5px" }}>
          <div style={{ background: "#FFF8F5", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-pink)" }}>
            <b>1. Grounded Context Only:</b><br />
            AI drafts responses exclusively from approved university FAQ text.
          </div>
          <div style={{ background: "#FFF8F5", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-pink)" }}>
            <b>2. Hallucination Blocker:</b><br />
            The rubric checks numeric values in the draft against the FAQ. Unapproved figures fail verification.
          </div>
          <div style={{ background: "#FFF8F5", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-pink)" }}>
            <b>3. Safety Escalation:</b><br />
            Harassment, ragging, or physical safety queries bypass automation and alert human staff.
          </div>
          <div style={{ background: "#FFF8F5", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-pink)" }}>
            <b>4. Human in the Loop:</b><br />
            No email is silently dispatched without audit logging and 1-click human verification.
          </div>
        </div>
      </div>
    </div>
  );
}

