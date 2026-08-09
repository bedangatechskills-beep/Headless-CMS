import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function ProjectsList() {
  const [projects, setProjects] = useState(null); // null = still loading
  const [error, setError] = useState("");

  async function load() {
    try {
      setProjects(await api("/api/admin/projects"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/projects/${project._id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div className="error">{error}</div>;
  if (projects === null) return <p>Loading…</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Projects</h2>
        <Link className="btn" to="/projects/new">+ New project</Link>
      </div>
      {projects.length === 0 ? (
        <p>No projects yet — create your first one.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Title</th><th>Status</th><th>Featured</th><th>Tags</th><th></th></tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td><Link to={`/projects/${p._id}`}>{p.title}</Link></td>
                <td>{p.status}</td>
                <td>{p.featured ? "★" : ""}</td>
                <td>{p.tags.join(", ")}</td>
                <td>
                  <button className="btn danger" onClick={() => handleDelete(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}