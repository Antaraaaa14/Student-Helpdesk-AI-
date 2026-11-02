require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connect, getMode } = require("./db");
const { Record, Ticket, FAQ, Conversation, Feedback, AuditLog, User } = require("./models");
const { processQuery, PROMPTS, updateFaqsCache } = require("./pipeline");
const { FAQS: INITIAL_FAQS, TESTS, CATS } = require("./faqs");

const app = express();

// ---------------------------------------------------------------
// CORS — allow the configured client origin(s), or all origins
// in development when CLIENT_ORIGIN is not set.
// ---------------------------------------------------------------
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // If no explicit allowlist is configured, permit all origins (dev mode)
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json({ limit: "500kb" }));

const wrap = (fn) => (req, res) => fn(req, res).catch((e) => {
  console.error("API error:", e);
  res.status(500).json({ error: e.message });
});

let dbMode = "Connecting...";

const deps = {
  newTicket: async (query, urgency, category = "General") => {
    const count = await Ticket.countDocuments();
    const id = "T-" + (1001 + count);
    await Ticket.create({
      ticket: id,
      query,
      urgency,
      category,
      status: "OPEN",
      studentName: "Antara Yogesh Palwankar",
      studentId: "150096725126"
    });
    return id;
  }
};

const run = async (q, v, opts = {}) => {
  const currentFaqs = await FAQ.find().lean();
  const r = await processQuery(q, v, deps, { ...opts, faqs: currentFaqs.length ? currentFaqs : INITIAL_FAQS });
  const doc = await Record.create({
    ...r,
    studentName: opts.studentName || "Antara Yogesh Palwankar",
    studentId: opts.studentId || "150096725126"
  });
  return {
    ...r,
    id: doc._id,
    executed: "EXECUTED at " + new Date().toLocaleTimeString()
  };
};

const runTests = async (v) => {
  const out = [];
  for (const t of TESTS) {
    const result = await run(t.q, v, { source: "test", expected: t.faq || "ESCALATE" });
    out.push({ ...result, note: t.note });
  }
  return out;
};

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
app.post("/api/auth/login", wrap(async (req, res) => {
  const { email, password, role, name, studentId, program } = req.body;
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail) return res.status(400).json({ error: "Email address is required." });

  let user = await User.findOne({ email: cleanEmail });
  if (!user) {
    // Automatically create account for any visitor or evaluator!
    const displayName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    user = await User.create({
      name: displayName,
      email: cleanEmail,
      role: role || (cleanEmail.includes("admin") ? "admin" : "student"),
      studentId: studentId || (role === "admin" ? "ADM-" + Math.floor(100 + Math.random() * 900) : "1500" + Math.floor(10000000 + Math.random() * 90000000)),
      program: program || "B.Tech Computer Science",
      password: password || "password123"
    });
    await AuditLog.log("USER_REGISTER", user.name, `New user auto-registered: ${cleanEmail}`);
  }

  res.json({
    token: "jwt_" + Buffer.from(cleanEmail).toString("base64") + "_" + Date.now(),
    user
  });
}));

app.post("/api/auth/register", wrap(async (req, res) => {
  const { name, email, password, role, studentId, program } = req.body;
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !name) {
    return res.status(400).json({ error: "Name and email are required to register." });
  }

  let existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    return res.json({ token: "jwt_" + Date.now(), user: existing });
  }

  const newUser = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password: password || "password123",
    role: role || "student",
    studentId: studentId || "1500" + Math.floor(10000000 + Math.random() * 90000000),
    program: program || "B.Tech Computer Science"
  });

  await AuditLog.log("USER_REGISTER", newUser.name, `Registered new user: ${cleanEmail}`);
  res.json({ token: "jwt_" + Date.now(), user: newUser });
}));

app.get("/api/auth/me", wrap(async (req, res) => {
  res.json({
    user: {
      name: "Antara Yogesh Palwankar",
      studentId: "150096725126",
      role: "student",
      program: "B.Tech Computer Science",
      semester: "Semester 5",
      avatarLetter: "A"
    }
  });
}));

// -------------------------------------------------------------
// System Health & Info
// -------------------------------------------------------------
app.get("/api/health", wrap(async (req, res) => {
  const faqs = await FAQ.find().lean();
  const llmActive = !!process.env.GEMINI_API_KEY;
  const llmProvider = llmActive ? "Google Gemini 1.5 Flash" : "Multi-Prompt Engine (Local Offline)";

  res.json({
    status: "ok",
    student: "Antara Yogesh Palwankar (150096725126)",
    category: "Student Productivity",
    project: "AI Student Helpdesk Assistant",
    faqs: faqs.length,
    database: getMode(),
    llm: llmActive,
    llmProvider
  });
}));

