import { useState } from "react";
import { IconSearch, IconBell, IconUser, IconShield } from "./Icons.jsx";

export default function TopNavbar({
  user,
  setUser,
  onSearchSubmit,
  systemInfo,
  onLogout
}) {
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      onSearchSubmit(searchVal.trim());
      setSearchVal("");
    }
  };

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
    setMenuOpen(false);
  };

  return (
    <header className="top-navbar">
      {/* Global Search Bar */}
      <div className={`search-bar-container ${searchVal ? "has-text" : ""}`}>
        <IconSearch size={18} color="#A65D7B" className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for a topic... (e.g. fees, attendance, exams)"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {searchVal ? (
          <div className="search-active-actions">
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchVal("")}
              title="Clear search"
            >
              ✕
            </button>
            <button
              type="button"
              className="search-submit-pill"
              onClick={() => {
                if (searchVal.trim()) {
                  onSearchSubmit(searchVal.trim());
                  setSearchVal("");
                }
              }}
              title="Search now"
            >
              <span>Search ↵</span>
            </button>
          </div>
        ) : (
          <div className="search-shortcut-badge" title="Press Enter to search">
            <span>Enter ↵</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="top-right-controls">
        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="icon-button notification-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            title="Notifications"
          >
            <IconBell size={20} color="#493B46" />
            <span className="notification-dot"></span>
          </button>

          {notifOpen && (
            <div className="dropdown-panel notif-panel">
              <div className="dropdown-header">Campus Helpdesk Alerts</div>
              <div className="notif-item">
                <span className="notif-badge">Exams</span>
                <p>Hall tickets for End-Semester Examinations are now available for download.</p>
                <small>1 hour ago</small>
              </div>
              <div className="notif-item">
                <span className="notif-badge fees">Fees</span>
                <p>Semester tuition fee deadline is 15 November without late fine.</p>
                <small>3 hours ago</small>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div style={{ position: "relative" }}>
          <div
            className="user-profile-pill"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="user-avatar-circle">
              {user.avatarLetter || "A"}
            </div>
            <span className="user-name-text">
              {user.name.split(" ")[0]}
            </span>
            <span className="dropdown-arrow">▾</span>
          </div>

          {menuOpen && (
            <div className="dropdown-panel user-panel">
              <div className="dropdown-header">
                <b>{user.name}</b>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                  ID: {user.studentId} • {user.role === "admin" ? "Administrator" : "Student"}
                </div>
              </div>

              <div style={{ padding: "8px 14px", fontSize: "12.5px", color: "var(--text-muted)", borderBottom: "1px solid var(--border-pink)" }}>
                <div>Program: {user.program}</div>
                <div>Status: Active on Campus</div>
              </div>

              <button className="dropdown-action-btn" onClick={toggleRole}>
                <IconShield size={16} color="#A65D7B" />
                <span>Switch to {user.role === "admin" ? "Student View" : "Administrator Portal"}</span>
              </button>

              {onLogout && (
                <button
                  className="dropdown-action-btn"
                  onClick={onLogout}
                  style={{ color: "#B91C1C", borderTop: "1px solid var(--border-pink)" }}
                >
                  <span>🚪 Log Out of Account</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

