import { Link, NavLink } from "react-router-dom";
import { useApi } from "../useApi.js";

export default function Nav() {
  const { data: settings } = useApi("/api/settings");

  return (
    <header className="nav">
      <Link to="/" className="brand">{settings?.siteName || "…"}</Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
      </nav>
    </header>
  );
}