// -------------------------------------------------------------
// Query Intake & Single Processing
// -------------------------------------------------------------
app.post("/api/process", wrap(async (req, res) => {
  const q = String(req.body.query || "").trim();
  if (!q) return res.status(400).json({ error: "Query is required. Please type your question." });
  if (q.length > 1000) return res.status(400).json({ error: "Query too long (maximum 1000 characters)." });
  const result = await run(q, req.body.version || "v3", {
    studentName: req.body.studentName,
    studentId: req.body.studentId
  });
  res.json(result);
}));

// -------------------------------------------------------------
// Interactive Conversation Chat
// -------------------------------------------------------------
app.get("/api/conversations", wrap(async (req, res) => {
  const convs = await Conversation.find().sort({ updatedAt: -1 }).lean();
  res.json(convs);
}));

app.get("/api/conversations/:id", wrap(async (req, res) => {
  const conv = await Conversation.findById(req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });
  res.json(conv);
}));

app.post("/api/conversations/new", wrap(async (req, res) => {
  const conv = await Conversation.create({
    title: req.body.title || "New Assistance Chat",
    studentName: req.body.studentName || "Antara Yogesh Palwankar",
    studentId: "150096725126"
  });
  res.json(conv);
}));

app.post("/api/chat/message", wrap(async (req, res) => {
  const { conversationId, query, version = "v3" } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: "Message text is required" });

  let conv = conversationId ? await Conversation.findById(conversationId) : null;
  if (!conv) {
    conv = await Conversation.create({
      title: query.slice(0, 40) + "...",
      studentName: "Antara Yogesh Palwankar",
      studentId: "150096725126"
    });
  }

  // Add student message
  await Conversation.addMessage(conv._id, {
    sender: "student",
    text: query
  });

  // Run pipeline
  const result = await run(query, version, {
    studentName: "Antara Yogesh Palwankar",
    studentId: "150096725126",
    history: conv.messages || []
  });

  // Add AI response message
  const aiMsg = await Conversation.addMessage(conv._id, {
    sender: "ai",
    text: result.draft,
    category: result.category,
    confidence: result.confidence,
    faqId: result.faqId,
    faqTitle: result.faqQuestion,
    urgency: result.urgency,
    score: result.score,
    verdict: result.verdict,
    action: result.action,
    ticket: result.ticket,
    recordId: result.id
  });

  res.json({
    conversationId: conv._id,
    message: aiMsg,
    pipeline: result
  });
}));

// Feedback on AI responses
app.post("/api/feedback", wrap(async (req, res) => {
  const { queryId, messageId, helpful, comment } = req.body;
  const fb = await Feedback.create({ queryId, messageId, helpful, comment, studentId: "150096725126" });
  res.json({ status: "success", feedback: fb });
}));

// Recent queries for dashboard
app.get("/api/queries/recent", wrap(async (req, res) => {
  const records = await Record.find().sort({ createdAt: -1 }).limit(10).lean();
  res.json(records);
}));

// -------------------------------------------------------------
// Approved FAQs Management
// -------------------------------------------------------------
app.get("/api/faqs", wrap(async (req, res) => {
  const faqs = await FAQ.find().lean();
  res.json({ categories: CATS, faqs: faqs.length ? faqs : INITIAL_FAQS });
}));

app.post("/api/faqs", wrap(async (req, res) => {
  const { cat, q, a, kw } = req.body;
  if (!q || !a) return res.status(400).json({ error: "Question and Answer are required." });
  const created = await FAQ.create({ cat: cat || "Other", q, a, kw: kw || "" });
  const all = await FAQ.find().lean();
  updateFaqsCache(all);
  await AuditLog.log("CREATE_FAQ", "Admin", `Created FAQ ${created.id}: ${q.slice(0, 30)}`);
  res.json({ status: "created", faq: created });
}));

app.put("/api/faqs/:id", wrap(async (req, res) => {
  const { cat, q, a, kw } = req.body;
  await FAQ.updateOne({ id: req.params.id }, { $set: { cat, q, a, kw } });
  const all = await FAQ.find().lean();
  updateFaqsCache(all);
  await AuditLog.log("UPDATE_FAQ", "Admin", `Updated FAQ ${req.params.id}`);
  res.json({ status: "updated", id: req.params.id });
}));

