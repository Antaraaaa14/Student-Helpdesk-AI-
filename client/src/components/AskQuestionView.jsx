import { useState, useEffect, useRef } from "react";
import {
  IconSend,
  IconCopy,
  IconThumbsUp,
  IconThumbsDown,
  IconSparkles,
  IconClock,
  IconShield,
  IconArrowRight
} from "./Icons.jsx";
import { api } from "../api.js";

export default function AskQuestionView({ initialQuery, version = "v3", onContactSupport }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesStreamRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    const el = messagesStreamRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior });

    // Multi-tier timers ensure container catches async React render + bubble slide-up animation
    setTimeout(() => {
      if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    }, 60);

    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 220);

    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 450);
  };

  const handleStreamScroll = () => {
    const el = messagesStreamRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottomBtn(distanceFromBottom > 120);
  };

  // Load active conversations
  useEffect(() => {
    api("/api/conversations")
      .then((convs) => {
        setConversations(convs || []);
        if (convs && convs.length) {
          const latest = convs[0];
          setConversationId(latest._id);
          setMessages(latest.messages || []);
        } else {
          setMessages([
            {
              id: "init",
              sender: "ai",
              text: "Hello! I am your AI Student Helpdesk Assistant. Ask me anything about semester fees, exam dates, attendance rules, assignments, or campus facilities. How can I help you today?",
              category: "Welcome",
              confidence: 1.0,
              timestamp: new Date().toISOString()
            }
          ]);
        }
        scrollToBottom();
      })
      .catch(() => {});
  }, []);

  // If initialQuery passed from home search or quick help, execute it automatically!
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      sendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, busy]);

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim() || busy) return;

    setInput("");
    const tempStudentMsg = {
      id: "temp_" + Date.now(),
      sender: "student",
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempStudentMsg]);
    setBusy(true);
    scrollToBottom();

    try {
      const res = await api("/api/chat/message", "POST", {
        conversationId,
        query,
        version
      });

      if (res && res.message) {
        setMessages((prev) => [...prev, res.message]);
        if (res.conversationId) setConversationId(res.conversationId);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "ai",
          text: "I encountered an error connecting to the service. Please try again or click Contact Support below.",
          category: "Error",
          timestamp: new Date().toISOString()
        }
      ]);
    }
    setBusy(false);
    scrollToBottom();
    inputRef.current?.focus();
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (msgId, helpful) => {
    setFeedbackGiven((prev) => ({ ...prev, [msgId]: helpful ? "up" : "down" }));
    try {
      await api("/api/feedback", "POST", {
        messageId: msgId,
        helpful
      });
    } catch {}
  };

  const startNewChat = async () => {
    try {
      const newConv = await api("/api/conversations/new", "POST", { title: "New Assistance Chat" });
      setConversationId(newConv._id);
      setMessages([
        {
          id: "init_" + Date.now(),
          sender: "ai",
          text: "Hi! Started a new chat. What would you like to know?",
          category: "Welcome",
          confidence: 1.0,
          timestamp: new Date().toISOString()
        }
      ]);
      setConversations((prev) => [newConv, ...prev]);
      scrollToBottom();
      inputRef.current?.focus();
    } catch {}
  };

  const clearMessages = () => {
    setMessages([
      {
        id: "cleared_" + Date.now(),
        sender: "ai",
        text: "Conversation cleared. How can I assist you with your campus queries?",
        category: "Welcome",
        confidence: 1.0,
        timestamp: new Date().toISOString()
      }
    ]);
    scrollToBottom();
  };

  const switchConversation = async (conv) => {
    setConversationId(conv._id);
    setMessages(conv.messages || []);
    scrollToBottom();
  };

  const followUpSuggestions = [
    "What is the penalty for late fee payment?",
    "Where is the exam hall located?",
    "How to submit an assignment on Moodle?",
    "What is the attendance policy?",
    "How to reset my password?"
  ];

  return (
    <div className="chat-assistant-layout">
      {/* Sidebar: Conversation Sessions */}
      <aside className="chat-sidebar-panel">
        <div className="chat-sidebar-top">
          <button className="new-chat-btn" onClick={startNewChat}>
            <span>+ New Conversation</span>
          </button>
        </div>

        <div className="conversation-history-list">
          <div className="chat-history-label">Previous Chats</div>
          {conversations.map((c) => (
            <button
              key={c._id}
              className={`conv-tab-btn ${c._id === conversationId ? "active" : ""}`}
              onClick={() => switchConversation(c)}
            >
              <IconClock size={14} color="#A65D7B" />
              <span className="conv-title">{c.title || "Helpdesk Chat"}</span>
            </button>
          ))}
        </div>

        <div className="chat-sidebar-footer">
          <button
            className="btn btn-sm"
            style={{ width: "100%", marginBottom: "10px" }}
            onClick={clearMessages}
          >
            Clear Current Chat
          </button>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Google Gemini 1.5 Flash • 12 Approved FAQs
          </div>
        </div>
      </aside>

      {/* Main Chat Thread */}
      <section className="chat-main-panel">
        <div className="chat-header-bar">
          <div className="chat-header-left">
            <div className="chat-mascot-avatar">
              <IconSparkles size={16} color="#A65D7B" />
            </div>
            <div>
              <h3 className="chat-title">AI Student Helpdesk Assistant</h3>
              <span className="chat-sub">Grounded Official College Information</span>
            </div>
          </div>

          <div className="chat-header-right">
            <button
              className="btn btn-sm"
              onClick={startNewChat}
              style={{ marginRight: "8px" }}
            >
              + New Chat
            </button>
            <span className="badge badge-lilac">5-Point Rubric Verification Active</span>
          </div>
        </div>

        {/* Message Stream */}
        <div
          ref={messagesStreamRef}
          onScroll={handleStreamScroll}
          className="messages-stream-box"
        >
          {messages.map((m) => {
            const isStudent = m.sender === "student";
            return (
              <div key={m.id} className={`message-bubble-row ${isStudent ? "student-row" : "ai-row"}`}>
                {!isStudent && (
                  <div className="ai-mascot-icon">
                    <IconSparkles size={15} color="#A65D7B" />
                  </div>
                )}

                <div className={`message-bubble-card ${isStudent ? "student-bubble" : "ai-bubble"}`}>
                  <div className="message-text">{m.text}</div>

                  {/* AI Metadata Tags & Sources */}
                  {!isStudent && m.category && m.category !== "Welcome" && (
                    <div className="ai-metadata-box">
                      <div className="meta-chips-row">
                        <span className="meta-chip category">
                          {m.category}
                        </span>
                        {m.confidence !== undefined && (
                          <span className="meta-chip confidence">
                            {Math.round(m.confidence * 100)}% Confidence
                          </span>
                        )}
                        {m.ticket && (
                          <span className="meta-chip ticket">
                            Escalated Ticket: {m.ticket}
                          </span>
                        )}
                        {m.score && (
                          <span className="meta-chip score">
                            Rubric: {m.score}/5 {m.verdict}
                          </span>
                        )}
                      </div>

                      {m.faqTitle && (
                        <div className="source-citation">
                          <b>Source:</b> FAQ {m.faqId} — <i>"{m.faqTitle}"</i>
                        </div>
                      )}

                      {/* Action buttons (Copy, Thumbs, Escalate) */}
                      <div className="message-actions-bar">
                        <button
                          className="msg-action-btn"
                          onClick={() => handleCopy(m.text, m.id)}
                          title="Copy reply"
                        >
                          <IconCopy size={13} color="#A65D7B" />
                          <span>{copiedId === m.id ? "Copied!" : "Copy"}</span>
                        </button>

                        <button
                          className={`msg-action-btn ${feedbackGiven[m.id] === "up" ? "active-fb" : ""}`}
                          onClick={() => handleFeedback(m.id, true)}
                          title="Helpful"
                        >
                          <IconThumbsUp size={13} color="#A65D7B" />
                        </button>

                        <button
                          className={`msg-action-btn ${feedbackGiven[m.id] === "down" ? "active-fb" : ""}`}
                          onClick={() => handleFeedback(m.id, false)}
                          title="Not helpful"
                        >
                          <IconThumbsDown size={13} color="#A65D7B" />
                        </button>

                        <button
                          className="msg-action-btn escalate"
                          onClick={onContactSupport}
                          title="Escalate to human helpdesk officer"
                        >
                          <IconShield size={13} color="#991B1B" />
                          <span>Escalate to Staff</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="msg-timestamp">
                    {new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {isStudent && (
                  <div className="student-avatar-icon" title="You (Student)">
                    🎓
                  </div>
                )}
              </div>
            );
          })}

          {busy && (
            <div className="message-bubble-row ai-row">
              <div className="ai-mascot-icon">
                <IconSparkles size={15} color="#A65D7B" />
              </div>
              <div className="message-bubble-card ai-bubble typing-bubble">
                <div className="typing-dots-group">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
                <span className="typing-status-label">AI is verifying official college groundings...</span>
              </div>
            </div>
          )}

          {/* Dedicated bottom breathing space so latest message is never cut off */}
          <div style={{ height: "36px", minHeight: "36px", flexShrink: 0 }} />
          <div ref={messagesEndRef} style={{ height: "1px" }} />

          {/* Jump to bottom pill if user scrolled up */}
          {showScrollBottomBtn && (
            <button
              className="scroll-to-bottom-pill"
              onClick={() => scrollToBottom("smooth")}
              title="Jump to latest response"
            >
              <span>↓ Jump to latest</span>
            </button>
          )}
        </div>

        {/* Follow-up suggestions */}
        <div className="followup-suggestions-bar">
          <div className="followup-header">
            <span className="followup-sparkle">💡</span>
            <span className="followup-label">Suggested:</span>
          </div>
          <div className="followup-chips-scroller">
            {followUpSuggestions.map((s, idx) => (
              <button key={idx} className="followup-pill-btn" onClick={() => sendMessage(s)}>
                <span>{s}</span>
                <IconArrowRight size={11} color="#A65D7B" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="chat-input-container">
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-text-input"
              placeholder="Ask a question in plain English (e.g. Can I pay fees in installments?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
            />
            <button
              type="submit"
              className="chat-send-submit-btn"
              disabled={!input.trim() || busy}
            >
              <IconSend size={16} color="#493B46" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
