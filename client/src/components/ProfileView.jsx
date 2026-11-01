import { IconUser, IconShield } from "./Icons.jsx";

export default function ProfileView({ user, setUser, systemInfo }) {
  const toggleRole = () => {
    if (user.role === "admin") {
      setUser({
        name: "Antara Yogesh Palwankar",
        role: "student",
        studentId: "150096725126",
        program: "B.Tech Computer Science",
        semester: "Semester 5",
        avatarLetter: "A"
      });
    } else {
      setUser({
        name: "Campus Helpdesk Admin",
        role: "admin",
        studentId: "ADM-001",
        program: "Dean of Student Affairs",
        semester: "Staff Lead",
        avatarLetter: "A"
      });
    }
  };

  return (
    <div className="profile-page-layout">
      <div className="page-header-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="page-icon-square">
            <IconUser size={22} color="#A65D7B" />
          </div>
          <div>
            <h2 className="page-title">Student Profile & Settings</h2>
            <p className="page-desc">
              Manage your personal student details, role configuration, and active helpdesk preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="card peach" style={{ maxWidth: "680px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
          <div className="user-avatar-circle" style={{ width: "64px", height: "64px", fontSize: "24px" }}>
            {user.avatarLetter || "A"}
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "22px", color: "var(--text-mauve)" }}>{user.name}</h3>
            <span className="badge badge-lilac" style={{ fontSize: "13px" }}>
              {user.role === "admin" ? "Campus Helpdesk Administrator" : "Registered Undergraduate Student"}
            </span>
          </div>
        </div>

        <div className="kv-grid">
          <div className="kv-item">
            <small>Student / Staff ID</small>
            <span>{user.studentId}</span>
          </div>
          <div className="kv-item">
            <small>Academic Program</small>
            <span>{user.program}</span>
          </div>
          <div className="kv-item">
            <small>Semester / Division</small>
            <span>{user.semester}</span>
          </div>
          <div className="kv-item">
            <small>Project Category</small>
            <span>Student Productivity</span>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed var(--border-pink)", paddingTop: "18px", marginTop: "18px" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "var(--text-mauve)" }}>System Configuration:</h4>
          <div style={{ fontSize: "13.5px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div><b>Active Database:</b> {systemInfo.database}</div>
            <div><b>AI Engine:</b> {systemInfo.llmProvider}</div>
            <div><b>Approved Knowledge Base:</b> {systemInfo.faqs} FAQs</div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <button className="btn btn-primary" onClick={toggleRole}>
            <IconShield size={16} color="#493B46" />
            <span>Switch to {user.role === "admin" ? "Student Mode" : "Administrator Mode"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