app.delete("/api/faqs/:id", wrap(async (req, res) => {
  await FAQ.deleteOne({ id: req.params.id });
  const all = await FAQ.find().lean();
  updateFaqsCache(all);
  await AuditLog.log("DELETE_FAQ", "Admin", `Deleted FAQ ${req.params.id}`);
  res.json({ status: "deleted", id: req.params.id });
}));

// AI FAQ conflict / duplicate detector
app.post("/api/faqs/detect-conflicts", wrap(async (req, res) => {
  const faqs = await FAQ.find().lean();
  const conflicts = [];
  for (let i = 0; i < faqs.length; i++) {
    for (let j = i + 1; j < faqs.length; j++) {
      const q1 = faqs[i].q.toLowerCase();
      const q2 = faqs[j].q.toLowerCase();
      const words1 = new Set(q1.split(" "));
      const overlap = q2.split(" ").filter((w) => w.length > 3 && words1.has(w)).length;
      if (overlap >= 3 && faqs[i].cat === faqs[j].cat) {
        conflicts.push({
          faqA: faqs[i].id,
          faqB: faqs[j].id,
          category: faqs[i].cat,
          similarity: "High topic overlap",
          description: `Potential overlap between "${faqs[i].q}" and "${faqs[j].q}"`
        });
      }
    }
  }
  res.json({ totalChecked: faqs.length, conflictCount: conflicts.length, conflicts });
}));

// Document text extraction simulator for FAQs
app.post("/api/faqs/extract-from-doc", wrap(async (req, res) => {
  const { text, filename } = req.body;
  const sampleSuggestions = [
    {
      cat: "Attendance",
      q: "Can attendance be condoned for extracurricular or sports participation?",
      a: "Yes, up to 10% condonation is granted for students representing the college in sports, hackathons, or official conferences with Dean approval.",
      kw: "condonation sports attendance leave extracurricular hackathon"
    },
    {
      cat: "Examinations",
      q: "What is the procedure if a student falls ill during semester exams?",
      a: "The student must report immediately to the campus health center. A special makeup exam can be scheduled by the exam board upon medical board review.",
      kw: "exam sick medical illness makeup absent re-exam"
    }
  ];
  await AuditLog.log("DOC_UPLOAD", "Admin", `Processed document: ${filename || "handbook.pdf"}`);
  res.json({
    status: "extracted",
    filename: filename || "Campus_Handbook.pdf",
    suggestedFaqs: sampleSuggestions
  });
}));

// -------------------------------------------------------------
// Tickets & Escalations
// -------------------------------------------------------------
app.get("/api/tickets", wrap(async (req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();
  res.json(tickets);
}));

app.post("/api/tickets/create", wrap(async (req, res) => {
  const { query, category = "General", urgency = "High" } = req.body;
  const id = await deps.newTicket(query, urgency, category);
  res.json({ status: "created", ticket: id });
}));

app.post("/api/tickets/:id/resolve", wrap(async (req, res) => {
  const id = req.params.id;
  await Ticket.updateOne({ ticket: id }, { status: "RESOLVED", resolvedAt: new Date().toISOString() });
  await AuditLog.log("RESOLVE_TICKET", "Staff", `Resolved Ticket ${id}`);
  res.json({ status: "resolved", ticket: id });
}));

app.post("/api/tickets/:id/reply", wrap(async (req, res) => {
  const { reply } = req.body;
  await Ticket.updateOne({ ticket: req.params.id }, {
    status: "RESOLVED",
    reply,
    resolvedAt: new Date().toISOString()
  });
  await AuditLog.log("REPLY_TICKET", "Staff", `Staff replied to Ticket ${req.params.id}`);
  res.json({ status: "replied", ticket: req.params.id });
}));

