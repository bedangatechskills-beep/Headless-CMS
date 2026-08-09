import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link className="card" to={`/projects/${project.slug}`}>
      {project.images[0] ? <img src={project.images[0]} alt={project.title} /> : <div style={{ height: 160, background: "#eef0f7" }} />}
      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tags">
          {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </div>
    </Link>
  );
}