// Database connection module with graceful multi-tier fallbacks:
// Tier 1: MongoDB Atlas (via MONGODB_URI in .env)
// Tier 2: Local MongoDB daemon (mongodb://127.0.0.1:27017/helpdesk)
// Tier 3: High-reliability persistent local JSON store (server/data/helpdesk_db.json)
//
// This guarantees the app NEVER crashes on any Mac or environment, offline or online.

const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load .env automatically without requiring external dependencies
function loadEnv() {
  const candidates = [
    path.join(__dirname, "..", ".env"),
    path.join(__dirname, ".env")
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
        for (const line of lines) {
          const l = line.trim();
          if (!l || l.startsWith("#")) continue;
          if (l.startsWith("mongodb+srv://") || l.startsWith("mongodb://")) {
            if (!process.env.MONGODB_URI) {
              process.env.MONGODB_URI = l.endsWith("/") ? l + "helpdesk?retryWrites=true&w=majority" : l;
            }
          } else {
            const eq = l.indexOf("=");
            if (eq > 0) {
              const k = l.slice(0, eq).trim();
              const v = l.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
              if (!process.env[k]) process.env[k] = v;
            }
          }
        }
      } catch (e) {
        console.warn("Notice: could not parse .env file:", e.message);
      }
    }
  }
}

loadEnv();

let activeMode = "not connected";
let isUsingMongo = false;

// Local persistent file database implementation
const dataDir = path.join(__dirname, "data");
const dbFilePath = path.join(dataDir, "helpdesk_db.json");

function ensureDbFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ records: [], tickets: [] }, null, 2), "utf8");
  }
}

function readLocalDb() {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return { records: [], tickets: [] };
  }
}

function writeLocalDb(data) {
  ensureDbFile();
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Local DB write error:", err.message);
  }
}

async function connect() {
  const uris = [process.env.MONGODB_URI, "mongodb://127.0.0.1:27017/helpdesk"].filter(Boolean);

  for (const uri of uris) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      isUsingMongo = true;
      const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
      activeMode = "MongoDB (" + (uri.includes("mongodb+srv") ? "Atlas Cloud" : "Local Port 27017") + ": " + masked + ")";
      return activeMode;
    } catch {
      // Try next MongoDB option
    }
  }

  // Graceful fallback to persistent JSON storage
  ensureDbFile();
  isUsingMongo = false;
  activeMode = "Persistent Local Storage (server/data/helpdesk_db.json)";
  console.log("Using persistent local database storage: " + dbFilePath);
  return activeMode;
}

function getMode() {
  return activeMode;
}

function isMongo() {
  return isUsingMongo;
}

module.exports = {
  connect,
  getMode,
  isMongo,
  readLocalDb,
  writeLocalDb,
  loadEnv
};
