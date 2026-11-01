// Approved FAQ Knowledge Base and Test Cases
const CATS = [
  "Fees & Payments",
  "Attendance",
  "Examinations",
  "Assignments",
  "Timetables",
  "Admissions",
  "Scholarships",
  "Technical Issues",
  "Other"
];

const INITIAL_FAQS = [
  {
    id: "F1",
    cat: "Fees & Payments",
    q: "When is the last date to pay semester fees? What is the late fee?",
    kw: "fee fees pay payment tuition deadline late due semester date penalty installments bank",
    a: "The last date to pay semester fees is 15 November without penalty. After that, a late fee of Rs. 500 per week applies. Payments can be completed online via the student portal under Fees > Pay Online using UPI, Net Banking, or Debit/Credit cards."
  },
  {
    id: "F2",
    cat: "Scholarships",
    q: "How do I apply for a merit or need-based scholarship?",
    kw: "scholarship financial aid apply income stipend merit concession fee waiver",
    a: "Scholarship applications open on 1 August and close on 30 September. Eligible students must submit the application on the student portal with their income certificate, previous semester marksheet, and bank details. Results are announced within 30 days."
  },
  {
    id: "F3",
    cat: "Examinations",
    q: "Where do I download my exam hall ticket?",
    kw: "hall ticket admit card download exam examination date sheet venue seat",
    a: "Hall tickets are available on the student portal under Exams > Hall Ticket, 7 days before the first examination. You must carry a printed hard copy and your official college ID card to enter the examination hall."
  },
  {
    id: "F4",
    cat: "Examinations",
    q: "How do I apply for exam revaluation or retotaling?",
    kw: "revaluation recheck re-evaluation retotaling marks result score paper review",
    a: "Apply for revaluation within 10 days of result declaration via the student portal under Results > Revaluation. The fee is Rs. 300 per subject, and revised scorecards are published within 15 working days."
  },
  {
    id: "F5",
    cat: "Technical Issues",
    q: "How do I reset my campus Wi-Fi or student portal password?",
    kw: "wifi wi-fi password reset internet network login forgot credentials portal account",
    a: "Visit the IT Self-Service portal, select 'Forgot Password', and verify using the OTP sent to your registered college email. A temporary password is sent within 10 minutes. For persistent login issues, contact it-help@college.edu or visit Room 204."
  },
  {
    id: "F6",
    cat: "Attendance",
    q: "What is the minimum attendance policy and how do I apply for medical leave?",
    kw: "attendance minimum percentage 75 shortage leave medical condonation absence sick",
    a: "Students must maintain a minimum of 75% attendance in each course to be eligible for end-semester exams. For medical leave, submit a doctor's certificate and prescription to the Dean of Student Affairs within 5 days of returning to campus."
  },
  {
    id: "F7",
    cat: "Other",
    q: "How many library books can I borrow and what are the renewal rules?",
    kw: "library book borrow issue renew return fine library card timings books",
    a: "Undergraduate students can borrow up to 4 books for 14 days, renewable once online if no hold exists. A fine of Rs. 5 per day applies for overdue books. The library is open from 8:00 AM to 9:00 PM on weekdays."
  },
  {
    id: "F8",
    cat: "Other",
    q: "How do I get an official Bonafide Certificate or transcript?",
    kw: "bonafide certificate letter proof document transcript verification sign",
    a: "Submit a request on the student portal under Student Services > Certificates. The bonafide certificate is processed in 3 working days and can be collected from the Academic Section upon presenting your student ID card."
  },
  {
    id: "F9",
    cat: "Assignments",
    q: "How do I submit an assignment and what is the policy for late submissions?",
    kw: "assignment homework submit submission deadline late turnitin project lms moodle",
    a: "Assignments must be submitted via the college LMS (Moodle) before 11:59 PM on the due date in PDF format. Late submissions incur a penalty of 10% per day up to a maximum of 3 days, after which submissions are closed."
  },
  {
    id: "F10",
    cat: "Timetables",
    q: "Where can I find the updated class timetable and classroom allocations?",
    kw: "timetable schedule class lecture timing classroom venue room period slot",
    a: "Class timetables and room allocations are accessible on the student portal under Academics > Timetable at the beginning of each semester. Elective and lab batch allocations are also published there."
  },
  {
    id: "F11",
    cat: "Admissions",
    q: "How can I change my branch or elective subject?",
    kw: "branch change elective change subject course transfer department eligibility",
    a: "Branch change applications are accepted at the end of the first year for students with a CGPA of 8.5 or higher and no backlogs. Subject/elective drop and add is permitted during the first two weeks of the semester."
  },
  {
    id: "F12",
    cat: "Other",
    q: "How do I replace a lost student ID card?",
    kw: "id card lost duplicate identity badge replacement photo admin",
    a: "Pay Rs. 200 at the Accounts Counter and submit the receipt along with a passport-size photo to the Admin Office. The replacement duplicate ID card is issued within 3 working days."
  }
];

const TESTS = [
  { q: "When is the last date to pay my semester fees? I want to avoid the late fine.", faq: "F1", note: "Fees & Payments" },
  { q: "Where do I download my hall ticket for the exams?", faq: "F3", note: "Examinations" },
  { q: "I forgot my wifi password and can't log in to the network", faq: "F5", note: "Technical Issues" },
  { q: "How many books can I take from the library and for how long?", faq: "F7", note: "Library / Other" },
  { q: "URGENT: my roommate is threatening me and I feel unsafe in the hostel", faq: null, note: "EDGE CASE: safety, must escalate" },
];

module.exports = { CATS, FAQS: INITIAL_FAQS, TESTS };
