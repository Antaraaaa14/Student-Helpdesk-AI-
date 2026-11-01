// Run: npm test   (no database needed)
const test = require("node:test"), assert = require("node:assert");
const { classify, rubric, processQuery, PROMPTS } = require("../pipeline");
const { FAQS, TESTS } = require("../faqs");
delete process.env.ANTHROPIC_API_KEY;
let n = 0;
const deps = { newTicket: async () => "T-" + (1001 + n++) };
const go = (q, v = "v3", o) => processQuery(q, v, deps, o);

test("1 fees query matches F1 and passes the rubric", async () => {
  const r = await go("When is the last date to pay my semester fees?");
  assert.equal(r.faqId, "F1"); assert.equal(r.category, "Fees & Payments"); assert.equal(r.verdict, "PASS"); assert.match(r.draft, /15 November/);
});
test("2 hall ticket", async () => assert.equal((await go("Where do I download my hall ticket?")).faqId, "F3"));
test("3 wifi password", async () => assert.equal((await go("I forgot my wifi password")).faqId, "F5"));
test("4 library books", async () => assert.equal((await go("How many books can I borrow from the library?")).faqId, "F7"));
test("5 EDGE: unsafe message is escalated with a ticket", async () => {
  const r = await go("URGENT: my roommate is threatening me and I feel unsafe in the hostel");
  assert.equal(r.urgency, "High"); assert.match(r.ticket, /^T-/); assert.match(r.action, /ESCALATED/);
});
test("out-of-scope query is escalated, not guessed", async () => assert.ok((await go("What is the capital of France?")).ticket));
test("rubric blocks invented figures", () => assert.equal(rubric("Fees are Rs. 9999 due on 1 May. Regards", FAQS[0]).checks[0].ok, false));
test("prompt versions improve: v1 < v2 < v3", async () => {
  const avg = {};
  for (const v of Object.keys(PROMPTS)) { let s = 0; for (const t of TESTS) s += (await go(t.q, v)).score; avg[v] = s / TESTS.length; }
  console.log("average rubric:", JSON.stringify(avg)); assert.ok(avg.v1 < avg.v2 && avg.v2 < avg.v3);
});
test("all 5 test cases pass with v3", async () => {
  for (const t of TESTS) { const r = await go(t.q, "v3", { expected: t.faq || "ESCALATE" }); assert.equal(r.passed, true, t.q); }
});
