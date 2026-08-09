import { Link, useParams } from "react-router-dom";
import { useApi } from "../useApi.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, error } = useApi(`/api/projects/${slug}`);

  if (error) {
    return (
      <main className="container">
        <ErrorMessage message={error} />
        <p style={{ textAlign: "center" }}><Link to="/projects">← Back to all projects</Link></p>
      </main>
    );
  }
  if (!project) return <Loading />;

  return (
    <main className="container detail">
      <p style={{ marginTop: "1rem" }}><Link to="/projects">← All projects</Link></p>
      <h1>{project.title}</h1>
      <p>
        {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </p>
      {project.images.length > 0 && (
        <div className="gallery">
          {project.images.map((url) => <img src={url} alt={project.title} key={url} />)}
        </div>
      )}
      {/* The body is markdown text rendered as plain text (pre-wrap keeps
          line breaks). Rendering real markdown (e.g. the `marked` library +
          sanitization) is a documented stretch goal. */}
      <div className="body">{project.body}</div>
    </main>
  );
}