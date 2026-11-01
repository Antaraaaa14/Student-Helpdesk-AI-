import React from "react";
import {
  IconGraduationCap,
  IconHome,
  IconMessageSquare,
  IconFileText,
  IconGrid,
  IconClock,
  IconUser,
  IconBarChart,
  IconHeart
} from "./Icons.jsx";

export default function Sidebar({ currentView, setCurrentView, openTicketCount = 0, onLogout }) {
  const navItems = [
    { id: "home", label: "Home", icon: IconHome },
    { id: "chat", label: "Ask a Question", icon: IconMessageSquare },
    { id: "faqs", label: "FAQs", icon: IconFileText },
    { id: "categories", label: "Categories", icon: IconGrid },
    { id: "my-queries", label: "My Queries", icon: IconClock },
    { id: "profile", label: "Profile", icon: IconUser },
    { id: "admin", label: "Admin & Analytics", icon: IconBarChart, badge: openTicketCount > 0 ? openTicketCount : null }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => setCurrentView("home")}>
        <div className="brand-icon-box">
          <IconGraduationCap size={24} color="#A65D7B" />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">Student Helpdesk</h1>
          <span className="brand-subtitle">AI-Powered Support</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setCurrentView(item.id)}
            >
              <div className="nav-item-icon">
                <Icon size={18} color={isActive ? "#493B46" : "#73616F"} />
              </div>
              <span className="nav-item-label">{item.label}</span>
              {item.badge && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {onLogout && (
        <div style={{ padding: "10px 0 6px 0", borderTop: "1px dashed var(--border-pink)", marginTop: "12px" }}>
          <button
            className="nav-item"
            style={{ color: "#B91C1C", fontSize: "13px" }}
            onClick={onLogout}
          >
            <span>🚪 Log Out</span>
          </button>
        </div>
      )}

      {/* Bottom Illustration & Inspiration */}
      <div className="sidebar-bottom-card">
        <div className="sidebar-illustration">
          {/* Stack of pastel books SVG illustration */}
          <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
            {/* Pencil holder / coffee cup */}
            <rect x="68" y="22" width="22" height="34" rx="4" fill="#FFE2D5" stroke="#F3DCE2" strokeWidth="1.5" />
            <line x1="74" y1="10" x2="77" y2="22" stroke="#A65D7B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="82" y1="8" x2="80" y2="22" stroke="#FFC9D9" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="87" y1="12" x2="84" y2="22" stroke="#E8DFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Bottom book (Pastel Peach) */}
            <rect x="8" y="44" width="58" height="13" rx="3" fill="#FFE2D5" stroke="#F3DCE2" strokeWidth="1.5" />
            <line x1="16" y1="44" x2="16" y2="57" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />

            {/* Middle book (Blush Pink) */}
            <rect x="12" y="32" width="52" height="12" rx="3" fill="#FFC9D9" stroke="#F3DCE2" strokeWidth="1.5" />
            <line x1="20" y1="32" x2="20" y2="44" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />

            {/* Top book (Soft Lilac) */}
            <rect x="16" y="21" width="46" height="11" rx="3" fill="#E8DFFF" stroke="#F3DCE2" strokeWidth="1.5" />
            <line x1="24" y1="21" x2="24" y2="32" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />

            {/* Floating little hearts */}
            <path d="M7 18 C7 15, 10 14, 11 16 C12 14, 15 15, 15 18 C15 21, 11 24, 11 24 C11 24, 7 21, 7 18 Z" fill="#FFC9D9" opacity="0.8" />
            <path d="M88 6 C88 4, 90 3, 91 5 C92 3, 94 4, 94 6 C94 8, 91 10, 91 10 C91 10, 88 8, 88 6 Z" fill="#A65D7B" opacity="0.7" />
          </svg>
        </div>
        <div className="sidebar-quote">
          Your questions matter! <IconHeart size={13} color="#A65D7B" fill="#A65D7B" />
        </div>
      </div>
    </aside>
  );
}

