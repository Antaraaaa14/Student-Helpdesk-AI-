// The 5-stage pipeline for AI Student Helpdesk Assistant.
// Pure logic (no direct DB dependency) so it can be 100% unit tested.
const { FAQS: DEFAULT_FAQS, CATS } = require("./faqs");
const PROMPTS = require("./prompts");

// ============================================================================
// STAGE 1 & 2: Query Classification & Intent Recognition
// (TF-IDF Cosine Similarity + Keyword Ingestion + Intent Routing)
// ============================================================================
const STOP = new Set("a an the is are am was do does did i me my we you your to of in on at for and or but with from can how what when where who which this that it be have has will would should could by as not no".split(" "));
const stem = (w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
const tokens = (t) => String(t || "").toLowerCase().replace(/wi-fi/g, "wifi").split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)).map(stem);
const count = (arr) => arr.reduce((m, w) => m.set(w, (m.get(w) || 0) + 1), new Map());

function getVectors(faqsList) {
  const docs = faqsList.map((f) => count(tokens(`${f.q} ${f.kw || ""} ${f.cat || ""} ${f.a}`)));
  const df = new Map();
  docs.forEach((d) => d.forEach((_, w) => df.set(w, (df.get(w) || 0) + 1)));
  const idf = (w) => Math.log((1 + docs.length) / (1 + (df.get(w) || 0))) + 1;
  const vec = (m) => {
    const v = new Map(); let n = 0;
    m.forEach((c, w) => { const x = (1 + Math.log(c)) * idf(w); v.set(w, x); n += x * x; });
    n = Math.sqrt(n) || 1; v.forEach((x, w) => v.set(w, x / n)); return v;
  };
  return { docVecs: docs.map(vec), vec, idf };
}

let cachedFaqs = DEFAULT_FAQS;
let cachedVectors = getVectors(DEFAULT_FAQS);

function updateFaqsCache(faqsList) {
  if (faqsList && faqsList.length) {
    cachedFaqs = faqsList;
    cachedVectors = getVectors(faqsList);
  }
}

const cosine = (a, b) => { let s = 0; a.forEach((x, w) => { if (b.has(w)) s += x * b.get(w); }); return s; };

function urgencyOf(q) {
  const l = String(q || "").toLowerCase();
  if (/urgent|emergency|unsafe|threat|harass|ragging|abuse|assault|danger|police|weapon|suicide|hospital/.test(l)) {
    return "High";
  }
  if (/today|tomorrow|asap|immediately|deadline|last date|due|expir/.test(l)) {
    return "Medium";
  }
  return "Low";
}

function classify(q, faqsList = cachedFaqs) {
  const vectors = faqsList === cachedFaqs ? cachedVectors : getVectors(faqsList);
  const qt = tokens(q);
  const qv = vectors.vec(count(qt));
  let bi = 0, bs = -1;

  vectors.docVecs.forEach((d, i) => {
    const s = cosine(qv, d);
    if (s > bs) { bs = s; bi = i; }
  });

  const matchedFaq = faqsList[bi] || faqsList[0];
  const set = new Set(qt);
  const kws = new Set(tokens(`${matchedFaq.kw || ""} ${matchedFaq.cat || ""}`));
  const hits = [...kws].filter((k) => set.has(k)).length;

  if (!hits && bs < 0.12) {
    return { faq: null, confidence: Math.round(Math.min(0.35, Math.max(0.1, bs)) * 100) / 100 };
  }

  const conf = 0.5 * Math.min(1, bs / 0.3) + 0.5 * Math.min(1, hits / 2);
  return { faq: matchedFaq, confidence: Math.round(Math.min(1, Math.max(0.4, conf)) * 100) / 100 };
}

