import React from "react";
import {
  IconGrid,
  IconWallet,
  IconCalendar,
  IconBookOpen,
  IconGraduationCap,
  IconClock,
  IconFileText,
  IconSparkles,
  IconSettings,
  IconArrowRight
} from "./Icons.jsx";

export default function CategoriesView({ onAskQuestion, onSelectCategory }) {
  const categoriesData = [
    {
      name: "Fees & Payments",
      icon: IconWallet,
      color: "#B45309",
      bgClass: "bg-orange",
      desc: "Tuition deadlines, online payment portals, late fine schedules, installment rules, and refund procedures.",
      faqsCount: 1,
      samples: [
        "When is the last date to pay semester fees?",
        "What is the late fee penalty?"
      ]
    },
    {
      name: "Attendance",
      icon: IconCalendar,
      color: "#A65D7B",
      bgClass: "bg-rose",
      desc: "75% minimum mandatory attendance rule, condonation procedures, and submitting medical certificates.",
      faqsCount: 1,
      samples: [
        "What is the minimum attendance required?",
        "How do I submit a medical certificate for absence?"
      ]
    },
    {
      name: "Examinations",
      icon: IconGraduationCap,
      color: "#C05621",
      bgClass: "bg-peach",
      desc: "End-semester exam date sheets, hall ticket download guidelines, revaluation, and retotaling requests.",
      faqsCount: 2,
      samples: [
        "Where do I download my hall ticket?",
        "How do I apply for revaluation?"
      ]
    },
    {
      name: "Assignments",
      icon: IconBookOpen,
      color: "#6B46C1",
      bgClass: "bg-purple",
      desc: "LMS submission guidelines, Turnitin plagiarism checks, deadlines, and project submissions.",
      faqsCount: 1,
      samples: [
        "How do I submit my assignment on Moodle?",
        "What is the penalty for late assignment submission?"
      ]
    },
    {
      name: "Timetables",
      icon: IconClock,
      color: "#0369A1",
      bgClass: "bg-blue",
      desc: "Semester class routines, room allocations, elective scheduling, and lab batch distributions.",
      faqsCount: 1,
      samples: [
        "Where can I find the updated class timetable?",
        "Which room is assigned for CS lab batch B?"
      ]
    },
    {
      name: "Admissions",
      icon: IconFileText,
      color: "#047857",
      bgClass: "bg-green",
      desc: "Branch change criteria, course transfers, elective add/drop windows, and enrollment requirements.",
      faqsCount: 1,
      samples: [
        "What is the criteria for branch change?",
        "When is the deadline to change an elective course?"
      ]
    },
    {
      name: "Scholarships",
      icon: IconSparkles,
      color: "#D97706",
      bgClass: "bg-yellow",
      desc: "Merit scholarships, need-based fee concessions, government stipends, and document submission deadlines.",
      faqsCount: 1,
      samples: [
        "How do I apply for a merit scholarship?",
        "What documents are needed for financial aid?"
      ]
    },
    {
      name: "Technical Issues",
      icon: IconSettings,
      color: "#4B5563",
      bgClass: "bg-gray",
      desc: "Campus Wi-Fi credentials, student portal login troubleshooting, password resets, and IT helpdesk tickets.",
      faqsCount: 1,
      samples: [
        "How do I reset my campus Wi-Fi password?",
        "Unable to log into the student portal"
      ]
    },
    {
      name: "Other",
      icon: IconGrid,
      color: "#7C3AED",
      bgClass: "bg-lilac",
      desc: "Library book lending policies, bonafide certificates, duplicate student ID cards, and hostel mess timings.",
      faqsCount: 3,
      samples: [
        "How many library books can I borrow?",
        "How do I get a duplicate ID card?"
      ]
    }
  ];

  return (
    <div className="categories-page-layout">
      {/* Header */}
      <div className="page-header-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="page-icon-square">
            <IconGrid size={22} color="#A65D7B" />
          </div>
          <div>
            <h2 className="page-title">Browse Helpdesk by Category</h2>
            <p className="page-desc">
              Explore official university information organized by administrative departments and services.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="full-categories-grid">
        {categoriesData.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="category-detail-card">
              <div className="cat-card-top">
                <div className={`cat-icon-circle ${cat.bgClass}`}>
                  <Icon size={22} color={cat.color} />
                </div>
                <span className="cat-faq-count-badge">
                  {cat.faqsCount} Approved FAQs
                </span>
              </div>

              <h3 className="cat-card-title">{cat.name}</h3>
              <p className="cat-card-desc">{cat.desc}</p>

              <div className="cat-card-samples">
                <span className="cat-samples-label">Popular Inquiries:</span>
                {cat.samples.map((s, sIdx) => (
                  <button
                    key={sIdx}
                    className="cat-sample-pill"
                    onClick={() => onAskQuestion(s)}
                  >
                    <span>{s}</span>
                    <IconArrowRight size={11} color="#A65D7B" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

