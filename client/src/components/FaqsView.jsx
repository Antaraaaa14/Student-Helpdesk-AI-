import { useState, useEffect } from "react";
import { IconSearch, IconFileText, IconChevronRight } from "./Icons.jsx";
import { api } from "../api.js";

export default function FaqsView({ onAskQuestion }) {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api("/api/faqs")
      .then((res) => {
        setFaqs(res.faqs || []);
        setCategories(res.categories || []);
      })
      .catch(() => {});
  }, []);

  const filteredFaqs = faqs.filter((f) => {
    if (selectedCat !== "all" && f.cat !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || (f.kw && f.kw.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="faqs-page-layout">
      {/* Header */}
      <div className="page-header-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="page-icon-square">
            <IconFileText size={22} color="#A65D7B" />
          </div>
          <div>
            <h2 className="page-title">Approved College FAQs</h2>
            <p className="page-desc">
              All official college answers verified and approved by the academic administration.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className={`search-bar-container faq-search-box ${search ? "has-text" : ""}`} style={{ width: "340px", marginTop: "10px" }}>
          <IconSearch size={16} color="#A65D7B" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search FAQs by question or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="category-filter-chips">
        <button
          className={`filter-chip-btn ${selectedCat === "all" ? "active" : ""}`}
          onClick={() => setSelectedCat("all")}
        >
          All Categories ({faqs.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-chip-btn ${selectedCat === c ? "active" : ""}`}
            onClick={() => setSelectedCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FAQs List Accordion */}
      <div className="faqs-accordion-list">
        {filteredFaqs.map((f) => {
          const isExpanded = expandedId === f.id;
          return (
            <div key={f.id} className={`faq-accordion-item ${isExpanded ? "open" : ""}`}>
              <div
                className="faq-accordion-header"
                onClick={() => setExpandedId(isExpanded ? null : f.id)}
              >
                <div className="faq-header-left">
                  <span className="faq-id-badge">{f.id}</span>
                  <span className="faq-question-text">{f.q}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="faq-cat-tag">{f.cat}</span>
                  <div className={`faq-chevron ${isExpanded ? "rotated" : ""}`}>
                    <IconChevronRight size={16} color="#A65D7B" />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="faq-accordion-body">
                  <p className="faq-answer-text">{f.a}</p>
                  <div className="faq-keywords-row">
                    <b>Ingested Keywords:</b> {f.kw}
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onAskQuestion(f.q)}
                    >
                      Ask AI about this topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="empty-state-box">
            No approved FAQs found matching your search. Try typing a general keyword or ask the AI assistant.
          </div>
        )}
      </div>
    </div>
  );
}

