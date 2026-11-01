import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopNavbar from "./components/TopNavbar.jsx";
import HomeView from "./components/HomeView.jsx";
import AskQuestionView from "./components/AskQuestionView.jsx";
import FaqsView from "./components/FaqsView.jsx";
import CategoriesView from "./components/CategoriesView.jsx";
import MyQueriesView from "./components/MyQueriesView.jsx";
import AdminDashboardView from "./components/AdminDashboardView.jsx";
import ProfileView from "./components/ProfileView.jsx";
import ContactSupportModal from "./components/ContactSupportModal.jsx";
import LoginPage from "./components/LoginPage.jsx";
import { api } from "./api.js";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [systemInfo, setSystemInfo] = useState({
    database: "Connecting...",
    llmProvider: "Google Gemini 1.5 Flash",
    faqs: 12
  });

  const [chatInitialQuery, setChatInitialQuery] = useState("");
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);

  // Check saved login info on app launch
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem("helpdesk_saved_user");
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.email) {
          setUser(savedUser);
          setIsLoggedIn(true);
        }
      }
    } catch {}
    setAuthChecking(false);
  }, []);

  const fetchSystemData = () => {
    api("/api/health")
      .then((h) => {
        setSystemInfo({
          database: h.database || "Persistent Local Storage",
          llmProvider: h.llmProvider || "Google Gemini 1.5 Flash",
          faqs: h.faqs || 12
        });
      })
      .catch(() => {});

    api("/api/tickets")
      .then((t) => {
        if (t && Array.isArray(t)) {
          setOpenTicketsCount(t.filter((x) => x.status === "OPEN").length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSystemData();
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setCurrentView(loggedInUser.role === "admin" ? "admin" : "home");
  };

  const handleLogout = () => {
    localStorage.removeItem("helpdesk_saved_user");
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView("home");
  };

  const handleAskQuestionFromAnywhere = (queryText) => {
    setChatInitialQuery(queryText);
    setCurrentView("chat");
  };

  const handleGlobalSearch = (searchText) => {
    handleAskQuestionFromAnywhere(searchText);
  };

  // If still checking saved session, show brief clean loader
  if (authChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F5" }}>
        <div style={{ textAlign: "center", color: "#493B46", fontWeight: 700 }}>
          <div className="login-logo-box" style={{ margin: "0 auto 14px auto" }}>🌸</div>
          <div>Loading AI Student Helpdesk...</div>
        </div>
      </div>
    );
  }

  // 1st screen on opening: Login Page if not logged in!
  if (!isLoggedIn || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="helpdesk-app-shell">
      {/* 1. Left Sidebar Matching Mockup Exactly */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          if (view !== "chat") setChatInitialQuery("");
          setCurrentView(view);
        }}
        openTicketCount={openTicketsCount}
        onLogout={handleLogout}
      />

      {/* 2. Main Work Area */}
      <div className="helpdesk-main-content-area">
        {/* Top Navbar */}
        <TopNavbar
          user={user}
          setUser={setUser}
          onSearchSubmit={handleGlobalSearch}
          systemInfo={systemInfo}
          onLogout={handleLogout}
        />

        {/* View Switcher */}
        <main className="helpdesk-view-container">
          {currentView === "home" && (
            <HomeView
              user={user}
              onAskQuestion={handleAskQuestionFromAnywhere}
              onSelectCategory={(cat) => setCurrentView("categories")}
              onViewAllQueries={() => setCurrentView("my-queries")}
              onContactSupport={() => setSupportModalOpen(true)}
            />
          )}

          {currentView === "chat" && (
            <AskQuestionView
              initialQuery={chatInitialQuery}
              version="v3"
              onContactSupport={() => setSupportModalOpen(true)}
            />
          )}

          {currentView === "faqs" && (
            <FaqsView onAskQuestion={handleAskQuestionFromAnywhere} />
          )}

          {currentView === "categories" && (
            <CategoriesView
              onAskQuestion={handleAskQuestionFromAnywhere}
              onSelectCategory={(cat) => handleAskQuestionFromAnywhere(`Tell me about ${cat}`)}
            />
          )}

          {currentView === "my-queries" && (
            <MyQueriesView onAskQuestion={handleAskQuestionFromAnywhere} />
          )}

          {currentView === "admin" && <AdminDashboardView />}

          {currentView === "profile" && (
            <ProfileView
              user={user}
              setUser={setUser}
              systemInfo={systemInfo}
            />
          )}
        </main>

        {/* Bottom Footer Bar Matching Mockup */}
        <footer className="helpdesk-footer-bar">
          <div className="footer-left">
            Student Helpdesk • Learn • Grow • Succeed
          </div>
          <div className="footer-right">
            <span>💖 A smarter campus experience</span>
          </div>
        </footer>
      </div>

      {/* Support Escalation Modal */}
      {supportModalOpen && (
        <ContactSupportModal
          onClose={() => setSupportModalOpen(false)}
          onSuccess={() => fetchSystemData()}
        />
      )}
    </div>
  );
}
