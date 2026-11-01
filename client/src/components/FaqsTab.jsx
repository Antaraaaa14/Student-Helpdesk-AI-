import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function FaqsTab({ onSelectFaq }) {
  const [data, setData] = useState({ categories: [], faqs: [] });
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/api/faqs").then(setData).catch(() => {});
  }, []);

  const filteredFaqs = (data.faqs || []).filter((f) => {
    if (selectedCat !== "all" && f.cat !== selectedCat) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s) || f.kw.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div>
      <div className="card peach">
        <div className="card-header">
          <h2 className="card-title">
            <span>📚</span> Approved Knowledge Base (12 University FAQs)
          </h2>
          <span className="badge badge-lilac">
            Factual Grounding Reference
          </span>
        </div>

        <p style={{ margin: "0 0 14px 0", color: "var(--text-mauve)", fontSize: "14.5px" }}>
          All AI draft responses are strictly grounded in these 12 approved university FAQs. The TF-IDF cosine classifier retrieves the closest FAQ, and the 5-point verification rubric blocks any fabricated facts or dates.
        </p>

        {/* Filter Bar */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search FAQs by question, answer or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "280px", padding: "7px 12px" }}
          />

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            style={{ padding: "7px 12px" }}
          >
            <option value="all">All Categories ({data.faqs?.length || 0})</option>
            {(data.categories || []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs Cards Grid */}
      <div className="faq-grid">
        {filteredFaqs.map((f) => (
          <div key={f.id} className="faq-card">
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="faq-cat">{f.cat}</span>
                <span className="badge badge-peach" style={{ fontWeight: 800 }}>{f.id}</span>
              </div>
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>

            <div style={{ borderTop: "1px dashed var(--border-pink)", paddingTop: "10px", marginTop: "10px" }}>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "8px" }}>
                <b>Ingested Keywords:</b> {f.kw}
              </div>
              <button
                className="btn btn-sm btn-primary"
                style={{ width: "100%" }}
                onClick={() => onSelectFaq(f.q)}
              >
                ⚡ Test This FAQ in Assistant
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

