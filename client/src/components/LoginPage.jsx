import { useState, useEffect } from "react";
import { IconGraduationCap, IconShield, IconUser, IconSparkles } from "./Icons.jsx";
import { api } from "../api.js";

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role, setRole] = useState("student");
  const [program, setProgram] = useState("B.Tech Computer Science");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Check if saved credentials exist in localStorage
  useEffect(() => {
    try {
      const savedCreds = localStorage.getItem("helpdesk_saved_creds");
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.password) setPassword(parsed.password);
        if (parsed.name) setName(parsed.name);
        if (parsed.role) setRole(parsed.role);
        setRememberMe(true);
      }
    } catch { }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      return setError("Please enter your college or personal email address.");
    }

    setBusy(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? { name, email, password, role, studentId, program }
        : { email, password, role, name, studentId, program };

      const res = await api(endpoint, "POST", payload);

      if (res && res.user) {
        // Handle "Remember Me / Save Login Info"
        if (rememberMe) {
          localStorage.setItem("helpdesk_saved_user", JSON.stringify(res.user));
          localStorage.setItem(
            "helpdesk_saved_creds",
            JSON.stringify({ email, password, name: res.user.name, role: res.user.role })
          );
        } else {
          localStorage.removeItem("helpdesk_saved_user");
          localStorage.removeItem("helpdesk_saved_creds");
        }

        onLoginSuccess(res.user);
      } else {
        throw new Error("Unable to log in. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
    setBusy(false);
  };

  // Quick 1-Click Demo Login
  const handleQuickLogin = (demoRole) => {
    setError("");
    if (demoRole === "student") {
      const studentUser = {
        name: "Antara Yogesh Palwankar",
        email: "antara.palwankar@college.edu",
        role: "student",
        studentId: "150096725126",
        program: "B.Tech Computer Science",
        semester: "Semester 5",
        avatarLetter: "A"
      };
      if (rememberMe) {
        localStorage.setItem("helpdesk_saved_user", JSON.stringify(studentUser));
      }
      onLoginSuccess(studentUser);
    } else {
      const adminUser = {
        name: "Campus Helpdesk Admin",
        email: "admin@college.edu",
        role: "admin",
        studentId: "ADM-001",
        program: "Dean of Student Affairs",
        semester: "Staff Lead",
        avatarLetter: "A"
      };
      if (rememberMe) {
        localStorage.setItem("helpdesk_saved_user", JSON.stringify(adminUser));
      }
      onLoginSuccess(adminUser);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-box">
            <IconGraduationCap size={32} color="#A65D7B" />
          </div>
          <h1 className="login-app-title">AI Student Helpdesk Assistant</h1>
          <p className="login-app-subtitle">
            Autonomous Campus Inquiry & Knowledge Support Portal
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="login-mode-tabs">
          <button
            type="button"
            className={`login-mode-tab ${!isRegister ? "active" : ""}`}
            onClick={() => { setIsRegister(false); setError(""); }}
          >
            Sign In to Portal
          </button>
          <button
            type="button"
            className={`login-mode-tab ${isRegister ? "active" : ""}`}
            onClick={() => { setIsRegister(true); setError(""); }}
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="login-error-alert">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Role Pill Switcher */}
          <div className="role-selector-row">
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-mauve)" }}>
              Access Role:
            </label>
            <div className="role-options">
              <button
                type="button"
                className={`role-btn ${role === "student" ? "active" : ""}`}
                onClick={() => setRole("student")}
              >
                <IconUser size={14} color={role === "student" ? "#493B46" : "#73616F"} />
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                <IconShield size={14} color={role === "admin" ? "#493B46" : "#73616F"} />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          {/* Full Name (if registering) */}
          {isRegister && (
            <div className="form-field-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Antara Yogesh Palwankar or your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email Address */}
          <div className="form-field-group">
            <label className="form-label">
              {role === "admin" ? "Staff / Admin Email" : "College or Personal Email"}
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. yourname@college.edu or gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-field-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Extra fields if registering */}
          {isRegister && role === "student" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="form-field-group">
                <label className="form-label">Student ID (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="150096725126"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="form-field-group">
                <label className="form-label">Program / Branch</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="B.Tech Computer Science"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Remember Me / Save Login Info Checkbox */}
          <div className="remember-me-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me & save login info on this Mac</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={busy}
          >
            {busy ? "Signing In..." : isRegister ? "Create Account & Enter Portal" : "Sign In to Helpdesk Portal"}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Section */}
        <div className="quick-demo-section">
          <div className="quick-demo-divider">
            <span>OR 1-CLICK QUICK ACCESS FOR EVALUATORS</span>
          </div>

          <div className="demo-accounts-grid">
            <button
              type="button"
              className="demo-account-pill student"
              onClick={() => handleQuickLogin("student")}
            >
              <div className="demo-avatar">A</div>
              <div className="demo-meta">
                <b>Student Portal (Antara Palwankar)</b>
                <span>ID: 150096725126 • Student Productivity</span>
              </div>
            </button>

            <button
              type="button"
              className="demo-account-pill admin"
              onClick={() => handleQuickLogin("admin")}
            >
              <div className="demo-avatar admin">🛡️</div>
              <div className="demo-meta">
                <b>Admin Portal (Campus Staff Lead)</b>
                <span>Full access to tickets, analytics & FAQs</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="login-card-footer">
          <IconSparkles size={14} color="#A65D7B" />
          <span>Powered by Google Gemini 1.5 Flash & MERN Architecture</span>
        </div>
      </div>
    </div>
  );
}