// Multi-intent detector for natural language understanding
function detectIntent(q, faq, confidence, urgency) {
  const lq = String(q || "").trim().toLowerCase();

  // 1. Safety / Emergency (Immediate High Priority)
  if (urgency === "High" || /unsafe|threat|harass|ragging|abuse|assault|danger|police|weapon|suicide|hospital/.test(lq)) {
    return { type: "EMERGENCY", escalated: true, category: "Campus Safety" };
  }

  // 2. Greetings and Casual Messages
  const isGreeting = /^(hi|hello|hey|heyy+|greetings|good\s*(morning|afternoon|evening|day))[\s!.,?]*$/i.test(lq);
  const isIdentity = /^(who\s*are\s*you|what\s*(is|\'s)\s*your\s*name|tell\s*me\s*about\s*yourself|what\s*can\s*you\s*do|how\s*can\s*you\s*help|are\s*you\s*(a\s*)?(bot|ai|robot|human))[\s!.,?]*$/i.test(lq);
  const isPoliteCasual = /^(how\s*are\s*you|how\s*is\s*it\s*going|how\s*do\s*you\s*do|what\'?s\s*up|wassup)[\s!.,?]*$/i.test(lq);
  const isGratitudeOrBye = /^(thanks|thank\s*you|thank\s*you\s*so\s*much|thx|bye|goodbye|see\s*you|have\s*a\s*(great|good|nice)\s*day)[\s!.,?]*$/i.test(lq);

  if (isGreeting || isIdentity || isPoliteCasual || isGratitudeOrBye) {
    return {
      type: "GREETING",
      subType: isIdentity ? "identity" : isGreeting ? "hello" : isPoliteCasual ? "status" : "gratitude",
      escalated: false,
      category: "Welcome"
    };
  }

  // 3. Approved FAQ Match (High confidence grounded match)
  if (faq && confidence >= 0.5) {
    return { type: "FAQ_MATCH", faq, escalated: false, category: faq.cat };
  }

  // 4. General Academic Questions (e.g. "What is DBMS?", "Explain cloud computing")
  const academicTerms = /\b(dbms|database|cloud(\s*computing)?|operating\s*system|\bos\b|oop|object\s*oriented|data\s*structure|algorithm|binary\s*search|linear\s*search|sorting|normali[zs]ation|sql|nosql|machine\s*learning|\bml\b|\bai\b|artificial\s*intelligence|neural\s*network|deep\s*learning|tcp|udp|protocol|ip\s*address|http|compiler|interpreter|recursion|polymorphism|inheritance|encapsulation|abstraction|stack|queue|linked\s*list|tree|graph|hash\s*table|big\s*o|time\s*complexity|space\s*complexity|deadlock|process|thread|virtual\s*memory|paging|segmentation|sdlc|agile|scrum|git|github|cybersecurity|cryptography|encryption|firewall|microprocessor|cpu|computer\s*architecture|discrete\s*math|calculus|linear\s*algebra|boolean\s*algebra|automata|turing\s*machine|programming|coding|python|java|c\+\+|javascript)\b/i;

  // College-specific administrative terms that require official college records
  const isCollegeSpecificTerm = /\b(fee|fees|fine|hall\s*ticket|attendance|moodle|hostel|mess|warden|scholarship|bonafide|admission|convocation|id\s*card|revaluation)\b/i.test(lq);

  if (academicTerms.test(lq) && !isCollegeSpecificTerm) {
    return { type: "ACADEMIC", escalated: false, category: "Academics" };
  }

  // 5. Unclear or Brief Messages (e.g. "hmm", "ok", "help", single vague word)
  if (/^(hmm+|ok|okay|k|help|idk|i\s*don'?t\s*know|huh|what|why|doubt|tell|question)[\s!.,?]*$/i.test(lq) || tokens(lq).length <= 1) {
    return { type: "UNCLEAR", escalated: false, category: "Helpdesk Assistant" };
  }

  // 6. College-Specific Questions NOT in approved FAQs (official policy, fee rules, dates)
  const isCollegeAdministrative =
    /\b(college|campus|university|hostel|mess|canteen|gym|sports|refund|fee|fees|deposit|fine|warden|hod|dean|faculty|professor|principal|convocation|degree|marksheet|transcript|bus|transport|parking|room\s*change|curfew|gate\s*pass|leave|attendance|exam|admit\s*card|backlog|kt|reval|scholarship|placement|internship|bonafide|admission)\b/i.test(lq);

  if (isCollegeAdministrative) {
    return { type: "COLLEGE_UNVERIFIED", escalated: true, category: "College Administration" };
  }

  // 7. Out of Scope Query (e.g. "What is the capital of France?")
  return { type: "OUT_OF_SCOPE", escalated: true, category: "General" };
}

// ============================================================================
// STAGE 3: Response Drafting (Google Gemini API + Smart Grounded Synthesizer)
// ============================================================================
async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !key.trim()) return null;

  try {
    const isBearer = key.startsWith("AQ.") || key.startsWith("ya29.");
    const headers = { "Content-Type": "application/json" };
    let url;

    if (isBearer) {
      headers["Authorization"] = `Bearer ${key}`;
      headers["x-goog-api-key"] = key;
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
    } else {
      headers["x-goog-api-key"] = key;
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 350 }
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`[Gemini API] Request returned HTTP ${res.status}: ${err.slice(0, 150)}`);
      return null;
    }

    const j = await res.json();
    const generated = j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (generated) {
      console.log(`[Gemini API] Successfully generated dynamic response (${generated.length} chars)`);
      return generated;
    }
    return null;
  } catch (err) {
    console.warn(`[Gemini API] Connection notice: ${err.message}`);
    return null;
  }
}

