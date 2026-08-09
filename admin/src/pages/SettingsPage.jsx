import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/api/admin/settings").then(setSettings).catch((err) => setError(err.message));
  }, []);

  function set(field, value) {
    setSettings((s) => ({ ...s, [field]: value }));
    setSaved(false);
  }
  function setSocial(network, value) {
    setSettings((s) => ({ ...s, socials: { ...(s.socials || {}), [network]: value } }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      setSettings(await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings)
      }));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !settings) return <div className="error">{error}</div>;
  if (!settings) return <p>Loading…</p>;

  return (
    <div>
      <div className="page-header"><h2>Site Settings</h2></div>
      <form className="panel" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {saved && <p>✔ Saved.</p>}
        <label className="field">
          Site name
          <input value={settings.siteName || ""} onChange={(e) => set("siteName", e.target.value)} />
        </label>
        <label className="field">
          Hero headline
          <input value={settings.heroHeadline || ""} onChange={(e) => set("heroHeadline", e.target.value)} />
        </label>
        <label className="field">
          About text
          <textarea rows={5} value={settings.aboutText || ""} onChange={(e) => set("aboutText", e.target.value)} />
        </label>
        <label className="field">
          Contact email
          <input type="email" value={settings.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} />
        </label>
        <label className="field">
          GitHub URL
          <input value={settings.socials?.github || ""} onChange={(e) => setSocial("github", e.target.value)} />
        </label>
        <label className="field">
          LinkedIn URL
          <input value={settings.socials?.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} />
        </label>
        <label className="field">
          Twitter/X URL
          <input value={settings.socials?.twitter || ""} onChange={(e) => setSocial("twitter", e.target.value)} />
        </label>
        <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
      </form>
    </div>
  );
}