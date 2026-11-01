const mongoose = require("mongoose");
const { isMongo, readLocalDb, writeLocalDb } = require("./db");
const { FAQS: INITIAL_FAQS } = require("./faqs");

// Initialize default DB state if empty
function initDb() {
  const db = readLocalDb();
  let changed = false;
  if (!db.records) { db.records = []; changed = true; }
  if (!db.tickets) { db.tickets = []; changed = true; }
  if (!db.faqs || db.faqs.length === 0) {
    db.faqs = [...INITIAL_FAQS];
    changed = true;
  }
  if (!db.conversations) {
    db.conversations = [];
    changed = true;
  }
  if (!db.users || db.users.length === 0) {
    db.users = [
      {
        _id: "u_antara",
        name: "Antara Yogesh Palwankar",
        email: "antara.palwankar@college.edu",
        role: "student",
        studentId: "150096725126",
        program: "B.Tech Computer Science",
        semester: "Semester 5",
        avatarLetter: "A"
      },
      {
        _id: "u_admin",
        name: "Campus Helpdesk Admin",
        email: "admin@college.edu",
        role: "admin",
        studentId: "ADM-001",
        department: "Dean Student Affairs",
        program: "Administration Lead",
        avatarLetter: "A"
      }
    ];
    changed = true;
  }
  if (!db.feedback) { db.feedback = []; changed = true; }
  if (!db.auditLogs) { db.auditLogs = []; changed = true; }
  if (changed) writeLocalDb(db);
}

initDb();

// Generic query builder for arrays
function createQuery(items) {
  let list = items.map((x) => ({ ...x }));
  const q = {
    sort(sortObj) {
      if (sortObj && typeof sortObj === "object") {
        const key = Object.keys(sortObj)[0];
        const dir = sortObj[key];
        list.sort((a, b) => {
          const va = a[key] ?? "";
          const vb = b[key] ?? "";
          if (va < vb) return dir === -1 ? 1 : -1;
          if (va > vb) return dir === -1 ? -1 : 1;
          return 0;
        });
      }
      return q;
    },
    limit(num) {
      list = list.slice(0, num);
      return q;
    },
    lean() {
      return list;
    },
    then(resolve, reject) {
      return Promise.resolve(list).then(resolve, reject);
    }
  };
  return q;
}

// Record Model
const Record = {
  async create(data) {
    const db = readLocalDb();
    const now = new Date().toISOString();
    const doc = {
      _id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
      createdAt: now,
      updatedAt: now,
      ...data
    };
    db.records = db.records || [];
    db.records.push(doc);
    writeLocalDb(db);
    return doc;
  },
  find(filter = {}) {
    const db = readLocalDb();
    let records = db.records || [];
    if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
      records = records.filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v));
    }
    return createQuery(records);
  },
  async countDocuments(filter = {}) {
    const db = readLocalDb();
    return (db.records || []).length;
  },
  async deleteMany() {
    const db = readLocalDb();
    db.records = [];
    writeLocalDb(db);
    return { acknowledged: true };
  }
};

// Ticket Model
const Ticket = {
  async create(data) {
    const db = readLocalDb();
    const now = new Date().toISOString();
    const doc = {
      _id: "tkt_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
      status: "OPEN",
      department: data.department || (data.urgency === "High" ? "Campus Security & Dean" : "Student Helpdesk Staff"),
      createdAt: now,
      updatedAt: now,
      ...data
    };
    db.tickets = db.tickets || [];
    db.tickets.push(doc);
    writeLocalDb(db);
    return doc;
  },
  find(filter = {}) {
    const db = readLocalDb();
    let tickets = db.tickets || [];
    if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
      tickets = tickets.filter((t) => Object.entries(filter).every(([k, v]) => t[k] === v));
    }
    return createQuery(tickets);
  },
  async findOne(filter = {}) {
    const db = readLocalDb();
    return (db.tickets || []).find((t) => Object.entries(filter).every(([k, v]) => t[k] === v)) || null;
  },
  async countDocuments(filter = {}) {
    const db = readLocalDb();
    let tickets = db.tickets || [];
    if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
      tickets = tickets.filter((t) => Object.entries(filter).every(([k, v]) => t[k] === v));
    }
    return tickets.length;
  },
  async updateOne(filter = {}, update = {}) {
    const db = readLocalDb();
    let updated = false;
    for (const t of db.tickets || []) {
      const match = Object.entries(filter).every(([k, v]) => t[k] === v);
      if (match) {
        if (update.$set) Object.assign(t, update.$set);
        else Object.assign(t, update);
        t.updatedAt = new Date().toISOString();
        updated = true;
        break;
      }
    }
    if (updated) writeLocalDb(db);
    return { acknowledged: true, modifiedCount: updated ? 1 : 0 };
  },
  async deleteMany() {
    const db = readLocalDb();
    db.tickets = [];
    writeLocalDb(db);
    return { acknowledged: true };
  }
};

