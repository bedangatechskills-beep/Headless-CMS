// Read-only client: no tokens, no auth — this site only sees published content.
// Trailing slashes are stripped: a base URL ending in "/" would produce
// "https://api.example.com//api/settings", which matches no Express route
// and comes back as a confusing 404.
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export async function api(path) {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}