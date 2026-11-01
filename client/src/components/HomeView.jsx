import { useState, useEffect } from "react";
import {
  IconGrid,
  IconClock,
  IconZap,
  IconLightbulb,
  IconWallet,
  IconCalendar,
  IconBookOpen,
  IconGraduationCap,
  IconArrowRight,
  IconChevronRight,
  IconSend,
  IconMessageSquare,
  IconSparkles,
  IconHeart
} from "./Icons.jsx";
import { api } from "../api.js";

export default function HomeView({
  user,
  onAskQuestion,
  onSelectCategory,
  onViewAllQueries,
  onContactSupport
}) {
  const [heroInput, setHeroInput] = useState("");
  const [robotFloating, setRobotFloating] = useState(false);
  const [mascotMsgIdx, setMascotMsgIdx] = useState(0);

  const mascotMessages = [
    "Hey there! Got a question? I'm just a click away.",
    "Ask me anything about fees, exams, or attendance!",
    "I'm your AI Student Helpdesk Assistant!"
  ];

  const handleMascotClick = () => {
    setRobotFloating(true);
    setMascotMsgIdx((prev) => (prev + 1) % mascotMessages.length);
    setTimeout(() => {
      setRobotFloating(false);
    }, 900);
  };
  const [recentQueries, setRecentQueries] = useState([
    {
      id: "rq1",
      query: "When is the assignment deadline for Data Structures?",
      category: "Assignments",
      time: "2 hours ago"
    },
    {
      id: "rq2",
      query: "What is the fee payment last date?",
      category: "Fees & Payments",
      time: "5 hours ago"
    },
    {
      id: "rq3",
      query: "How can I check my attendance?",
      category: "Attendance",
      time: "Yesterday"
    },
    {
      id: "rq4",
      query: "When will the exam schedule be released?",
      category: "Examinations",
      time: "Yesterday"
    }
  ]);

  useEffect(() => {
    api("/api/queries/recent")
      .then((records) => {
        if (records && records.length) {
          const formatted = records.slice(0, 4).map((r) => {
            const date = new Date(r.createdAt);
            const diffHours = Math.round((Date.now() - date.getTime()) / 3600000);
            const timeStr = diffHours < 1 ? "Just now" : diffHours < 24 ? `${diffHours} hours ago` : "Yesterday";
            return {
              id: r._id,
              query: r.query,
              category: r.category || "General",
              time: timeStr
            };
          });
          setRecentQueries(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const handleHeroSubmit = (e) => {
    if (e) e.preventDefault();
    if (heroInput.trim()) {
      onAskQuestion(heroInput.trim());
      setHeroInput("");
    }
  };

  const quickQuestions = [
    "When is the fee due date?",
    "What is the attendance policy?",
    "How to submit an assignment?",
    "When are the exams?",
    "How to reset my password?"
  ];

  return (
    <div className="home-dashboard">
      {/* 1. Hero Card with Robot Mascot */}
      <section className="hero-banner-card">
        <div className="hero-sparkle">
          <IconSparkles size={22} color="#A65D7B" />
        </div>

        <div className="hero-content">
          <h2 className="hero-greeting">
            Hi {user.name.split(" ")[0]}! <span className="wave">👋</span>
          </h2>
          <h3 className="hero-main-title">
            I'm your AI Student Helpdesk Assistant.
          </h3>
          <p className="hero-description">
            Ask me anything about your college — fees, attendance, exams, assignments and more!
          </p>

          {/* Floating Input Inside Hero */}
          <form className={`hero-input-box ${heroInput ? "has-text" : ""}`} onSubmit={handleHeroSubmit}>
            <IconMessageSquare size={18} color="#A65D7B" className="hero-chat-icon" />
            <input
              type="text"
              className="hero-input-field"
              placeholder="Type your question here..."
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
            />
            {heroInput && (
              <button
                type="button"
                className="hero-clear-btn"
                onClick={() => setHeroInput("")}
                title="Clear question"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="hero-send-btn"
              title="Send question"
              disabled={!heroInput.trim()}
            >
              <IconSend size={16} color="#493B46" />
            </button>
          </form>
        </div>

        {/* Robot Mascot SVG Illustration */}
        <div
          className={`hero-mascot-container ${robotFloating ? "floating-active" : ""}`}
          onClick={handleMascotClick}
          role="button"
          tabIndex={0}
          title="Click to interact with your AI Assistant!"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleMascotClick(); }}
        >
          <div className="mascot-speech-bubble">
            <span>{mascotMessages[mascotMsgIdx]}</span>
            <IconHeart size={12} color="#A65D7B" fill="#A65D7B" />
          </div>

          <svg className={`mascot-robot-svg ${robotFloating ? "floating-active" : ""}`} width="130" height="130" viewBox="0 0 130 130" fill="none">
            {/* Soft shadow */}
            <ellipse cx="65" cy="120" rx="36" ry="6" fill="#FFE2D5" opacity="0.8" />

            {/* Antenna */}
            <line x1="65" y1="20" x2="65" y2="35" stroke="#A65D7B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="65" cy="18" r="4.5" fill="#FFC9D9" stroke="#A65D7B" strokeWidth="1.5" />

            {/* Head */}
            <rect x="30" y="35" width="70" height="52" rx="20" fill="#FFFFFF" stroke="#F3DCE2" strokeWidth="2" />

            {/* Screen / Face Plate */}
            <rect x="37" y="42" width="56" height="38" rx="14" fill="#3D2D3A" />

            {/* Happy Blinking Eyes */}
            <path d="M48 58 Q53 53 58 58" stroke="#FFE2D5" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M72 58 Q77 53 82 58" stroke="#FFE2D5" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Cheeks */}
            <circle cx="45" cy="65" r="3.5" fill="#FFC9D9" opacity="0.9" />
            <circle cx="85" cy="65" r="3.5" fill="#FFC9D9" opacity="0.9" />

            {/* Body */}
            <rect x="42" y="90" width="46" height="26" rx="10" fill="#FFFFFF" stroke="#F3DCE2" strokeWidth="2" />
            {/* Heart on chest */}
            <path d="M65 99 C63 96, 59 96, 59 99 C59 103, 65 107, 65 107 C65 107, 71 103, 71 99 C71 96, 67 96, 65 99 Z" fill="#FFC9D9" />

            {/* Arms */}
            <path d="M38 96 C30 96, 28 84, 25 80" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <path d="M38 96 C30 96, 28 84, 25 80" stroke="#F3DCE2" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="24" cy="79" r="4" fill="#FFC9D9" />

            <path d="M92 96 C100 96, 102 84, 105 80" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <path d="M92 96 C100 96, 102 84, 105 80" stroke="#F3DCE2" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="106" cy="79" r="4" fill="#FFC9D9" />
          </svg>

          {/* Floating heart decoration */}
          <div className="floating-heart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#A65D7B" strokeWidth="1.5" fill="#FFF0EA" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Browse by Category Section */}
      <section className="categories-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <IconGrid size={20} color="#A65D7B" />
            <h3 className="section-title">Browse by Category</h3>
          </div>
          <button className="link-button" onClick={() => onSelectCategory("all")}>
            View all →
          </button>
        </div>

        <div className="category-cards-grid">
          {/* Card 1: Fees & Payments */}
          <div className="category-tile cat-fees" onClick={() => onSelectCategory("Fees & Payments")}>
            <div className="cat-icon-circle bg-orange">
              <IconWallet size={20} color="#B45309" />
            </div>
            <h4 className="cat-tile-title">Fees & Payments</h4>
            <p className="cat-tile-desc">Fee structure, payment methods, refunds</p>
            <div className="cat-arrow-btn">
              <IconArrowRight size={14} color="#B45309" />
            </div>
          </div>

          {/* Card 2: Attendance */}
          <div className="category-tile cat-attendance" onClick={() => onSelectCategory("Attendance")}>
            <div className="cat-icon-circle bg-rose">
              <IconCalendar size={20} color="#A65D7B" />
            </div>
            <h4 className="cat-tile-title">Attendance</h4>
            <p className="cat-tile-desc">Attendance rules, leave, absence</p>
            <div className="cat-arrow-btn">
              <IconArrowRight size={14} color="#A65D7B" />
            </div>
          </div>

          {/* Card 3: Assignments */}
          <div className="category-tile cat-assignments" onClick={() => onSelectCategory("Assignments")}>
            <div className="cat-icon-circle bg-purple">
              <IconBookOpen size={20} color="#6B46C1" />
            </div>
            <h4 className="cat-tile-title">Assignments</h4>
            <p className="cat-tile-desc">Submission, deadlines, projects</p>
            <div className="cat-arrow-btn">
              <IconArrowRight size={14} color="#6B46C1" />
            </div>
          </div>

          {/* Card 4: Examinations */}
          <div className="category-tile cat-exams" onClick={() => onSelectCategory("Examinations")}>
            <div className="cat-icon-circle bg-peach">
              <IconGraduationCap size={20} color="#C05621" />
            </div>
            <h4 className="cat-tile-title">Examinations</h4>
            <p className="cat-tile-desc">Exam schedule, results, re-evaluation</p>
            <div className="cat-arrow-btn">
              <IconArrowRight size={14} color="#C05621" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom Two-Column Split (Recent Queries + Right Sidebar) */}
      <div className="home-lower-columns">
        {/* Left Column: Recent Queries */}
        <section className="recent-queries-card">
          <div className="section-header">
            <div className="section-title-wrap">
              <IconClock size={19} color="#A65D7B" />
              <h3 className="section-title">Recent Queries</h3>
            </div>
            <button className="link-button" onClick={onViewAllQueries}>
              View all →
            </button>
          </div>

          <div className="recent-queries-list">
            {recentQueries.map((rq) => (
              <div
                key={rq.id}
                className="recent-query-row"
                onClick={() => onAskQuestion(rq.query)}
              >
                <div className="query-left">
                  <div className="query-circle-icon">
                    <IconMessageSquare size={15} color="#A65D7B" />
                  </div>
                  <div className="query-text-group">
                    <span className="query-title-text">{rq.query}</span>
                    <span className={`query-cat-pill cat-pill-${rq.category.toLowerCase().replace(/[^a-z]/g, "")}`}>
                      {rq.category}
                    </span>
                  </div>
                </div>

                <div className="query-right">
                  <span className="query-time-label">{rq.time}</span>
                  <IconChevronRight size={15} color="#A65D7B" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Quick Help, Need Help, and Quote */}
        <aside className="home-right-column">
          {/* Quick Help Card */}
          <div className="quick-help-card">
            <div className="card-top-header">
              <div className="card-header-icon-box">
                <IconZap size={18} color="#D97706" />
              </div>
              <div>
                <h4 className="quick-help-title">Quick Help</h4>
                <span className="quick-help-sub">Popular questions</span>
              </div>
            </div>

            <div className="quick-questions-list">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="quick-q-btn"
                  onClick={() => onAskQuestion(q)}
                >
                  <span>{q}</span>
                  <IconChevronRight size={14} color="#A65D7B" />
                </button>
              ))}
            </div>
          </div>

          {/* Need More Help? Card */}
          <div className="need-help-card">
            <div className="card-top-header">
              <div className="card-header-icon-box">
                <IconLightbulb size={18} color="#D97706" />
              </div>
              <div>
                <h4 className="need-help-title">Need More Help?</h4>
                <span className="need-help-sub">Still have questions?</span>
              </div>
            </div>
            <p className="need-help-desc">Our support team is here for you.</p>
            <button className="contact-support-btn" onClick={onContactSupport}>
              Contact Support
            </button>
          </div>

          {/* Cute Pink Inspiration Card */}
          <div className="inspiration-card">
            <div className="inspiration-text">
              Small steps<br />
              lead to big goals
              <IconHeart size={14} color="#A65D7B" fill="#A65D7B" style={{ marginLeft: "6px" }} />
            </div>

            {/* Hand-drawn flower/leaf branch */}
            <svg width="70" height="90" viewBox="0 0 70 90" fill="none" className="botanical-branch-svg">
              <path d="M35 85 C35 60, 42 40, 48 10" stroke="#A65D7B" strokeWidth="1.5" strokeLinecap="round" />
              {/* Leaves */}
              <path d="M44 30 C55 25, 62 30, 60 38 C52 40, 44 35, 44 30 Z" fill="#FFE2D5" stroke="#A65D7B" strokeWidth="1.2" />
              <path d="M42 45 C30 40, 22 45, 24 53 C32 55, 40 50, 42 45 Z" fill="#FFE2D5" stroke="#A65D7B" strokeWidth="1.2" />
              <path d="M46 60 C58 55, 65 60, 63 68 C55 70, 46 65, 46 60 Z" fill="#FFE2D5" stroke="#A65D7B" strokeWidth="1.2" />
            </svg>
          </div>
        </aside>
      </div>
    </div>
  );
}

