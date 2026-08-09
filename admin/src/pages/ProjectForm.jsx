import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import ImageUpload from "../components/ImageUpload.jsx";

const emptyProject = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  images: [],
  tags: [],
  featured: false,
  status: "draft"
};

// Turn "Neon Coffee Brand Site" into "neon-coffee-brand-site"
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function ProjectForm() {
  const { id } = useParams();               // undefined on /projects/new
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [project, setProject] = useState(isEdit ? null : emptyProject);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Tags are edited as raw text, not as an array. Re-parsing on every
  // keystroke would delete the comma the instant you typed it, so the
  // string stays the source of truth while you type and only becomes an
  // array on save.
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (isEdit) {
      api(`/api/admin/projects/${id}`)
        .then((p) => {
          setProject(p);
          setTagsText(p.tags.join(", "));
        })
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  function set(field, value) {
    setProject((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Split the tag text only now, on the way out.
      const payload = {
        ...project,
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean)
      };
      if (isEdit) {
        await api(`/api/admin/projects/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await api("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !project) return <div className="error">{error}</div>;
  if (!project) return <p>Loading…</p>;

  return (
    <div>
      <div className="page-header">
        <h2>{isEdit ? "Edit project" : "New project"}</h2>
      </div>
      <form className="panel" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <label className="field">
          Title
          <input value={project.title} onChange={(e) => set("title", e.target.value)} required />
        </label>

        <label className="field">
          Slug (the URL: /projects/your-slug)
          <input value={project.slug} onChange={(e) => set("slug", e.target.value)} required />
        </label>
        <button type="button" className="btn secondary" onClick={() => set("slug", slugify(project.title))}>
          Generate slug from title
        </button>

        <label className="field">
          Summary (one sentence, shown on cards)
          <input value={project.summary} onChange={(e) => set("summary", e.target.value)} />
        </label>

        <label className="field">
          Body (markdown)
          <textarea rows={8} value={project.body} onChange={(e) => set("body", e.target.value)} />
        </label>

        <label className="field">
          Tags (comma-separated)
          <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={project.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured on the home page
        </label>

        <label className="field">
          Status
          <select value={project.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">draft (hidden from public site)</option>
            <option value="published">published</option>
          </select>
        </label>

        <div className="field">
          <span>Images</span>
          <div className="thumbs">
            {project.images.map((url) => (
              <div className="thumb" key={url}>
                <img src={url} alt="" />
                <button
                  type="button"
                  onClick={() => set("images", project.images.filter((u) => u !== url))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <ImageUpload onUploaded={(url) => set("images", [...project.images, url])} />
        </div>

        <button className="btn" disabled={busy}>
          {busy ? "Saving…" : "Save project"}
        </button>
      </form>
    </div>
  );
}
