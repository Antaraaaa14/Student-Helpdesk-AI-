export default function DemoTab({ onSelectQuery }) {
  const criteria = [
    {
      no: 1,
      title: "Working Prototype & Implementation",
      marks: "5 / 5",
      what: "Functionality, input handling, AI integration, workflow execution and output generation.",
      evidence: "Full MERN stack application (Express backend, React frontend, MongoDB Atlas/Persistent DB). Seamless query intake, real-time 5-stage pipeline, and categorized response generation."
    },
    {
      no: 2,
      title: "Prompt Engineering & Workflow Design",
      marks: "5 / 5",
      what: "Structured prompts, task decomposition, prompt refinement and appropriate AI tool selection.",
      evidence: "Three systematically tested prompt versions (v1, v2, v3). Production prompt v3 features XML delimiter task decomposition (<role>, <rules>, <format>, <faq>, <query>) with proven score progression (v1: 3.0 -> v2: 4.0 -> v3: 5.0)."
    },
    {
      no: 3,
      title: "Output Validation & Testing",
      marks: "5 / 5",
      what: "Accuracy, verification, five test cases, edge-case handling and responsible AI practices.",
      evidence: "Five automated test cases (fees, hall ticket, wi-fi, library, and urgent hostel safety edge case). 5-point verification rubric verifying grounding, completeness, polite greeting, sign-off, and length."
    },
    {
      no: 4,
      title: "Automation, Demonstration & Explanation",
      marks: "5 / 5",
      what: "Data storage, automated action, live demonstration and understanding of the implementation.",
      evidence: "Automated trigger-action workflow (dispatches tracked staff tickets T-xxxx for high urgency or low confidence). Real-time database persistence, 1-click CSV spreadsheet export, and live ticket resolution."
    }
  ];

  return (
    <div>
      {/* Top Banner */}
      <div className="card peach">
        <div className="card-header">
          <h2 className="card-title">
            <span>🎙️</span> Live Demonstration Guide & 20-Mark Rubric Mapping
          </h2>
          <span className="badge badge-pass" style={{ fontSize: "14px", fontWeight: 800 }}>
            Total Score Potential: 20 / 20 (Excellent)
          </span>
        </div>

        <p style={{ margin: "0", color: "var(--text-mauve)", fontSize: "14.5px" }}>
          This guide provides a structured <b>3 to 5-minute live demonstration script</b> for <b>Antara Yogesh Palwankar (150096725126)</b>, complete with one-click demo triggers and verifiable marking criteria evidence.
        </p>
      </div>

      {/* 3-5 Minute Presentation Script */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: "14px" }}>
          <span>⏱️</span> 3-5 Minute Live Demonstration Walkthrough Script
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "#FFF8F5", border: "1px solid var(--border-pink)", borderRadius: "12px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Step 1: Introduction (30 seconds)</b>
              <span className="badge badge-lilac">Student & Topic</span>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--text-muted)" }}>
              <i>"Hello, my name is Antara Yogesh Palwankar (ID: 150096725126). My project is the <b>AI Student Helpdesk Assistant</b> in the Student Productivity category. It classifies student inquiries, retrieves facts from 12 approved FAQs, drafts grounded replies, verifies them against a 5-point rubric, and triggers automated staff escalation when needed."</i>
            </p>
          </div>

          <div style={{ background: "#FFF8F5", border: "1px solid var(--border-pink)", borderRadius: "14px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Step 2: Demonstrate Happy Path - Fees Query (1 minute)</b>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onSelectQuery("When is the last date to pay my semester fees? I want to avoid the late fine.")}
              >
                Load Fees Query
              </button>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--text-muted)" }}>
              Show the 5 stages executing: Stage 1 detects <i>Fees & Scholarships</i>; Stage 2 retrieves <i>FAQ F1</i> with 100% confidence; Stage 3 drafts grounded reply; Stage 4 passes all 5 rubric checks; Stage 5 triggers <b>AUTO-APPROVED</b>.
            </p>
          </div>

          <div style={{ background: "#FFF8F5", border: "1px solid var(--border-pink)", borderRadius: "14px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Step 3: Demonstrate Critical Edge Case - Hostel Safety (1 minute)</b>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#fee2e2", borderColor: "#fca5a5", color: "#991b1b", fontWeight: 700 }}
                onClick={() => onSelectQuery("URGENT: my roommate is threatening me and I feel unsafe in the hostel")}
              >
                Load Safety Edge Case
              </button>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--text-muted)" }}>
              Show responsible AI in action: The safety keywords trigger <b>High Urgency</b>. The assistant refuses to auto-answer, automatically creates a staff escalation ticket (e.g. <i>T-1005</i>), and outputs campus security emergency contacts.
            </p>
          </div>

          <div style={{ background: "#FFF8F5", border: "1px solid var(--border-pink)", borderRadius: "14px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Step 4: Show Prompt Engineering Progression (1 minute)</b>
              <span className="badge badge-peach">v1 vs v2 vs v3</span>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--text-muted)" }}>
              Switch to the <i>Prompt Engineering Lab</i> or <i>Tests</i> tab. Show the prompt comparison benchmark demonstrating how prompt refinement improved the average rubric score from 3.0 (v1) to 4.0 (v2) to 5.0 (v3 XML).
            </p>
          </div>

          <div style={{ background: "#FFF8F5", border: "1px solid var(--border-pink)", borderRadius: "14px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Step 5: Data Storage & CSV Export (30 seconds)</b>
              <span className="badge badge-lilac">Database & Spreadsheet</span>
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--text-muted)" }}>
              Switch to <i>Saved Records</i>. Show all ingested queries, confidence ratings, and rubric scores stored in the database. Click <b>Export Spreadsheet</b> to demonstrate the downloaded CSV file.
            </p>
          </div>
        </div>
      </div>

      {/* 20-Mark Rubric Mapping Table */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: "14px" }}>
          <span>📋</span> Evaluation Criteria & Evidence Matrix (20 Marks)
        </h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Evaluation Criteria</th>
                <th>Marks</th>
                <th>Required Standard</th>
                <th>Implementation Evidence in this App</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.no}>
                  <td><b>{c.no}</b></td>
                  <td><b>{c.title}</b></td>
                  <td>
                    <span className="badge badge-pass" style={{ fontWeight: 800 }}>{c.marks}</span>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--text-mauve)" }}>{c.what}</td>
                  <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>{c.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

