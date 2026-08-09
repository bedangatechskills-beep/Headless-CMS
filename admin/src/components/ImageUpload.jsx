import { useState } from "react";
import { api } from "../api.js";

// A file picker that uploads to the server (which forwards to Cloudinary)
// and hands the resulting URL to the parent via onUploaded(url).
export default function ImageUpload({ onUploaded }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { url } = await api("/api/uploads", { method: "POST", body: formData });
      onUploaded(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} disabled={busy} />
      {busy && <span> Uploading…</span>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
