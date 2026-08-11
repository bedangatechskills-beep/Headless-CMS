// The single place the admin app talks to the server through.
// Dashboard-pasted URLs pick up junk: a stray space makes the host
// "...onrender.com%20" (unreachable), and a trailing "/" makes the path
// "//api/auth/login" (matches no Express route). Trim both before use.
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000")
  .trim()
  .replace(/[\s/]+$/, "");

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token) {
  localStorage.setItem("token", token);
}
export function clearToken() {
  localStorage.removeItem("token");
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  // FormData sets its own multipart content-type; everything else is JSON.
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // A 401 on a request we sent a token with means that token is dead:
  // clear it and bounce to the login screen. A 401 with no token is just
  // a failed login attempt — fall through so Login.jsx can show the
  // server's message instead of being wiped out by a page reload.
  if (res.status === 401 && token) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Session expired — please log in again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}