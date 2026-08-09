import { useState } from "react";
import { useApi } from "../useApi.js";
import ProjectCard from "../components/ProjectCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Projects() {
  const { data: projects, error } = useApi("/api/projects");
  const [activeTag, setActiveTag] = useState("");

  if (error) return <ErrorMessage message={error} />;
  if (!projects) return <Loading />;

  // Unique tags across all published projects, for the filter chips.
  // (Filtering happens client-side here; the API also supports ?tag= —
  // the class demo shows both and discusses when each belongs.)
  const tags = [...new Set(projects.flatMap((p) => p.tags))].sort();
  const visible = activeTag ? projects.filter((p) => p.tags.includes(activeTag)) : projects;

  return (
    <main className="container">
      <section>
        <h2>All projects</h2>
        {tags.length > 0 && (
          <p style={{ marginBottom: "1.5rem" }}>
            <button className={`tag ${activeTag === "" ? "active" : ""}`} onClick={() => setActiveTag("")}>
              all
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag ${activeTag === tag ? "active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </p>
        )}
        {visible.length === 0 ? (
          <p>No projects{activeTag && ` tagged “${activeTag}”`} yet.</p>
        ) : (
          <div className="grid">
            {visible.map((p) => <ProjectCard project={p} key={p._id} />)}
          </div>
        )}
      </section>
    </main>
  );
}