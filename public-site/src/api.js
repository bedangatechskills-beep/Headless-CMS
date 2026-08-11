// Read-only client: no tokens, no auth — this site only sees published content.
// Dashboard-pasted URLs pick up junk: a stray space makes the host
// "...onrender.com%20" (unreachable), and a trailing "/" makes the path
// "//api/settings" (matches no Express route). Trim both before use.
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000")
  .trim()
  .replace(/[\s/]+$/, "");

export async function api(path) {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}