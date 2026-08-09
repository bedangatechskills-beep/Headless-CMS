import { Link } from "react-router-dom";
import { useApi } from "../useApi.js";
import ProjectCard from "../components/ProjectCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Home() {
  const { data: settings, error: settingsError } = useApi("/api/settings");
  const { data: featured } = useApi("/api/projects?featured=true");
  const { data: services } = useApi("/api/services");
  const { data: team } = useApi("/api/team");
  const { data: testimonials } = useApi("/api/testimonials");

  if (settingsError) return <ErrorMessage message={settingsError} />;
  if (!settings) return <Loading />;

  return (
    <main className="container">
      <div className="hero">
        <h1>{settings.heroHeadline}</h1>
        {settings.aboutText && <p>{settings.aboutText}</p>}
      </div>

      <section>
        <h2>Featured work</h2>
        {!featured ? <Loading /> : featured.length === 0 ? (
          <p>No featured projects yet.</p>
        ) : (
          <div className="grid">
            {featured.map((p) => <ProjectCard project={p} key={p._id} />)}
          </div>
        )}
        <p style={{ marginTop: "1.25rem" }}><Link to="/projects">See all projects →</Link></p>
      </section>

      {services && services.length > 0 && (
        <section>
          <h2>What we do</h2>
          <div className="grid">
            {services.map((s) => (
              <div className="service" key={s._id}>
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials && testimonials.length > 0 && (
        <section>
          <h2>Kind words</h2>
          <div className="grid">
            {testimonials.map((t) => (
              <blockquote key={t._id}>
                “{t.quote}”
                <footer>— {t.authorName}{t.authorCompany && `, ${t.authorCompany}`}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {team && team.length > 0 && (
        <section>
          <h2>The team</h2>
          <div className="grid">
            {team.map((m) => (
              <div className="person" key={m._id}>
                {m.photo && <img src={m.photo} alt={m.name} />}
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}