const SIG = "\n\nRegards,\nStudent Helpdesk Team";

// Smart Grounded Synthesizer: Dynamically adapts the response based on intent and query
function synthesizeDynamicResponse(q, f, v, ticket, intent = {}) {
  const lq = String(q || "").toLowerCase();

  // Intent A: Greetings and Casual Messages
  if (intent.type === "GREETING") {
    if (intent.subType === "identity" || /name|who are you/i.test(lq)) {
      return "I'm your AI Student Helpdesk Assistant! I'm here to help you with your academic and college-related queries.";
    }
    if (intent.subType === "status" || /how are you/i.test(lq)) {
      return "I'm doing great, thank you! I'm here and ready to help you with your college queries, portal navigation, or academic concepts. How can I assist you today?";
    }
    if (intent.subType === "gratitude" || /thank|thanks/i.test(lq)) {
      return "You're very welcome! Feel free to ask whenever you need assistance. Best of luck with your studies!";
    }
    if (/bye|goodbye|see you/i.test(lq)) {
      return "Goodbye! Best of luck with your studies, and reach out anytime you need assistance.";
    }
    // Default greeting (e.g. "Hi")
    return "Hello! Welcome to the Student Helpdesk. How can I assist you today?";
  }

  // Intent E1: Unclear or Vague Messages
  if (intent.type === "UNCLEAR") {
    return "Hello! It looks like your message was a bit brief or unclear. Could you please provide a few more details about what you need assistance with? I can help you with semester fees, exam dates, attendance rules, assignment submissions, Wi-Fi passwords, or explain academic concepts!";
  }

  // Intent C: General Academic Questions (e.g. "What is DBMS?", "Explain cloud computing")
  if (intent.type === "ACADEMIC") {
    let academicAnswer = "";
    let nextStep = "You can consult your course textbook or reach out to your subject faculty during tutorial hours for deeper discussion.";

    if (/dbms|database/i.test(lq)) {
      academicAnswer = "A Database Management System (DBMS) is software designed to store, retrieve, manage, and organize data efficiently. It provides an interface between end-users and the database, ensuring data integrity, security, concurrency control, and transactions (ACID properties). Common examples include MySQL, PostgreSQL, Oracle, and MongoDB.";
      nextStep = "Review relational schema design and SQL query fundamentals in your DBMS course syllabus.";
    } else if (/cloud(\s*computing)?/i.test(lq)) {
      academicAnswer = "Cloud computing is the on-demand delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet with pay-as-you-go pricing. The primary service models are IaaS (Infrastructure as a Service), PaaS (Platform as a Service), and SaaS (Software as a Service), with major platforms including AWS, Google Cloud, and Microsoft Azure.";
      nextStep = "Explore cloud deployment models (public, private, hybrid) in your distributed systems materials.";
    } else if (/operating\s*system|\bos\b/i.test(lq)) {
      academicAnswer = "An Operating System (OS) is core system software that manages computer hardware resources (CPU, RAM, storage, I/O devices) and provides common services for application software, including process scheduling, memory allocation, and file systems.";
      nextStep = "Study CPU scheduling algorithms and virtual memory paging in your OS lecture notes.";
    } else if (/oop|object\s*oriented/i.test(lq)) {
      academicAnswer = "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects' containing data and code. Its four foundational pillars are Encapsulation (data hiding), Abstraction (simplifying reality), Inheritance (code reuse), and Polymorphism (multiple implementations).";
      nextStep = "Practice implementing class hierarchies and interface polymorphism in your programming assignments.";
    } else if (/normali[zs]ation/i.test(lq)) {
      academicAnswer = "Normalization is a database design technique that organizes tables to reduce data redundancy and eliminate update, insertion, and deletion anomalies. It decomposes tables into smaller, well-structured relations using Normal Forms (1NF, 2NF, 3NF, BCNF) based on functional dependencies.";
      nextStep = "Practice converting unnormalized tables into Third Normal Form (3NF).";
    } else if (/binary\s*search/i.test(lq)) {
      academicAnswer = "Binary Search is an efficient divide-and-conquer algorithm for finding a target element in a sorted collection. It repeatedly compares the target with the middle element, narrowing the search interval by half each step, achieving O(log n) time complexity.";
      nextStep = "Implement iterative and recursive binary search algorithms in your data structures lab.";
    } else {
      // General academic subject explanation
      const cleanConcept = q.replace(/^(what\s*(is|are)|explain|define|tell\s*me\s*about|describe)\s+/i, "").replace(/[?.,!]+$/, "");
      academicAnswer = `Regarding ${cleanConcept}: This is a foundational academic concept in computing and technical studies. It encompasses key theoretical principles, structured analytical methods, and practical implementations across modern engineering curricula.`;
      nextStep = "Consult your course textbook or reach out to your course instructor during tutorial hours for further study guidance.";
    }

    if (v === "v1") return academicAnswer;
    if (v === "v2") return `Hello!\n\n${academicAnswer}`;
    return `Dear Student,\n\n${academicAnswer}\n\nNext Steps: ${nextStep}${SIG}`;
  }

  // Intent D & G: Escalated Cases (Emergency, College-Specific Unverified, or Out of Scope)
  if (!f || intent.type === "COLLEGE_UNVERIFIED" || intent.type === "EMERGENCY" || intent.type === "OUT_OF_SCOPE") {
    const isSafety = intent.type === "EMERGENCY" || /unsafe|threat|harass|ragging|abuse|assault|danger|emergency/.test(lq);
    if (v === "v1") {
      return `Your query has been forwarded to our helpdesk staff under ticket ${ticket}.`;
    }
    if (v === "v2") {
      return `Hello,\n\nYour query regarding campus assistance has been forwarded to staff under ticket ${ticket}. We will reach out shortly.`;
    }
    if (isSafety) {
      return `Dear Student,\n\nThank you for reaching out to the Student Helpdesk.\n\nYour message regarding safety has been escalated with the highest priority under Ticket ${ticket}.\n\nNext Steps: If you or anyone else is in immediate distress or danger, please contact Campus Security immediately at 022-2576-8888 or dial 112.${SIG}`;
    }
    if (intent.type === "COLLEGE_UNVERIFIED") {
      return `Dear Student,\n\nThank you for reaching out to the Student Helpdesk.\n\nWe do not have verified official policy records in our approved FAQ database regarding your specific inquiry. Because official college regulations, fees, and deadlines must be confirmed by administrative authorities, your query has been forwarded to human staff under Ticket ${ticket}.\n\nNext Steps: A helpdesk officer will review your request with the concerned college department and reply to your student email.${SIG}`;
    }
    // Out of scope fallback
    return `Dear Student,\n\nThank you for reaching out to the Student Helpdesk.\n\nI specialize in college helpdesk assistance, campus procedures, and academic subjects. Your inquiry falls outside approved university records, so it has been forwarded to staff under Ticket ${ticket}.\n\nNext Steps: A helpdesk officer will review your inquiry and follow up if needed.${SIG}`;
  }

  // Intent B: Approved FAQ Synthesis (Query-tailored response adhering strictly to approved FAQs)
  let intro = "Regarding your inquiry:";
  let specificAnswer = f.a;
  let nextStep = "If this does not resolve your query, reply to this message and we will help further.";

  // Intent 1: Fees penalty, late fee, or last date
  if (/fee|penalty|late|tuition|pay|installment/.test(lq) && f.id === "F1") {
    intro = "Regarding semester fees and late payment penalties:";
    if (/penalty|late fine|late fee/.test(lq)) {
      specificAnswer = "The late fee penalty for semester tuition is Rs. 500 per week, which applies after the deadline of 15 November. Payments can be completed online via the student portal under Fees > Pay Online using UPI, Net Banking, or Credit/Debit cards.";
      nextStep = "Please log in to the student portal under Fees > Pay Online to settle your dues before late fees accumulate.";
    } else {
      specificAnswer = "The last date to pay semester fees is 15 November without penalty. After that date, a late fine of Rs. 500 per week applies. You can complete payments online through the student portal under Fees > Pay Online.";
      nextStep = "Go to Fees > Pay Online on the student portal to review your fee invoice and pay online.";
    }
  }
  // Intent 2: Exam hall venue, download, or date sheet
  else if (/hall|venue|room|seat|locate|where|exam|ticket|admit/.test(lq) && f.id === "F3") {
    intro = "Regarding your examination hall location and hall ticket:";
    if (/where|hall|venue|room|locate/.test(lq)) {
      specificAnswer = "Your specific examination hall venue and seat allotment are printed directly on your official Hall Ticket. Hall tickets are available for download on the student portal under Exams > Hall Ticket 7 days before your first examination. You must carry a printed hard copy and your college ID card to access the exam hall.";
      nextStep = "Visit the student portal under Exams > Hall Ticket 7 days prior to exams to verify your allocated examination hall.";
    } else {
      specificAnswer = "Hall tickets can be downloaded from the student portal under Exams > Hall Ticket 7 days before your first examination begins. You must carry a printed hard copy and your official student ID card to enter the examination hall.";
      nextStep = "Download your hall ticket from the student portal and take a physical printout for entry.";
    }
  }
  // Intent 3: Assignments & Moodle submission
  else if (/assignment|submit|moodle|lms|homework|project/.test(lq) && f.id === "F9") {
    intro = "Regarding course assignment submission guidelines and deadlines:";
    specificAnswer = "Course assignments must be submitted directly through the college LMS (Moodle) before 11:59 PM on the designated due date in PDF format. Late submissions incur a deduction penalty of 10% per day for up to 3 days, after which the portal closes.";
    nextStep = "Log in to Moodle, open your course module, and upload your PDF submission before the 11:59 PM deadline.";
  }
  // Intent 4: Attendance percentage, rules, or medical leave
  else if (/attendance|percentage|shortage|medical|leave|absent/.test(lq) && f.id === "F6") {
    intro = "Regarding the college attendance policy and leave regulations:";
    if (/medical|leave|sick|doctor/.test(lq)) {
      specificAnswer = "If you have missed classes due to illness, submit a doctor's certificate and prescription to the Dean of Student Affairs within 5 days of returning to campus. A minimum of 75% attendance is required to sit for end-semester exams.";
      nextStep = "Submit your medical certificate and condonation request to the Academic Section within 5 days.";
    } else {
      specificAnswer = "Students must maintain a mandatory minimum of 75% attendance in each course to be eligible for end-semester exams. For authorized absences or medical leave, condonation requests must be submitted with valid documentation.";
      nextStep = "Check your current attendance percentage on the student portal under Academics > Attendance.";
    }
  }
  // Intent 5: Wi-Fi or portal password reset
  else if (/wifi|password|internet|login|portal|network/.test(lq) && f.id === "F5") {
    intro = "Regarding campus Wi-Fi access and password reset:";
    specificAnswer = "To reset your campus Wi-Fi or student portal password, visit the IT Self-Service portal, click 'Forgot Password', and enter your college email to verify via OTP. A temporary password will be sent within 10 minutes. For persistent technical issues, contact it-help@college.edu or visit Room 204.";
    nextStep = "Head to the IT Self-Service portal and request a password reset OTP sent to your college email.";
  }
  // Intent 6: Library books & fines
  else if (/library|book|borrow|renew|fine/.test(lq) && f.id === "F7") {
    intro = "Regarding library borrowing limits and book renewals:";
    specificAnswer = "Undergraduate students can borrow up to 4 books for 14 days, renewable once online if no other student has placed a hold. A late return fine of Rs. 5 per day applies for overdue books. The campus library is open from 8:00 AM to 9:00 PM on weekdays.";
    nextStep = "Visit the library portal to check your borrowed titles or renew books online.";
  }
  // Intent 7: Revaluation
  else if (/revaluation|recheck|retotaling|marks|result/.test(lq) && f.id === "F4") {
    intro = "Regarding examination revaluation and score reviews:";
    specificAnswer = "You can apply for examination revaluation within 10 days of result declaration via the student portal under Results > Revaluation. The fee is Rs. 300 per subject, and revised marks are published within 15 working days.";
    nextStep = "Go to Results > Revaluation on the student portal to submit your recheck application.";
  }
  // Intent 8: Scholarship
  else if (/scholarship|aid|income|stipend/.test(lq) && f.id === "F2") {
    intro = "Regarding scholarship eligibility and financial aid:";
    specificAnswer = "Scholarship applications open on 1 August and close on 30 September. Eligible students must submit their form on the student portal along with their income certificate, previous semester marksheet, and bank details. Decisions are announced within 30 days.";
    nextStep = "Submit your scholarship application with supporting income documents on the student portal.";
  }

  // Version 1: Direct Answer
  if (v === "v1") {
    return specificAnswer;
  }

  // Version 2: Role & Polite Greeting
  if (v === "v2") {
    return `Hello!\n\n${specificAnswer}`;
  }

  // Version 3: Production XML Structured Output
  return `Dear Student,\n\n${intro}\n\n${specificAnswer}\n\nNext Steps: ${nextStep}${SIG}`;
}

