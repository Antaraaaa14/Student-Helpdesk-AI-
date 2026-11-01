// Three draft-prompt versions. {q} and {faq} are filled in by pipeline.js.
module.exports = {
  v1: "Answer this student query using the FAQ.\nQuery: {q}\nFAQ: {faq}",
  v2: "You are a helpful university helpdesk assistant. Write a short, polite reply to the student using ONLY the approved FAQ below. Do not add facts, dates or amounts that are not in the FAQ.\nQuery: {q}\nApproved FAQ:\n{faq}",
  v3: '<role>University helpdesk assistant drafting replies for staff approval.</role>\n<rules>1. Use ONLY facts inside <faq>. 2. Never invent dates, fees, links or promises. 3. Under 100 words. 4. Plain text.</rules>\n<format>Start with "Dear Student,"; give the answer; add one next step; end with "Regards,\\nStudent Helpdesk Team".</format>\n<faq>{faq}</faq>\n<query>{q}</query>\nWrite the reply now.',
};
