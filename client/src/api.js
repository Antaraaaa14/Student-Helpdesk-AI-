// Base URL for all API calls.
// - In production builds: set VITE_API_URL to your deployed backend URL
//   (e.g. https://your-app.onrender.com). Leave empty when the Express
//   server serves the React build itself (same origin).
// - In development (npm run dev): Vite proxies /api → http://localhost:5001
//   so an empty base URL works automatically.
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function api(url, method = "GET", body) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const r = await fetch(fullUrl, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Request failed (" + r.status + ")");
  return j;
}