// FAQ Model
const FAQ = {
  find(filter = {}) {
    const db = readLocalDb();
    let faqs = db.faqs || [];
    if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
      faqs = faqs.filter((f) => Object.entries(filter).every(([k, v]) => f[k] === v));
    }
    return createQuery(faqs);
  },
  async create(data) {
    const db = readLocalDb();
    const id = data.id || "F" + (db.faqs.length + 1);
    const doc = { id, approved: true, isAIGenerated: false, ...data };
    db.faqs.push(doc);
    writeLocalDb(db);
    return doc;
  },
  async updateOne(filter = {}, update = {}) {
    const db = readLocalDb();
    let updated = false;
    for (const f of db.faqs || []) {
      const match = Object.entries(filter).every(([k, v]) => f[k] === v);
      if (match) {
        if (update.$set) Object.assign(f, update.$set);
        else Object.assign(f, update);
        updated = true;
        break;
      }
    }
    if (updated) writeLocalDb(db);
    return { acknowledged: true, modifiedCount: updated ? 1 : 0 };
  },
  async deleteOne(filter = {}) {
    const db = readLocalDb();
    const idx = (db.faqs || []).findIndex((f) => Object.entries(filter).every(([k, v]) => f[k] === v));
    if (idx !== -1) {
      db.faqs.splice(idx, 1);
      writeLocalDb(db);
      return { acknowledged: true, deletedCount: 1 };
    }
    return { acknowledged: true, deletedCount: 0 };
  }
};

// Conversation Model
const Conversation = {
  find(filter = {}) {
    const db = readLocalDb();
    let convs = db.conversations || [];
    if (filter && typeof filter === "object" && Object.keys(filter).length > 0) {
      convs = convs.filter((c) => Object.entries(filter).every(([k, v]) => c[k] === v));
    }
    return createQuery(convs);
  },
  async findById(id) {
    const db = readLocalDb();
    return (db.conversations || []).find((c) => c._id === id) || null;
  },
  async create(data) {
    const db = readLocalDb();
    const doc = {
      _id: "conv_" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      ...data
    };
    db.conversations = db.conversations || [];
    db.conversations.push(doc);
    writeLocalDb(db);
    return doc;
  },
  async addMessage(convId, message) {
    const db = readLocalDb();
    const conv = (db.conversations || []).find((c) => c._id === convId);
    if (!conv) return null;
    conv.messages = conv.messages || [];
    const msg = {
      id: "m_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...message
    };
    conv.messages.push(msg);
    conv.updatedAt = new Date().toISOString();
    writeLocalDb(db);
    return msg;
  }
};

// Feedback Model
const Feedback = {
  async create(data) {
    const db = readLocalDb();
    const doc = {
      _id: "fb_" + Date.now(),
      createdAt: new Date().toISOString(),
      ...data
    };
    db.feedback = db.feedback || [];
    db.feedback.push(doc);
    writeLocalDb(db);
    return doc;
  },
  find() {
    const db = readLocalDb();
    return createQuery(db.feedback || []);
  }
};

// AuditLog Model
const AuditLog = {
  async log(action, performedBy, details) {
    const db = readLocalDb();
    const doc = {
      _id: "log_" + Date.now(),
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString()
    };
    db.auditLogs = db.auditLogs || [];
    db.auditLogs.push(doc);
    writeLocalDb(db);
    return doc;
  },
  find() {
    const db = readLocalDb();
    return createQuery(db.auditLogs || []);
  }
};

// User Model with dynamic user registration support
const User = {
  find() {
    const db = readLocalDb();
    return createQuery(db.users || []);
  },
  async findOne(filter = {}) {
    const db = readLocalDb();
    return (db.users || []).find((u) => {
      return Object.entries(filter).every(([k, v]) => {
        if (typeof u[k] === "string" && typeof v === "string") {
          return u[k].toLowerCase() === v.toLowerCase();
        }
        return u[k] === v;
      });
    }) || null;
  },
  async create(data) {
    const db = readLocalDb();
    const cleanName = data.name || "Student User";
    const doc = {
      _id: "u_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      avatarLetter: cleanName.charAt(0).toUpperCase(),
      role: data.role || "student",
      studentId: data.studentId || "1500" + Math.floor(10000000 + Math.random() * 90000000),
      program: data.program || "B.Tech Computer Science",
      semester: data.semester || "Semester 5",
      ...data
    };
    db.users = db.users || [];
    db.users.push(doc);
    writeLocalDb(db);
    return doc;
  }
};

module.exports = {
  Record,
  Ticket,
  FAQ,
  Conversation,
  Feedback,
  AuditLog,
  User
};
