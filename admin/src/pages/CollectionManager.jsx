import { useEffect, useState } from "react";
import { api } from "../api.js";
import ImageUpload from "../components/ImageUpload.jsx";

// Read a dot-path like "socialLinks.github" out of an object.
function getValue(obj, path) {
  return path.split(".").reduce((o, key) => (o == null ? "" : o[key]), obj) ?? "";
}

// Return a copy of obj with the dot-path set to value.
function setValue(obj, path, value) {
  const keys = path.split(".");
  const copy = { ...obj };
  let cursor = copy;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = { ...(cursor[keys[i]] || {}) };
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return copy;
}

export default function CollectionManager({ config }) {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null = list view; {} = new; item = edit
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setItems(await api(`/api/admin/${config.path}`));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    setItems(null);
    setEditing(null);
    setError("");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.path]);

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editing._id) {
        await api(`/api/admin/${config.path}/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(editing)
        });
      } else {
        await api(`/api/admin/${config.path}`, {
          method: "POST",
          body: JSON.stringify(editing)
        });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await api(`/api/admin/${config.path}/${item._id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (items === null && !error) return <p>Loading…</p>;

  return (
    <div>
      <div className="page-header">
        <h2>{config.title}</h2>
        {!editing && (
          <button className="btn" onClick={() => setEditing({})}>+ New</button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {editing ? (
        <form className="panel" onSubmit={handleSave}>
          {config.fields.map((field) => {
            const value = getValue(editing, field.name);
            const update = (v) => setEditing(setValue(editing, field.name, v));

            if (field.type === "textarea") {
              return (
                <label className="field" key={field.name}>
                  {field.label}
                  <textarea rows={4} value={value} required={field.required}
                    onChange={(e) => update(e.target.value)} />
                </label>
              );
            }
            if (field.type === "number") {
              return (
                <label className="field" key={field.name}>
                  {field.label}
                  <input type="number" value={value} required={field.required}
                    onChange={(e) => update(Number(e.target.value))} />
                </label>
              );
            }
            if (field.type === "image") {
              return (
                <div className="field" key={field.name}>
                  <span>{field.label}</span>
                  {value && (
                    <div className="thumbs">
                      <div className="thumb">
                        <img src={value} alt="" />
                        <button type="button" onClick={() => update("")}>×</button>
                      </div>
                    </div>
                  )}
                  <ImageUpload onUploaded={update} />
                </div>
              );
            }
            return (
              <label className="field" key={field.name}>
                {field.label}
                <input value={value} required={field.required}
                  onChange={(e) => update(e.target.value)} />
              </label>
            );
          })}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button type="button" className="btn secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : items.length === 0 ? (
        <p>Nothing here yet — click “+ New”.</p>
      ) : (
        <table>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{config.rowLabel(item)}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn secondary" onClick={() => setEditing(item)}>Edit</button>{" "}
                  <button className="btn danger" onClick={() => handleDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}