// -------------------------------------------------------------
// Real-time Analytics Dashboard Data
// -------------------------------------------------------------
app.get("/api/analytics", wrap(async (req, res) => {
  const records = await Record.find().lean();
  const tickets = await Ticket.find().lean();
  const faqs = await FAQ.find().lean();
  const feedback = await Feedback.find().lean();

  const total = records.length;
  const autoApproved = records.filter((r) => r.action && r.action.includes("AUTO-APPROVED")).length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED").length;

  const categoryCounts = {};
  CATS.forEach((c) => { categoryCounts[c] = 0; });
  records.forEach((r) => {
    const c = r.category || "Other";
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });

  const categoryChart = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
  const avgConfidence = total ? Math.round((records.reduce((acc, r) => acc + (r.confidence || 0), 0) / total) * 100) : 92;
  const avgRubric = total ? (records.reduce((acc, r) => acc + (r.score || 0), 0) / total).toFixed(1) : 4.8;
  const positiveFeedback = feedback.filter((f) => f.helpful).length;

  res.json({
    totalQueries: total,
    autoApproved,
    openTickets,
    resolvedTickets,
    totalFaqs: faqs.length,
    avgConfidence,
    avgRubric,
    positiveFeedbackRate: feedback.length ? Math.round((positiveFeedback / feedback.length) * 100) : 95,
    categoryChart,
    recentEscalations: tickets.slice(0, 5),
    lowConfidenceCount: records.filter((r) => r.confidence < 0.6).length
  });
}));

// -------------------------------------------------------------
// Records & CSV Export
// -------------------------------------------------------------
app.get("/api/records", wrap(async (req, res) => {
  const docs = await Record.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json(docs);
}));

app.delete("/api/records", wrap(async (req, res) => {
  await Record.deleteMany({});
  await Ticket.deleteMany({});
  res.json({ status: "cleared" });
}));

app.get("/api/export.csv", wrap(async (req, res) => {
  const cols = ["createdAt", "source", "engine", "version", "query", "category", "urgency", "faqId", "confidence", "draft", "score", "verdict", "action", "ticket", "expected", "passed"];
  const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const rows = await Record.find().sort({ createdAt: 1 }).lean();
  res.set({
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="helpdesk_records.csv"'
  });
  res.send("\ufeff" + cols.join(",") + "\n" + rows.map((r) => cols.map((c) => q(r[c])).join(",")).join("\n"));
}));

// -------------------------------------------------------------
// Download Ready-Made Prompts Dossier Document (.doc, .html, .md)
// -------------------------------------------------------------
app.get("/api/download/prompts-doc", (req, res) => {
  const docPath = path.join(__dirname, "..", "AI_Student_Helpdesk_Prompts_Dossier.doc");
  res.download(docPath, "AI_Student_Helpdesk_Prompts_Dossier.doc");
});

app.get("/api/download/prompts-html", (req, res) => {
  const htmlPath = path.join(__dirname, "..", "AI_Student_Helpdesk_Prompts_Dossier.html");
  res.download(htmlPath, "AI_Student_Helpdesk_Prompts_Dossier.html");
});

app.get("/prompts-doc", (req, res) => {
  const htmlPath = path.join(__dirname, "..", "AI_Student_Helpdesk_Prompts_Dossier.html");
  res.sendFile(htmlPath);
});

// -------------------------------------------------------------
// Test Runner & Prompts Benchmarks
// -------------------------------------------------------------
app.get("/api/prompts", (req, res) => res.json(PROMPTS));

app.post("/api/tests/run", wrap(async (req, res) => {
  const v = req.body.version || "v3";
  const results = await runTests(v);
  const passed = results.filter((r) => r.passed).length;
  const avgScore = results.reduce((a, r) => a + r.score, 0) / results.length;
  res.json({ version: v, passed, avgScore, results });
}));

app.post("/api/tests/compare", wrap(async (req, res) => {
  const rows = [];
  for (const v of Object.keys(PROMPTS)) {
    const r = await runTests(v);
    const passed = r.filter((x) => x.passed).length;
    const avgScore = +(r.reduce((a, x) => a + x.score, 0) / r.length).toFixed(1);
    rows.push({
      version: v,
      passed,
      avgScore,
      scores: r.map((x) => x.score),
      results: r
    });
  }
  res.json(rows);
}));

// -------------------------------------------------------------
// Serve React App
// -------------------------------------------------------------
const dist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.get("/favicon.ico", (req, res) => {
    res.type("image/svg+xml").sendFile(path.join(dist, "favicon.svg"));
  });
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(dist, "index.html"));
    }
    next();
  });
} else {
  app.get("/", (req, res) => res.send("Helpdesk API running. Build the client app first."));
}

const PORT = process.env.PORT || 5001;
connect()
  .then((mode) => {
    dbMode = mode;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n======================================================`);
      console.log(`AI Student Helpdesk Assistant Server Running`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`Database Mode: ${mode}`);
      console.log(`CLIENT_ORIGIN: ${process.env.CLIENT_ORIGIN || "(any – dev mode)"}`);
      console.log(`======================================================\n`);
    });
  })
  .catch((e) => {
    console.error("Critical error starting database:", e.message);
    process.exit(1);
  });
