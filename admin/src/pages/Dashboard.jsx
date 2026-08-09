import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api("/api/admin/projects"),
      api("/api/admin/services"),
      api("/api/admin/team"),
      api("/api/admin/testimonials")
    ])
      .then(([projects, services, team, testimonials]) =>
        setCounts({
          projects: projects.length,
          published: projects.filter((p) => p.status === "published").length,
          services: services.length,
          team: team.length,
          testimonials: testimonials.length
        })
      )
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!counts) return <p>Loading…</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p style={{ margin: "1rem 0" }}>
        <Link to="/projects">{counts.projects} projects</Link> ({counts.published} published) ·{" "}
        <Link to="/services">{counts.services} services</Link> ·{" "}
        <Link to="/team">{counts.team} team members</Link> ·{" "}
        <Link to="/testimonials">{counts.testimonials} testimonials</Link>
      </p>
      <p>Everything you publish here appears instantly on the public site — that's the headless CMS at work.</p>
    </div>
  );
}