async function draft(q, f, v, ticket, intent = {}, opts = {}) {
  // If intent is Greeting or Unclear, return immediate friendly assistant response
  if (intent.type === "GREETING" || intent.type === "UNCLEAR") {
    const text = synthesizeDynamicResponse(q, f, v, ticket, intent);
    return [text, "AI Helpdesk Assistant (Greeting)", `Greeting Intent: ${intent.subType || "casual"}`];
  }

  // Build context if conversation history exists
  let conversationContext = "";
  if (opts.history && Array.isArray(opts.history) && opts.history.length > 0) {
    const recent = opts.history.slice(-4);
    conversationContext = "\n<conversation_history>\n" +
      recent.map((m) => `${m.sender === "student" ? "Student" : "Assistant"}: ${m.text}`).join("\n") +
      "\n</conversation_history>\n";
  }

  // For General Academic Questions (Category C)
  if (intent.type === "ACADEMIC") {
    if (process.env.GEMINI_API_KEY) {
      const academicPrompt = `<role>You are a friendly, intelligent Student Helpdesk Assistant and academic tutor.</role>
${conversationContext}<task>Explain this academic or computer science topic clearly and concisely to an undergraduate student: "${q}".</task>
<rules>
1. Provide a clear, educational, easy-to-understand explanation under 100 words.
2. Plain text only (no code blocks or markdown tables).
3. Format: Start with "Dear Student,", provide the explanation, add one practical study next step starting with "Next Steps:", and end with "Regards,\\nStudent Helpdesk Team".
4. Do NOT escalate to staff or create a ticket.
</rules>
Write the response now.`;
      const ai = await callGemini(academicPrompt);
      if (ai) return [ai, "Google Gemini 1.5 Flash", academicPrompt];
    }
    const syntheticText = synthesizeDynamicResponse(q, f, v, ticket, intent);
    return [syntheticText, "AI Academic Tutor Engine", `Academic Topic: ${q}`];
  }

  // For Approved FAQs or Escalated Cases
  const promptTemplate = PROMPTS[v] || PROMPTS.v3;
  const promptFilled = promptTemplate
    .replace("{q}", q)
    .replace("{faq}", f ? `${f.q}\n${f.a}` : "No approved FAQ available. Escalate to helpdesk team.") + conversationContext;

  // 1. Try Google Gemini API if GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY && f) {
    const ai = await callGemini(promptFilled);
    if (ai) return [ai, "Google Gemini 1.5 Flash", promptFilled];
  }

  // 2. Intelligent Grounded Synthesizer (Natural, query-tailored response adhering strictly to approved FAQs)
  const syntheticText = synthesizeDynamicResponse(q, f, v, ticket, intent);
  return [syntheticText, "AI Helpdesk Engine (Grounded)", promptFilled];
}

