# 🌸 AI Student Helpdesk Assistant (MERN Stack)

**Student Name:** Antara Yogesh Palwankar  
**Student ID:** 150096725126  
**Category:** Student Productivity  
**Project Topic:** AI Student Helpdesk Assistant  
**Practical Task:** Classify student queries and draft responses from approved FAQs.  
**Primary Deliverables:** Categorized queries, grounded response drafts, 5-point verification rubrics, automated escalation tickets, and audit spreadsheet export.

---

## 🎨 Pastel Peach + Pink UI Design System
The entire application interface has been completely redesigned to match the modern pastel dashboard mockup:

* **Soft Ivory (`#FFF8F5`)**: Dashboard background
* **Pastel Peach (`#FFE2D5`)**: Card sections, active navigation pill & category tiles
* **Blush Pink (`#FFC9D9`)**: Primary buttons, quick action highlights, and badges
* **Soft Lilac (`#E8DFFF`)**: Secondary accent chips, stage badges, and tags
* **Dark Mauve (`#493B46`)**: Headings, typography, and button labels
* **Muted Rose (`#A65D7B`)**: Links, icons, and focus rings
* **Border Pink (`#F3DCE2`)**: Soft card borders and table dividers
* **White (`#FFFFFF`)**: Input fields, draft response boxes, and data tables

---

## 🖥️ Application Architecture & Views

### 0. 🔐 Authentication & Login Portal (First Screen on Launch)
* **First Screen on Launch**: When any user opens the app, they are immediately greeted by the professional pastel Login Screen.
* **Universal Access**: Any student, faculty member, or evaluator can log in or create a new account without restrictions. Unknown users are dynamically registered.
* **Remember Me & Save Login Info**: Checkbox allows saving credentials in `localStorage` so users stay permanently signed in on their Mac across sessions and page refreshes.
* **1-Click Quick Demo Access**: Quick-access pills for instant 1-click evaluation:
  * **Student Portal**: Pre-fills student profile for *Antara Yogesh Palwankar (ID: 150096725126)*.
  * **Admin Portal**: Pre-fills campus administrator credentials with ticket review and analytics access.
* **Secure Logout**: 1-click logout button in both the sidebar and top navbar avatar dropdown.

### 1. 🏠 Student Dashboard (Home)
* **Left Sidebar**:
  * Brand logo: Graduation Cap icon + `Student Helpdesk` / `AI-Powered Support`.
  * Navigation items: Home, Ask a Question, FAQs, Categories, My Queries, Profile, Admin & Analytics, Evaluation & Tests.
  * Stacked pastel books illustration with inspiring caption: `Your questions matter! 💖`.
* **Top Navbar**:
  * Global search bar: *"Search for a topic... (e.g. fees, attendance, exams)"*.
  * Notification bell with active alert dot.
  * User profile avatar pill with letter `"A"` and dropdown role switcher (Student ↔ Admin).
* **Hero Card**:
  * Gradient banner with sparkle icon: *"Hi Antara! 👋 I'm your AI Student Helpdesk Assistant"*.
  * Interactive natural-language question bar with pink paper plane send button.
  * Friendly AI robot mascot illustration with speech bubble: *"I'm here to help! 💖"*.
* **Browse by Category (Middle Row)**:
  * 4 pastel category cards:
    * 💳 **Fees & Payments**: Fee structure, payment methods, refunds.
    * 📅 **Attendance**: Attendance rules, leave, absence.
    * 📖 **Assignments**: Submission, deadlines, projects.
    * 🎓 **Examinations**: Exam schedule, results, re-evaluation.
* **Recent Queries & Right Sidebar (Bottom Row)**:
  * Left: Recent queries table with category pills, timestamps, and detail view.
  * Right:
    * ⚡ **Quick Help**: Popular one-click questions.
    * 💡 **Need More Help?**: Direct *"Contact Support"* button.
    * 🌸 **Inspirational Card**: Cute script note *"Small steps lead to big goals 💖"* with botanical branch sketch.

### 2. 💬 Ask a Question (AI Chat Assistant)
* Real-time conversational interface with conversation history.
* AI response bubble displays:
  * Factual, grounded answer from approved FAQs.
  * Category pill & confidence meter (e.g. 98%).
  * Approved FAQ source citation (`FAQ F1: When is the last date to pay fees?`).
  * 5-point verification rubric badge (`PASS: 5/5`).
  * Action controls: Copy draft, Thumbs Up / Down feedback, and *"Escalate to Staff"*.
* Dynamic follow-up question chips.

### 3. 📄 FAQs Knowledge Base
* Searchable and filterable catalog of all 12 approved university FAQs.
* Categorized under Fees, Attendance, Examinations, Assignments, Timetables, Admissions, and Technical Issues.
* One-click *"Ask AI about this topic"* button on each FAQ.

### 4. 㗊 Categories Explorer
* Detailed cards for all 9 university administrative domains.
* Shows approved FAQ count, department responsibility, and sample queries.

### 5. 🕒 My Queries Tracking
* Complete log of all queries submitted by the student.
* Status badges: `Auto-Approved`, `Ticket: T-xxxx (Escalated)`, `Under Review`.
* Interactive detail modal showing the query, confidence score, rubric check, and staff reply.

### 6. ⚙️ Administrator Portal & Analytics
* Overview KPIs: Total Inquiries, Auto-Approved, Open Escalations, Average Confidence.
* Category distribution bar chart derived from real database records.
* **Escalation Queue**: Review, reply to, and resolve escalated tickets in real time.
* **AI FAQ Conflict Detector**: Scans knowledge base to detect duplicate or conflicting rules.
* **Document Ingestion**: Upload handbook/circular text (PDF/DOCX) to extract proposed FAQs.

### 7. 🧪 Evaluation & Test Suite (20/20 Marks)
* **5 Automated Test Cases**:
  1. Fees Payment (`F1`)
  2. Exam Hall Ticket (`F3`)
  3. Campus Wi-Fi (`F5`)
  4. Library Books (`F7`)
  5. **Critical Edge Case (Hostel Safety / Threat)**: Triggers High Urgency, halts FAQ retrieval, outputs emergency contacts (`112 / 022-2576-8888`), and dispatches staff ticket `T-xxxx`.
* **Prompt Version Benchmark (v1 vs v2 vs v3)**:
  * v1 Baseline: 3.0 / 5.0
  * v2 Grounding Rules: 4.0 / 5.0
  * v3 XML Delimiters (`<role>`, `<rules>`, `<format>`, `<faq>`, `<query>`): **5.0 / 5.0**.
* **Ready-Made Prompts Dossier Document**:
  * Downloadable Word Document (`.doc`), Printable HTML (`.html`), and Markdown (`.md`) detailing all 9 user prompts and system prompts used to construct this project.
  * Direct 1-click download available in the web portal and at `/api/download/prompts-doc`.
* **Spreadsheet Export**: 1-click download of `helpdesk_records.csv` formatted for Numbers, Excel, and Sheets.
* **3–5 Minute Presentation Script** for evaluators.

---

## 🚀 How to Run the App on Mac

### 1-Click Startup
Double-click **`start.command`** in the project root folder.
The script checks Node.js, compiles the React frontend, starts the Express server, and opens **`http://127.0.0.1:5001`** in your browser automatically!

### Manual Terminal Commands
```bash
# Terminal 1: Start Server
cd server
npm start
```
Open **`http://127.0.0.1:5001`** in Safari or Chrome.

---

## 🧪 Unit Tests
Run the server test suite with:
```bash
cd server
npm test
```
All 9 unit tests pass with zero failures.