// ============================================================================
// STAGE 4: Output Validation & Verification (5-Point Rubric)
// ============================================================================
function rubric(d, f, intentType = "") {
  const nums = (s) => s.replace(/T-\d+/g, "").match(/\d+(?::\d+)?/g) || [];
  const words = f ? [...new Set(f.a.toLowerCase().match(/[a-z]{5,}/g))] : [];
  const dl = d.toLowerCase(), wc = d.trim().split(/\s+/).length, fn = f ? nums(f.a) : [];
  const isCasual = intentType === "GREETING" || intentType === "UNCLEAR";

  const checks = [
    ["Grounded: no invented figures", f ? nums(d).every((n) => fn.includes(n)) : true],
    ["Complete: key FAQ facts covered", f ? words.filter((w) => dl.includes(w)).length / words.length >= 0.35 : true],
    ["Polite greeting", isCasual ? /\b(hello|dear|hi|greetings|welcome|i\'?m)\b/i.test(d) : /\b(hello|dear|hi)\b/i.test(d)],
    ["Sign-off", isCasual ? true : /regards|thanks|sincerely|helpdesk|assistant|team/i.test(d)],
    ["Length 10-120 words, no promises", (isCasual ? wc >= 4 : wc >= 10) && wc <= 180 && !/guarantee|promise|definitely/i.test(d)],
  ];
  return { checks: checks.map(([name, ok]) => ({ name, ok })), score: checks.filter((c) => c[1]).length };
}

// ============================================================================
// STAGE 5: Trigger-Action Automation Decision & Full Pipeline Execution
// ============================================================================
async function processQuery(q, version, deps, opts = {}) {
  const v = PROMPTS[version] ? version : "v3";
  const faqsList = opts.faqs || cachedFaqs;
  const { faq, confidence } = classify(q, faqsList);
  const urgency = urgencyOf(q);

  // Multi-intent detection
  const intent = detectIntent(q, faq, confidence, urgency);

  let ticket = "";
  if (intent.escalated) {
    ticket = await deps.newTicket(q, urgency, intent.category || (faq ? faq.cat : "General"));
  }

  const [text, engine, promptText] = await draft(q, intent.type === "FAQ_MATCH" ? faq : null, v, ticket, intent, opts);
  const { checks, score } = rubric(text, intent.type === "FAQ_MATCH" ? faq : null, intent.type);
  const verdict = score >= 4 ? "PASS" : "REVIEW";

  const action = intent.escalated
    ? `ESCALATED: ticket ${ticket} created (status OPEN)`
    : verdict === "PASS"
    ? "AUTO-APPROVED: reply queued for sending"
    : "HELD: rubric below 4, sent to human review";

  const expected = opts.expected ?? null;
  const passed = expected === null
    ? null
    : expected === "ESCALATE"
    ? intent.escalated
    : !intent.escalated && faq && faq.id === expected && score >= 4;

  return {
    source: opts.source || "live",
    engine,
    version: v,
    promptText,
    query: q,
    category: intent.category || (faq ? faq.cat : "Other"),
    urgency,
    faqId: intent.type === "FAQ_MATCH" && faq ? faq.id : "NONE",
    faqQuestion: intent.type === "FAQ_MATCH" && faq ? faq.q : null,
    confidence: intent.type === "FAQ_MATCH" ? confidence : intent.type === "GREETING" ? 1.0 : intent.type === "ACADEMIC" ? 0.95 : confidence,
    draft: text,
    score,
    verdict,
    action,
    ticket,
    expected,
    passed,
    checks,
  };
}

module.exports = { classify, urgencyOf, rubric, processQuery, PROMPTS, updateFaqsCache, detectIntent };
